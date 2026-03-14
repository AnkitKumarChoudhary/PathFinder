from typing import Dict, List

from pydantic import BaseModel, Field


class StudentProfile(BaseModel):
    aptitude_logical: float = Field(..., ge=0, le=100)
    aptitude_verbal: float = Field(..., ge=0, le=100)
    aptitude_numerical: float = Field(..., ge=0, le=100)
    aptitude_spatial: float = Field(..., ge=0, le=100)
    personality_openness: float = Field(..., ge=1.0, le=5.0)
    personality_conscientiousness: float = Field(..., ge=1.0, le=5.0)
    personality_extraversion: float = Field(..., ge=1.0, le=5.0)
    personality_agreeableness: float = Field(..., ge=1.0, le=5.0)
    personality_neuroticism: float = Field(..., ge=1.0, le=5.0)
    interest_realistic: float = Field(..., ge=1.0, le=5.0)
    interest_investigative: float = Field(..., ge=1.0, le=5.0)
    interest_artistic: float = Field(..., ge=1.0, le=5.0)
    interest_social: float = Field(..., ge=1.0, le=5.0)
    interest_enterprising: float = Field(..., ge=1.0, le=5.0)
    interest_conventional: float = Field(..., ge=1.0, le=5.0)


class CareerRecommendation(BaseModel):
    career: str
    match_percentage: float
    confidence: str
    reasons: List[str]
    method: str


class RecommendationResponse(BaseModel):
    success: bool
    recommendations: List[CareerRecommendation]
    riasec_code: str
    dominant_personality_traits: List[str]


class SkillGapRequest(BaseModel):
    student_skills: List[str]
    target_career: str


class SkillGapResponse(BaseModel):
    career: str
    match_percentage: float
    matching_skills: List[str]
    missing_skills: List[str]
    recommended_resources: List[Dict]


class RIASECRequest(BaseModel):
    scores: Dict[str, float]


class PersonalityRequest(BaseModel):
    scores: Dict[str, float]
