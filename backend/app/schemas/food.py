from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class FoodItemNutrients(BaseModel):
    name: str
    hindi_name: Optional[str] = None
    category: str
    calories_per_100g: float
    protein_per_100g: float
    carbs_per_100g: float
    fat_per_100g: float
    fiber_per_100g: float = 0.0
    sugar_per_100g: float = 0.0
    sodium_per_100g_mg: float = 0.0
    standard_units: List[dict] = []


class FoodEntryCreate(BaseModel):
    food_name: str = Field(..., min_length=1, max_length=200)
    meal_category: str = Field(..., pattern="^(breakfast|lunch|dinner|snack)$")
    quantity: float = Field(..., gt=0)
    unit: str = "serving"
    serving_weight_g: float = Field(..., gt=0)
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = 0.0
    sugar_g: Optional[float] = 0.0
    sodium_mg: Optional[float] = 0.0
    source: str = "curated_database"
    confirmed_by_user: bool = True
    image_url: Optional[str] = None
    notes: Optional[str] = None
    logged_at: Optional[datetime] = None


class FoodEntryUpdate(BaseModel):
    food_name: Optional[str] = None
    meal_category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    serving_weight_g: Optional[float] = None
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    notes: Optional[str] = None
    logged_at: Optional[datetime] = None


class FoodEntryResponse(BaseModel):
    id: int
    user_id: int
    food_name: str
    meal_category: str
    quantity: float
    unit: str
    serving_weight_g: float
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    sodium_mg: float
    source: str
    confirmed_by_user: bool
    image_url: Optional[str] = None
    notes: Optional[str] = None
    logged_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PortionCalculateRequest(BaseModel):
    food_name: str
    quantity: float
    unit: str


class PortionCalculateResponse(BaseModel):
    food_name: str
    quantity: float
    unit: str
    serving_weight_g: float
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    sodium_mg: float
    data_source: str
