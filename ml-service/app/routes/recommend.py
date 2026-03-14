from fastapi import APIRouter, HTTPException, Request

from app.schemas.models import (
    PersonalityRequest,
    RecommendationResponse,
    RIASECRequest,
    SkillGapRequest,
    SkillGapResponse,
    StudentProfile,
)

router = APIRouter(tags=["recommend"])


@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_careers(payload: StudentProfile, request: Request):
    recommender = request.app.state.recommender
    if not recommender.is_loaded:
        raise HTTPException(status_code=503, detail="Models are not loaded")

    profile = payload.model_dump()
    recommendations = recommender.predict_careers(profile)

    riasec_data = recommender.get_riasec_analysis(
        {
            "R": profile["interest_realistic"],
            "I": profile["interest_investigative"],
            "A": profile["interest_artistic"],
            "S": profile["interest_social"],
            "E": profile["interest_enterprising"],
            "C": profile["interest_conventional"],
        }
    )

    personality_data = recommender.get_personality_insights(
        {
            "Openness": profile["personality_openness"],
            "Conscientiousness": profile["personality_conscientiousness"],
            "Extraversion": profile["personality_extraversion"],
            "Agreeableness": profile["personality_agreeableness"],
            "Neuroticism": profile["personality_neuroticism"],
        }
    )

    return RecommendationResponse(
        success=True,
        recommendations=recommendations,
        riasec_code=riasec_data["code"],
        dominant_personality_traits=personality_data["dominant_traits"],
    )


@router.post("/analyze-skills", response_model=SkillGapResponse)
async def analyze_skills(payload: SkillGapRequest, request: Request):
    recommender = request.app.state.recommender
    if not recommender.is_loaded:
        raise HTTPException(status_code=503, detail="Models are not loaded")

    result = recommender.analyze_skill_gaps(payload.student_skills, payload.target_career)
    return SkillGapResponse(**result)


@router.post("/analyze-riasec")
async def analyze_riasec(payload: RIASECRequest, request: Request):
    recommender = request.app.state.recommender
    if not recommender.is_loaded:
        raise HTTPException(status_code=503, detail="Models are not loaded")
    return recommender.get_riasec_analysis(payload.scores)


@router.post("/analyze-personality")
async def analyze_personality(payload: PersonalityRequest, request: Request):
    recommender = request.app.state.recommender
    if not recommender.is_loaded:
        raise HTTPException(status_code=503, detail="Models are not loaded")
    return recommender.get_personality_insights(payload.scores)


@router.get("/career-similarity/{career_name}")
async def career_similarity(career_name: str, request: Request):
    recommender = request.app.state.recommender
    if not recommender.is_loaded:
        raise HTTPException(status_code=503, detail="Models are not loaded")

    try:
        similar = recommender.get_similar_careers(career_name)
        return {"career": career_name, "similar_careers": similar}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
