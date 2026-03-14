from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.career_recommender import CareerRecommender
from app.routes.health import router as health_router
from app.routes.recommend import router as recommend_router

app = FastAPI(
    title="Career Counselling ML Service",
    description="AI-powered career recommendation engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    recommender = CareerRecommender()
    try:
        recommender.load_models()
    except Exception as error:
        print(f"Warning: failed to load ML models: {error}")
    app.state.recommender = recommender


app.include_router(health_router, prefix="/api")
app.include_router(recommend_router, prefix="/api")


@app.get("/health")
async def health_check():
    recommender = getattr(app.state, "recommender", None)
    return {
        "success": True,
        "message": "ML Service is running",
        "model_loaded": bool(recommender and recommender.is_loaded),
    }
