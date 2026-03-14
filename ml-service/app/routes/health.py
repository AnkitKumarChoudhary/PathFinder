from fastapi import APIRouter, Request

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(request: Request):
    recommender = request.app.state.recommender

    return {
        "success": True,
        "message": "ML Service is running",
        "model_loaded": recommender.is_loaded,
        "models": {
            "random_forest": recommender.rf_model is not None,
            "knn": recommender.knn_model is not None,
            "career_vectors": recommender.career_vectors is not None,
        },
        "dataset_size": recommender.dataset_size,
        "careers_supported": recommender.careers_supported,
    }
