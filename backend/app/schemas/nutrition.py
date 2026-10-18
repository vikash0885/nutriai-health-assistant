from pydantic import BaseModel
from typing import Dict, List, Optional


class MacroProgress(BaseModel):
    current: float
    target: float
    percentage: float
    unit: str = "g"


class MealNutrition(BaseModel):
    category: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    food_count: int


class DailyNutritionSummary(BaseModel):
    date: str  # YYYY-MM-DD
    total_calories: float
    calorie_target: float
    calorie_percentage: float
    protein: MacroProgress
    carbs: MacroProgress
    fat: MacroProgress
    fiber: MacroProgress
    total_sugar_g: float
    total_sodium_mg: float
    meal_breakdown: Dict[str, MealNutrition]
    total_water_ml: int
    water_target_ml: int
    total_exercise_minutes: int
    calories_burned: float
    insights_count: int
    entry_count: int


class DayTrendItem(BaseModel):
    date: str
    day_name: str
    calories: float
    calorie_target: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    water_ml: int


class WeeklyNutritionSummary(BaseModel):
    start_date: str
    end_date: str
    avg_calories: float
    avg_protein_g: float
    avg_carbs_g: float
    avg_fat_g: float
    avg_fiber_g: float
    avg_water_ml: float
    days: List[DayTrendItem]
    nutrition_gaps: List[str]
    potential_excesses: List[str]
