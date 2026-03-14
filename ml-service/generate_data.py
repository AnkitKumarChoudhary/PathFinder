import json
import random
from pathlib import Path

import numpy as np
import pandas as pd

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "app" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

FEATURE_COLUMNS = [
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

CAREERS = [
    "Software Engineer",
    "Data Scientist",
    "AI/ML Engineer",
    "Cybersecurity Analyst",
    "Cloud Architect",
    "Mechanical Engineer",
    "Civil Engineer",
    "Doctor (MBBS)",
    "Dentist",
    "Pharmacist",
    "Biomedical Engineer",
    "Clinical Psychologist",
    "Physiotherapist",
    "Chartered Accountant",
    "Investment Banker",
    "Management Consultant",
    "Digital Marketing Manager",
    "Product Manager",
    "Entrepreneur",
    "Corporate Lawyer",
    "Civil Lawyer",
    "UX/UI Designer",
    "Graphic Designer",
    "Architect",
    "Fashion Designer",
    "Journalist",
    "Film Director",
    "Content Writer",
    "IAS Officer",
    "Defence Officer (Indian Armed Forces)",
    "Environmental Scientist",
    "Sports Manager",
    "Chef / Culinary Arts",
    "Airline Pilot",
]

ARCHETYPES = {
    "tech_analytic": {
        "ranges": {
            "aptitude_logical": (68, 97),
            "aptitude_verbal": (45, 82),
            "aptitude_numerical": (65, 98),
            "aptitude_spatial": (52, 90),
            "personality_openness": (3.0, 4.9),
            "personality_conscientiousness": (3.1, 4.8),
            "personality_extraversion": (1.8, 4.1),
            "personality_agreeableness": (2.2, 4.3),
            "personality_neuroticism": (1.3, 3.7),
            "interest_realistic": (2.7, 5.0),
            "interest_investigative": (3.6, 5.0),
            "interest_artistic": (1.4, 3.9),
            "interest_social": (1.3, 3.8),
            "interest_enterprising": (1.6, 4.0),
            "interest_conventional": (1.7, 4.2),
        }
    },
    "medical_care": {
        "ranges": {
            "aptitude_logical": (55, 92),
            "aptitude_verbal": (58, 97),
            "aptitude_numerical": (62, 95),
            "aptitude_spatial": (45, 85),
            "personality_openness": (2.5, 4.6),
            "personality_conscientiousness": (3.4, 5.0),
            "personality_extraversion": (2.2, 4.5),
            "personality_agreeableness": (3.5, 5.0),
            "personality_neuroticism": (1.2, 3.9),
            "interest_realistic": (1.8, 4.2),
            "interest_investigative": (3.5, 5.0),
            "interest_artistic": (1.2, 3.7),
            "interest_social": (3.4, 5.0),
            "interest_enterprising": (1.2, 3.8),
            "interest_conventional": (1.6, 4.3),
        }
    },
    "finance_structured": {
        "ranges": {
            "aptitude_logical": (63, 96),
            "aptitude_verbal": (50, 88),
            "aptitude_numerical": (72, 99),
            "aptitude_spatial": (40, 80),
            "personality_openness": (2.2, 4.5),
            "personality_conscientiousness": (3.5, 5.0),
            "personality_extraversion": (2.0, 4.7),
            "personality_agreeableness": (2.1, 4.4),
            "personality_neuroticism": (1.3, 4.1),
            "interest_realistic": (1.4, 3.8),
            "interest_investigative": (2.6, 4.8),
            "interest_artistic": (1.0, 3.5),
            "interest_social": (1.4, 4.0),
            "interest_enterprising": (2.8, 5.0),
            "interest_conventional": (3.4, 5.0),
        }
    },
    "creative_design": {
        "ranges": {
            "aptitude_logical": (42, 84),
            "aptitude_verbal": (48, 96),
            "aptitude_numerical": (35, 78),
            "aptitude_spatial": (62, 99),
            "personality_openness": (3.7, 5.0),
            "personality_conscientiousness": (2.3, 4.7),
            "personality_extraversion": (2.4, 4.9),
            "personality_agreeableness": (2.2, 4.8),
            "personality_neuroticism": (1.4, 4.5),
            "interest_realistic": (1.2, 4.2),
            "interest_investigative": (1.4, 4.0),
            "interest_artistic": (3.8, 5.0),
            "interest_social": (2.3, 5.0),
            "interest_enterprising": (1.7, 4.8),
            "interest_conventional": (1.0, 3.5),
        }
    },
    "governance_leader": {
        "ranges": {
            "aptitude_logical": (70, 99),
            "aptitude_verbal": (70, 99),
            "aptitude_numerical": (70, 99),
            "aptitude_spatial": (70, 98),
            "personality_openness": (3.0, 5.0),
            "personality_conscientiousness": (4.0, 5.0),
            "personality_extraversion": (3.0, 5.0),
            "personality_agreeableness": (3.1, 5.0),
            "personality_neuroticism": (1.0, 3.8),
            "interest_realistic": (2.0, 4.5),
            "interest_investigative": (2.8, 5.0),
            "interest_artistic": (1.3, 4.1),
            "interest_social": (4.0, 5.0),
            "interest_enterprising": (3.5, 5.0),
            "interest_conventional": (2.1, 4.8),
        }
    },
    "communication_social": {
        "ranges": {
            "aptitude_logical": (42, 86),
            "aptitude_verbal": (70, 100),
            "aptitude_numerical": (35, 80),
            "aptitude_spatial": (35, 85),
            "personality_openness": (3.3, 5.0),
            "personality_conscientiousness": (2.6, 4.8),
            "personality_extraversion": (3.4, 5.0),
            "personality_agreeableness": (3.0, 5.0),
            "personality_neuroticism": (1.4, 4.6),
            "interest_realistic": (1.0, 3.4),
            "interest_investigative": (1.4, 4.1),
            "interest_artistic": (3.2, 5.0),
            "interest_social": (3.5, 5.0),
            "interest_enterprising": (2.1, 4.8),
            "interest_conventional": (1.0, 3.8),
        }
    },
    "law_logic": {
        "ranges": {
            "aptitude_logical": (63, 96),
            "aptitude_verbal": (68, 100),
            "aptitude_numerical": (45, 90),
            "aptitude_spatial": (35, 82),
            "personality_openness": (2.7, 4.8),
            "personality_conscientiousness": (3.3, 5.0),
            "personality_extraversion": (2.3, 4.8),
            "personality_agreeableness": (2.0, 4.7),
            "personality_neuroticism": (1.3, 4.2),
            "interest_realistic": (1.1, 3.5),
            "interest_investigative": (2.6, 4.9),
            "interest_artistic": (1.5, 4.0),
            "interest_social": (2.8, 4.9),
            "interest_enterprising": (3.0, 5.0),
            "interest_conventional": (2.2, 4.9),
        }
    },
    "practical_hands": {
        "ranges": {
            "aptitude_logical": (48, 88),
            "aptitude_verbal": (35, 78),
            "aptitude_numerical": (45, 90),
            "aptitude_spatial": (60, 98),
            "personality_openness": (2.0, 4.5),
            "personality_conscientiousness": (3.0, 4.9),
            "personality_extraversion": (2.0, 4.6),
            "personality_agreeableness": (2.1, 4.7),
            "personality_neuroticism": (1.1, 4.2),
            "interest_realistic": (3.5, 5.0),
            "interest_investigative": (2.0, 4.5),
            "interest_artistic": (1.3, 4.5),
            "interest_social": (1.2, 4.4),
            "interest_enterprising": (1.5, 4.6),
            "interest_conventional": (1.8, 4.8),
        }
    },
    "management_enterprising": {
        "ranges": {
            "aptitude_logical": (60, 94),
            "aptitude_verbal": (55, 95),
            "aptitude_numerical": (54, 92),
            "aptitude_spatial": (40, 86),
            "personality_openness": (2.8, 4.9),
            "personality_conscientiousness": (3.1, 5.0),
            "personality_extraversion": (3.2, 5.0),
            "personality_agreeableness": (2.2, 4.8),
            "personality_neuroticism": (1.2, 4.2),
            "interest_realistic": (1.2, 3.8),
            "interest_investigative": (2.0, 4.7),
            "interest_artistic": (1.2, 4.3),
            "interest_social": (2.2, 4.9),
            "interest_enterprising": (3.4, 5.0),
            "interest_conventional": (2.0, 4.7),
        }
    },
}

CAREER_CONFIG = {
    "Software Engineer": {"archetype": "tech_analytic", "stream_probs": {"science_pcm": 0.78, "commerce": 0.08, "vocational": 0.07, "undecided": 0.07}},
    "Data Scientist": {"archetype": "tech_analytic", "stream_probs": {"science_pcm": 0.7, "commerce": 0.1, "science_pcb": 0.07, "undecided": 0.13}},
    "AI/ML Engineer": {"archetype": "tech_analytic", "stream_probs": {"science_pcm": 0.8, "commerce": 0.06, "vocational": 0.06, "undecided": 0.08}},
    "Cybersecurity Analyst": {"archetype": "tech_analytic", "stream_probs": {"science_pcm": 0.68, "commerce": 0.11, "vocational": 0.11, "undecided": 0.1}},
    "Cloud Architect": {"archetype": "tech_analytic", "stream_probs": {"science_pcm": 0.7, "commerce": 0.08, "vocational": 0.1, "undecided": 0.12}},
    "Mechanical Engineer": {"archetype": "practical_hands", "stream_probs": {"science_pcm": 0.83, "vocational": 0.1, "undecided": 0.07}},
    "Civil Engineer": {"archetype": "practical_hands", "stream_probs": {"science_pcm": 0.8, "vocational": 0.12, "undecided": 0.08}},
    "Doctor (MBBS)": {"archetype": "medical_care", "stream_probs": {"science_pcb": 0.85, "science_pcm": 0.05, "undecided": 0.1}},
    "Dentist": {"archetype": "medical_care", "stream_probs": {"science_pcb": 0.82, "science_pcm": 0.06, "undecided": 0.12}},
    "Pharmacist": {"archetype": "medical_care", "stream_probs": {"science_pcb": 0.64, "science_pcm": 0.24, "undecided": 0.12}},
    "Biomedical Engineer": {"archetype": "medical_care", "stream_probs": {"science_pcm": 0.58, "science_pcb": 0.32, "undecided": 0.1}},
    "Clinical Psychologist": {"archetype": "medical_care", "stream_probs": {"arts": 0.45, "science_pcb": 0.3, "commerce": 0.08, "undecided": 0.17}},
    "Physiotherapist": {"archetype": "medical_care", "stream_probs": {"science_pcb": 0.7, "science_pcm": 0.12, "undecided": 0.18}},
    "Chartered Accountant": {"archetype": "finance_structured", "stream_probs": {"commerce": 0.84, "science_pcm": 0.06, "arts": 0.04, "undecided": 0.06}},
    "Investment Banker": {"archetype": "finance_structured", "stream_probs": {"commerce": 0.62, "science_pcm": 0.24, "arts": 0.04, "undecided": 0.1}},
    "Management Consultant": {"archetype": "management_enterprising", "stream_probs": {"commerce": 0.45, "science_pcm": 0.35, "arts": 0.08, "undecided": 0.12}},
    "Digital Marketing Manager": {"archetype": "management_enterprising", "stream_probs": {"commerce": 0.4, "arts": 0.28, "science_pcm": 0.1, "undecided": 0.22}},
    "Product Manager": {"archetype": "management_enterprising", "stream_probs": {"science_pcm": 0.55, "commerce": 0.25, "arts": 0.05, "undecided": 0.15}},
    "Entrepreneur": {"archetype": "management_enterprising", "stream_probs": {"commerce": 0.3, "science_pcm": 0.22, "arts": 0.2, "vocational": 0.12, "undecided": 0.16}},
    "Corporate Lawyer": {"archetype": "law_logic", "stream_probs": {"commerce": 0.35, "arts": 0.45, "science_pcm": 0.05, "undecided": 0.15}},
    "Civil Lawyer": {"archetype": "law_logic", "stream_probs": {"arts": 0.52, "commerce": 0.28, "science_pcm": 0.05, "undecided": 0.15}},
    "UX/UI Designer": {"archetype": "creative_design", "stream_probs": {"arts": 0.45, "science_pcm": 0.25, "commerce": 0.1, "undecided": 0.2}},
    "Graphic Designer": {"archetype": "creative_design", "stream_probs": {"arts": 0.62, "commerce": 0.12, "science_pcm": 0.06, "undecided": 0.2}},
    "Architect": {"archetype": "creative_design", "stream_probs": {"science_pcm": 0.52, "arts": 0.25, "commerce": 0.05, "undecided": 0.18}},
    "Fashion Designer": {"archetype": "creative_design", "stream_probs": {"arts": 0.68, "commerce": 0.14, "science_pcm": 0.04, "undecided": 0.14}},
    "Journalist": {"archetype": "communication_social", "stream_probs": {"arts": 0.66, "commerce": 0.16, "science_pcm": 0.04, "undecided": 0.14}},
    "Film Director": {"archetype": "creative_design", "stream_probs": {"arts": 0.72, "commerce": 0.12, "science_pcm": 0.03, "undecided": 0.13}},
    "Content Writer": {"archetype": "communication_social", "stream_probs": {"arts": 0.64, "commerce": 0.17, "science_pcm": 0.05, "undecided": 0.14}},
    "IAS Officer": {"archetype": "governance_leader", "stream_probs": {"arts": 0.28, "science_pcm": 0.28, "commerce": 0.28, "science_pcb": 0.06, "undecided": 0.1}},
    "Defence Officer (Indian Armed Forces)": {"archetype": "practical_hands", "stream_probs": {"science_pcm": 0.52, "arts": 0.18, "commerce": 0.14, "vocational": 0.06, "undecided": 0.1}},
    "Environmental Scientist": {"archetype": "governance_leader", "stream_probs": {"science_pcm": 0.45, "science_pcb": 0.32, "arts": 0.08, "undecided": 0.15}},
    "Sports Manager": {"archetype": "management_enterprising", "stream_probs": {"commerce": 0.38, "arts": 0.28, "science_pcm": 0.12, "vocational": 0.08, "undecided": 0.14}},
    "Chef / Culinary Arts": {"archetype": "practical_hands", "stream_probs": {"vocational": 0.45, "arts": 0.24, "commerce": 0.14, "science_pcm": 0.05, "undecided": 0.12}},
    "Airline Pilot": {"archetype": "practical_hands", "stream_probs": {"science_pcm": 0.7, "commerce": 0.12, "arts": 0.06, "undecided": 0.12}},
}

CAREER_OVERRIDES = {
    "Software Engineer": {
        "aptitude_logical": (70, 100),
        "aptitude_numerical": (65, 100),
        "interest_investigative": (3.5, 5.0),
        "interest_realistic": (3.0, 5.0),
        "personality_openness": (3.0, 5.0),
    },
    "Doctor (MBBS)": {
        "aptitude_verbal": (60, 100),
        "aptitude_numerical": (65, 100),
        "interest_investigative": (3.5, 5.0),
        "interest_social": (3.5, 5.0),
        "personality_agreeableness": (3.5, 5.0),
    },
    "Chartered Accountant": {
        "aptitude_numerical": (75, 100),
        "aptitude_logical": (65, 100),
        "interest_conventional": (3.5, 5.0),
        "interest_enterprising": (3.0, 5.0),
    },
    "UX/UI Designer": {
        "aptitude_spatial": (70, 100),
        "aptitude_verbal": (50, 80),
        "interest_artistic": (4.0, 5.0),
        "interest_social": (3.0, 5.0),
        "personality_openness": (4.0, 5.0),
    },
    "IAS Officer": {
        "aptitude_logical": (70, 100),
        "aptitude_verbal": (70, 100),
        "aptitude_numerical": (70, 100),
        "aptitude_spatial": (70, 100),
        "interest_social": (4.0, 5.0),
        "interest_enterprising": (3.5, 5.0),
        "personality_conscientiousness": (4.0, 5.0),
    },
    "Journalist": {
        "aptitude_verbal": (75, 100),
        "interest_artistic": (3.5, 5.0),
        "interest_social": (3.5, 5.0),
        "personality_openness": (3.5, 5.0),
        "personality_extraversion": (3.5, 5.0),
    },
}

DEFAULT_BOARD_PROBS = {"cbse": 0.45, "icse": 0.2, "state": 0.3, "ib": 0.05}
DEFAULT_EDUCATION_PROBS = {
    "class_9": 0.12,
    "class_10": 0.14,
    "class_11": 0.18,
    "class_12": 0.26,
    "undergraduate": 0.30,
}


def _weighted_choice(probs: dict[str, float]) -> str:
    keys = list(probs.keys())
    weights = np.array(list(probs.values()), dtype=float)
    weights = weights / weights.sum()
    return np.random.choice(keys, p=weights)


def _with_noise(value: float, lower: float, upper: float, noise_ratio: float = 0.12) -> float:
    spread = upper - lower
    noisy = float(np.random.normal(loc=value, scale=max(spread * noise_ratio, 0.02)))
    return float(np.clip(noisy, lower, upper))


def _sample_feature(career: str, feature: str) -> float:
    archetype_name = CAREER_CONFIG[career]["archetype"]
    base_min, base_max = ARCHETYPES[archetype_name]["ranges"][feature]
    if career in CAREER_OVERRIDES and feature in CAREER_OVERRIDES[career]:
        base_min, base_max = CAREER_OVERRIDES[career][feature]

    base = np.random.uniform(base_min, base_max)
    value = _with_noise(base, base_min, base_max)

    if np.random.rand() < 0.12:
        # 10-15% randomness / ambiguity
        if feature.startswith("aptitude"):
            value = _with_noise(np.random.uniform(25, 98), 0, 100, noise_ratio=0.1)
        else:
            value = _with_noise(np.random.uniform(1.0, 5.0), 1.0, 5.0, noise_ratio=0.08)

    if feature.startswith("aptitude"):
        return round(float(np.clip(value, 0, 100)), 2)
    return round(float(np.clip(value, 1.0, 5.0)), 2)


def _sample_education(career: str) -> str:
    education_probs = CAREER_CONFIG[career].get("education_probs", DEFAULT_EDUCATION_PROBS)
    return _weighted_choice(education_probs)


def _sample_age(education_level: str) -> int:
    age_ranges = {
        "class_9": (14, 15),
        "class_10": (15, 16),
        "class_11": (16, 17),
        "class_12": (17, 18),
        "undergraduate": (18, 22),
    }
    low, high = age_ranges[education_level]
    return int(np.random.randint(low, high + 1))


def build_row(student_id: str, career: str) -> dict:
    row = {
        "student_id": student_id,
        "gender": np.random.choice(["M", "F", "O"], p=[0.48, 0.48, 0.04]),
        "education_level": _sample_education(career),
        "stream": _weighted_choice(CAREER_CONFIG[career]["stream_probs"]),
        "board": _weighted_choice(CAREER_CONFIG[career].get("board_probs", DEFAULT_BOARD_PROBS)),
        "career_outcome": career,
    }
    row["age"] = _sample_age(row["education_level"])

    if np.random.rand() < 0.1:
        row["stream"] = np.random.choice(["science_pcm", "science_pcb", "commerce", "arts", "vocational", "undecided"])

    for feature in FEATURE_COLUMNS:
        row[feature] = _sample_feature(career, feature)

    return row


def main() -> None:
    rows = []
    target_per_career = 150

    for idx, career in enumerate(CAREERS):
        for n in range(target_per_career):
            student_id = f"STU{idx + 1:02d}{n + 1:04d}"
            rows.append(build_row(student_id, career))

    df = pd.DataFrame(rows)

    ordered_columns = [
        "student_id",
        "age",
        "gender",
        "education_level",
        "stream",
        "board",
        *FEATURE_COLUMNS,
        "career_outcome",
    ]
    df = df[ordered_columns]

    # Shuffle final dataset
    df = df.sample(frac=1.0, random_state=RANDOM_SEED).reset_index(drop=True)

    output_file = DATA_DIR / "careers_dataset.csv"
    df.to_csv(output_file, index=False)

    print(f"Generated {len(df)} student profiles across {df['career_outcome'].nunique()} careers")
    print(f"Saved dataset to: {output_file}")
    print("\nCareer distribution (top 10):")
    print(df["career_outcome"].value_counts().head(10).to_string())
    print("\nStream distribution:")
    print(df["stream"].value_counts(normalize=True).round(3).to_string())
    print("\nAptitude summary (mean):")
    print(df[["aptitude_logical", "aptitude_verbal", "aptitude_numerical", "aptitude_spatial"]].mean().round(2).to_string())


if __name__ == "__main__":
    main()
