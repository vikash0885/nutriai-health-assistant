from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class MealPlanGenerateRequest(BaseModel):
    target_date: Optional[str] = None  # YYYY-MM-DD
    target_calories: Optional[float] = None
    target_protein_g: Optional[float] = None
    dietary_preference: Optional[str] = None
    allergies: Optional[List[str]] = None
    budget_inr: Optional[float] = None
    custom_requests: Optional[str] = None


class MealPlanItemResponse(BaseModel):
    id: int
    meal_plan_id: int
    meal_category: str
    food_name: str
    portion_description: str
    estimated_calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    is_completed: bool
    recipe_instructions: Optional[str] = None
    ingredients: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class MealPlanResponse(BaseModel):
    id: int
    user_id: int
    title: str
    target_date: str
    total_calories: float
    total_protein_g: float
    notes: Optional[str] = None
    created_at: datetime
    items: List[MealPlanItemResponse] = []

    model_config = ConfigDict(from_attributes=True)


class GroceryItemCreate(BaseModel):
    item_name: str = Field(..., min_length=1, max_length=200)
    category: str = "Pantry"
    quantity: str = "1 unit"


class GroceryItemUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[str] = None
    is_purchased: Optional[bool] = None


class GroceryItemResponse(BaseModel):
    id: int
    user_id: int
    item_name: str
    category: str
    quantity: str
    is_purchased: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
