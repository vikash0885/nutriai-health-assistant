from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class ConsentBase(BaseModel):
    health_data_consent: bool = True
    ai_processing_consent: bool = True


class ConsentResponse(ConsentBase):
    id: int
    user_id: int
    consent_date: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileBase(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=10, le=120)
    gender: Optional[str] = "prefer_not_to_say"
    height_cm: Optional[float] = Field(None, ge=50, le=260)
    weight_kg: Optional[float] = Field(None, ge=20, le=350)
    activity_level: str = "moderate"
    dietary_preference: str = "vegetarian"
    fitness_goal: str = "general_wellness"
    allergies: List[str] = []
    restrictions: List[str] = []
    preferred_foods: List[str] = []
    disliked_foods: List[str] = []
    daily_budget_inr: Optional[float] = 250.0
    preferred_language: str = "en"
    health_considerations: Optional[str] = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = None
    dietary_preference: Optional[str] = None
    fitness_goal: Optional[str] = None
    allergies: Optional[List[str]] = None
    restrictions: Optional[List[str]] = None
    preferred_foods: Optional[List[str]] = None
    disliked_foods: Optional[List[str]] = None
    daily_budget_inr: Optional[float] = None
    preferred_language: Optional[str] = None
    health_considerations: Optional[str] = None
    daily_calorie_target: Optional[float] = None
    daily_protein_target: Optional[float] = None
    daily_carb_target: Optional[float] = None
    daily_fat_target: Optional[float] = None
    daily_fiber_target: Optional[float] = None
    daily_water_target_ml: Optional[int] = None
    onboarding_completed: Optional[bool] = None


class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    daily_calorie_target: float
    daily_protein_target: float
    daily_carb_target: float
    daily_fat_target: float
    daily_fiber_target: float
    daily_water_target_ml: int
    onboarding_completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
