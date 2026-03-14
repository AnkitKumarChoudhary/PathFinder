import json
import pickle
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


class CareerRecommender:
    def __init__(self):
        self.rf_model = None
        self.knn_model = None
        self.scaler = None
        self.career_vectors = None
        self.skills_mapping = None
        self.riasec_mapping = None
        self.is_loaded = False
        self.dataset_size = 0
        self.careers_supported = 0
        self.feature_names = [
            "aptitude_logical",
            "aptitude_verbal",
            "aptitude_numerical",
            "aptitude_spatial",
            "personality_openness",
            "personality_conscientiousness",
            "personality_extraversion",
            "personality_agreeableness",
            "personality_neuroticism",
            "interest_realistic",
            "interest_investigative",
            "interest_artistic",
            "interest_social",
            "interest_enterprising",
            "interest_conventional",
        ]

    def load_models(self):
        data_dir = Path(__file__).resolve().parents[1] / "data"

        with open(data_dir / "rf_model.pkl", "rb") as file:
            self.rf_model = pickle.load(file)
        with open(data_dir / "knn_model.pkl", "rb") as file:
            self.knn_model = pickle.load(file)
        with open(data_dir / "scaler.pkl", "rb") as file:
            self.scaler = pickle.load(file)
        with open(data_dir / "career_vectors.pkl", "rb") as file:
            self.career_vectors = pickle.load(file)
        with open(data_dir / "skills_mapping.json", "r", encoding="utf-8") as file:
            self.skills_mapping = json.load(file)
        with open(data_dir / "riasec_mapping.json", "r", encoding="utf-8") as file:
            self.riasec_mapping = json.load(file)

        dataset_path = data_dir / "careers_dataset.csv"
        if dataset_path.exists():
            df = pd.read_csv(dataset_path)
            self.dataset_size = len(df)
            self.careers_supported = df["career_outcome"].nunique()
        else:
            self.careers_supported = len(self.career_vectors.get("vectors", {}))

        self.is_loaded = True
        print("Career recommender models loaded successfully ✅")

    def _profile_to_vector(self, student_profile: Dict[str, Any]) -> np.ndarray:
        vector = [float(student_profile.get(name, 0.0)) for name in self.feature_names]
        return np.array(vector, dtype=float).reshape(1, -1)

    def _confidence_label(self, score: float) -> str:
        if score >= 75:
            return "high"
        if score >= 55:
            return "medium"
        return "low"

    def _generate_reasons(self, profile: Dict[str, Any], career: str) -> List[str]:
        aptitude_pairs = {
            "Logical reasoning": profile.get("aptitude_logical", 0),
            "Verbal ability": profile.get("aptitude_verbal", 0),
            "Numerical ability": profile.get("aptitude_numerical", 0),
            "Spatial ability": profile.get("aptitude_spatial", 0),
        }
        top_aptitude = max(aptitude_pairs.items(), key=lambda x: x[1])

        riasec_pairs = {
            "R": profile.get("interest_realistic", 0),
            "I": profile.get("interest_investigative", 0),
            "A": profile.get("interest_artistic", 0),
            "S": profile.get("interest_social", 0),
            "E": profile.get("interest_enterprising", 0),
            "C": profile.get("interest_conventional", 0),
        }
        top_riasec = max(riasec_pairs.items(), key=lambda x: x[1])[0]

        personality_pairs = {
            "Openness": profile.get("personality_openness", 0),
            "Conscientiousness": profile.get("personality_conscientiousness", 0),
            "Extraversion": profile.get("personality_extraversion", 0),
            "Agreeableness": profile.get("personality_agreeableness", 0),
            "Neuroticism": profile.get("personality_neuroticism", 0),
        }
        top_trait = max(personality_pairs.items(), key=lambda x: x[1])

        riasec_name = self.riasec_mapping.get(top_riasec, {}).get("name", top_riasec)

        return [
            f"Strong {top_aptitude[0].lower()} ({top_aptitude[1]:.1f}) aligns with {career}",
            f"Your dominant {riasec_name} interest profile supports this path",
            f"{top_trait[0]} ({top_trait[1]:.1f}) suggests a good behavioral fit",
        ]

    def predict_careers(self, student_profile: dict) -> list:
        if not self.is_loaded:
            raise RuntimeError("Models not loaded")

        input_vec = self._profile_to_vector(student_profile)

        # Random Forest probabilities
        rf_proba = self.rf_model.predict_proba(input_vec)[0]
        rf_scores = {
            cls: float(prob * 100.0)
            for cls, prob in zip(self.rf_model.classes_, rf_proba)
        }

        # KNN frequency + inverse distance weighting
        scaled_vec = self.scaler.transform(input_vec)
        distances, indices = self.knn_model.kneighbors(scaled_vec, n_neighbors=10)
        knn_scores: Dict[str, float] = {}
        for distance, index in zip(distances[0], indices[0]):
            label_index = int(self.knn_model._y[index])
            career = str(self.knn_model.classes_[label_index])
            contribution = 1.0 / (float(distance) + 1e-6)
            knn_scores[career] = knn_scores.get(career, 0.0) + contribution

        if knn_scores:
            max_knn = max(knn_scores.values())
            knn_scores = {career: (score / max_knn) * 100.0 for career, score in knn_scores.items()}

        # Cosine similarity with career profile vectors
        cosine_scores: Dict[str, float] = {}
        vectors = self.career_vectors.get("vectors", {})
        for career, vector in vectors.items():
            career_vec = np.array(vector, dtype=float).reshape(1, -1)
            similarity = cosine_similarity(scaled_vec, career_vec)[0][0]
            cosine_scores[career] = float(max(0.0, similarity) * 100.0)

        # Ensemble score
        all_careers = set(rf_scores.keys()) | set(knn_scores.keys()) | set(cosine_scores.keys())
        ensemble = {}
        for career in all_careers:
            ensemble[career] = (
                0.4 * rf_scores.get(career, 0.0)
                + 0.3 * knn_scores.get(career, 0.0)
                + 0.3 * cosine_scores.get(career, 0.0)
            )

        max_ensemble = max(ensemble.values()) if ensemble else 100.0
        recommendations = []
        for career, score in sorted(ensemble.items(), key=lambda x: x[1], reverse=True)[:10]:
            match_percentage = (score / max_ensemble) * 100.0 if max_ensemble > 0 else 0.0
            recommendations.append(
                {
                    "career": career,
                    "match_percentage": round(float(match_percentage), 2),
                    "confidence": self._confidence_label(match_percentage),
                    "reasons": self._generate_reasons(student_profile, career),
                    "method": "ensemble",
                }
            )

        return recommendations

    def analyze_skill_gaps(self, student_skills: list, target_career: str) -> dict:
        if not self.is_loaded:
            raise RuntimeError("Models not loaded")

        career_name = None
        for mapped in self.skills_mapping.keys():
            if mapped.lower() == target_career.lower():
                career_name = mapped
                break
        if not career_name:
            raise ValueError(f"Career '{target_career}' not found in mapping")

        required = self.skills_mapping[career_name]["required_skills"]
        student_normalized = {s.strip().lower() for s in student_skills}

        matching = [skill for skill in required if skill.lower() in student_normalized]
        missing = [skill for skill in required if skill.lower() not in student_normalized]

        resources = [
            {
                "skill": skill,
                "resource": f"Recommended learning path for {skill} (NPTEL / Coursera / YouTube)",
            }
            for skill in missing
        ]

        percentage = (len(matching) / len(required) * 100.0) if required else 0.0

        return {
            "career": career_name,
            "match_percentage": round(percentage, 2),
            "matching_skills": matching,
            "missing_skills": missing,
            "recommended_resources": resources,
        }

    def get_riasec_analysis(self, riasec_scores: dict) -> dict:
        if not self.is_loaded:
            raise RuntimeError("Models not loaded")

        normalized = {
            "R": float(riasec_scores.get("R", riasec_scores.get("realistic", 0.0))),
            "I": float(riasec_scores.get("I", riasec_scores.get("investigative", 0.0))),
            "A": float(riasec_scores.get("A", riasec_scores.get("artistic", 0.0))),
            "S": float(riasec_scores.get("S", riasec_scores.get("social", 0.0))),
            "E": float(riasec_scores.get("E", riasec_scores.get("enterprising", 0.0))),
            "C": float(riasec_scores.get("C", riasec_scores.get("conventional", 0.0))),
        }

        ranked = sorted(normalized.items(), key=lambda x: x[1], reverse=True)
        primary, secondary, tertiary = ranked[:3]
        code = f"{primary[0]}{secondary[0]}{tertiary[0]}"

        careers = []
        for key, _ in [primary, secondary, tertiary]:
            careers.extend(self.riasec_mapping.get(key, {}).get("careers", []))
        matching_careers = list(dict.fromkeys(careers))

        type_descriptions = {
            self.riasec_mapping[k]["name"]: {
                "score": round(v, 2),
                "description": self.riasec_mapping[k]["description"],
            }
            for k, v in ranked
            if k in self.riasec_mapping
        }

        return {
            "primary_type": self.riasec_mapping[primary[0]]["name"],
            "secondary_type": self.riasec_mapping[secondary[0]]["name"],
            "tertiary_type": self.riasec_mapping[tertiary[0]]["name"],
            "code": code,
            "description": f"Your {code} code suggests strongest alignment with {self.riasec_mapping[primary[0]]['name']} and {self.riasec_mapping[secondary[0]]['name']} environments.",
            "matching_careers": matching_careers,
            "type_descriptions": type_descriptions,
        }

    def get_personality_insights(self, big_five_scores: dict) -> dict:
        if not self.is_loaded:
            raise RuntimeError("Models not loaded")

        traits = {
            "Openness": float(big_five_scores.get("Openness", big_five_scores.get("O", big_five_scores.get("openness", 0.0)))),
            "Conscientiousness": float(big_five_scores.get("Conscientiousness", big_five_scores.get("C", big_five_scores.get("conscientiousness", 0.0)))),
            "Extraversion": float(big_five_scores.get("Extraversion", big_five_scores.get("E", big_five_scores.get("extraversion", 0.0)))),
            "Agreeableness": float(big_five_scores.get("Agreeableness", big_five_scores.get("A", big_five_scores.get("agreeableness", 0.0)))),
            "Neuroticism": float(big_five_scores.get("Neuroticism", big_five_scores.get("N", big_five_scores.get("neuroticism", 0.0)))),
        }

        def level(score: float) -> str:
            if score >= 4.0:
                return "High"
            if score >= 2.5:
                return "Moderate"
            return "Low"

        implications = {
            "Openness": "Careers in research, design, and innovation suit you well.",
            "Conscientiousness": "Structured and responsibility-heavy roles are a strong fit.",
            "Extraversion": "Collaborative, leadership, and client-facing roles can energize you.",
            "Agreeableness": "Helping professions and people-oriented careers may be rewarding.",
            "Neuroticism": "Lower-pressure, stable environments may improve long-term performance.",
        }

        sorted_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)
        dominant = [name for name, _ in sorted_traits[:2]]

        trait_analysis = {
            name: {
                "score": round(score, 2),
                "level": level(score),
                "description": f"Your {name.lower()} score is {level(score).lower()}, indicating this trait noticeably influences your work style.",
                "career_implications": implications[name],
            }
            for name, score in traits.items()
        }

        suitable_environments = []
        if traits["Openness"] >= 3.8:
            suitable_environments.append("Creative and flexible workplaces")
        if traits["Conscientiousness"] >= 3.8:
            suitable_environments.append("Structured and goal-driven organizations")
        if traits["Extraversion"] >= 3.8:
            suitable_environments.append("Collaborative team settings")
        if traits["Agreeableness"] >= 3.8:
            suitable_environments.append("People-centric and support-oriented roles")
        if traits["Neuroticism"] <= 2.5:
            suitable_environments.append("Fast-paced roles requiring calm decision-making")
        if not suitable_environments:
            suitable_environments.append("Balanced environments with mentorship and clear expectations")

        return {
            "dominant_traits": dominant,
            "trait_analysis": trait_analysis,
            "suitable_work_environments": suitable_environments,
        }

    def get_similar_careers(self, career_name: str, top_n: int = 5) -> List[Dict[str, Any]]:
        vectors = self.career_vectors.get("vectors", {})
        target = None
        for key in vectors.keys():
            if key.lower() == career_name.lower():
                target = key
                break
        if target is None:
            raise ValueError(f"Career '{career_name}' not found")

        target_vec = np.array(vectors[target], dtype=float).reshape(1, -1)
        scores = []
        for career, vector in vectors.items():
            if career == target:
                continue
            sim = cosine_similarity(target_vec, np.array(vector, dtype=float).reshape(1, -1))[0][0]
            scores.append({"career": career, "similarity": round(float(max(0.0, sim) * 100.0), 2)})

        return sorted(scores, key=lambda x: x["similarity"], reverse=True)[:top_n]
