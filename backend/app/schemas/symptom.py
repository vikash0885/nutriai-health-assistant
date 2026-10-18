from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class SymptomLogCreate(BaseModel):
    symptom_type: str = Field(..., min_length=2, max_length=100)
    severity: str = Field(..., pattern="^(mild|moderate|severe)$")
    logged_at: Optional[datetime] = None
    onset_minutes_after_meal: Optional[int] = None
    suspected_food: Optional[str] = None
    notes: Optional[str] = None


class SymptomLogUpdate(BaseModel):
    symptom_type: Optional[str] = None
    severity: Optional[str] = None
    logged_at: Optional[datetime] = None
    onset_minutes_after_meal: Optional[int] = None
    suspected_food: Optional[str] = None
    notes: Optional[str] = None


class SymptomLogResponse(BaseModel):
    id: int
    user_id: int
    symptom_type: str
    severity: str
    logged_at: datetime
    onset_minutes_after_meal: Optional[int] = None
    suspected_food: Optional[str] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
