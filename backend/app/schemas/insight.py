from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class InsightResponse(BaseModel):
    id: int
    user_id: int
    insight_type: str
    title: str
    food_name: Optional[str] = None
    symptom_type: Optional[str] = None
    frequency: int
    confidence: str
    supporting_records_count: int
    date_range_start: Optional[datetime] = None
    date_range_end: Optional[datetime] = None
    description: str
    actionable_tip: Optional[str] = None
    medical_disclaimer: str
    user_feedback: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InsightFeedbackUpdate(BaseModel):
    user_feedback: str = Field(..., pattern="^(none|helpful|inaccurate|not_relevant)$")


class FoodAlternative(BaseModel):
    original_food: str
    current_nutrients: str
    suggested_alternative: str
    alternative_nutrients: str
    why_better: str
    budget_friendly_note: str
    portion_tip: str
