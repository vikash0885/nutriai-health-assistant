from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class ExerciseLogCreate(BaseModel):
    activity_name: str = Field(..., min_length=2, max_length=200)
    activity_category: str = Field(..., pattern="^(walking|post_meal_stroll|cardio|strength|yoga|stretching|other)$")
    duration_minutes: int = Field(..., gt=0, le=720)
    intensity: str = Field("moderate", pattern="^(low|moderate|high)$")
    calories_burned: Optional[float] = None
    logged_at: Optional[datetime] = None
    notes: Optional[str] = None


class ExerciseLogResponse(BaseModel):
    id: int
    user_id: int
    activity_name: str
    activity_category: str
    duration_minutes: int
    intensity: str
    calories_burned: float
    logged_at: datetime
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ExercisePlanItem(BaseModel):
    title: str
    category: str
    duration_minutes: int
    intensity: str
    estimated_calories: float
    benefits: str
    safety_notes: str
    recommended_time: str
