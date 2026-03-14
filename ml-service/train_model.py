from pathlib import Path
import pickle

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "app" / "data"
DATASET_PATH = DATA_DIR / "careers_dataset.csv"

FEATURES = [
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
TARGET = "career_outcome"


def main() -> None:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}. Run generate_data.py first.")

    df = pd.read_csv(DATASET_PATH)

    # Preprocess: enforce numeric dtypes and drop invalid records if any
    for col in FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=FEATURES + [TARGET]).copy()

    x = df[FEATURES]
    y = df[TARGET]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    # 1) Random Forest
    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        random_state=42,
        n_jobs=-1,
    )
    rf_model.fit(x_train, y_train)
    rf_preds = rf_model.predict(x_test)
    rf_acc = accuracy_score(y_test, rf_preds)

    print("=" * 72)
    print("Random Forest Evaluation")
    print("=" * 72)
    print(f"Random Forest Accuracy: {rf_acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, rf_preds, zero_division=0))

    importances = pd.Series(rf_model.feature_importances_, index=FEATURES).sort_values(ascending=False)
    print("Top 10 Feature Importances:")
    print(importances.head(10).round(4).to_string())

    # 2) KNN + Scaler
    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)

    knn_model = KNeighborsClassifier(n_neighbors=10, metric="euclidean")
    knn_model.fit(x_train_scaled, y_train)
    knn_preds = knn_model.predict(x_test_scaled)
    knn_acc = accuracy_score(y_test, knn_preds)

    print("\n" + "=" * 72)
    print("KNN Evaluation")
    print("=" * 72)
    print(f"KNN Accuracy: {knn_acc * 100:.2f}%")

    # 3) Career profile vectors (mean vectors in scaled feature space)
    x_scaled_full = scaler.transform(x)
    scaled_df = pd.DataFrame(x_scaled_full, columns=FEATURES)
    scaled_df[TARGET] = y.values

    career_vectors = {
        "feature_names": FEATURES,
        "vectors": {
            career: group[FEATURES].mean().tolist()
            for career, group in scaled_df.groupby(TARGET)
        },
    }

    # Persist artifacts
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with open(DATA_DIR / "rf_model.pkl", "wb") as file:
        pickle.dump(rf_model, file)

    with open(DATA_DIR / "knn_model.pkl", "wb") as file:
        pickle.dump(knn_model, file)

    with open(DATA_DIR / "scaler.pkl", "wb") as file:
        pickle.dump(scaler, file)

    with open(DATA_DIR / "career_vectors.pkl", "wb") as file:
        pickle.dump(career_vectors, file)

    print("\n" + "=" * 72)
    print(f"Random Forest Accuracy: {rf_acc * 100:.1f}%")
    print(f"KNN Accuracy: {knn_acc * 100:.1f}%")
    print(f"Career vectors computed for {len(career_vectors['vectors'])} careers")
    print("Models saved successfully ✅")


if __name__ == "__main__":
    main()
