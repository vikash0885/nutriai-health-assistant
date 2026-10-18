from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class WaterLogCreate(BaseModel):
    amount_ml: int = Field(..., gt=0, le=5000)
    logged_at: Optional[datetime] = None


class WaterLogResponse(BaseModel):
    id: int
    user_id: int
    amount_ml: int
    logged_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WaterDailySummary(BaseModel):
    date: str
    total_ml: int
    target_ml: int
    percentage: float
    glasses: float
