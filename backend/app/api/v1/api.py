from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    profile,
    foods,
    nutrition,
    symptoms,
    exercise,
    water,
    meal_plans,
    chat,
    dashboard,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(profile.router, prefix="/profile", tags=["User Profile & Consent"])
api_router.include_router(foods.router, prefix="/foods", tags=["Food Logging & Vision"])
api_router.include_router(nutrition.router, prefix="/nutrition", tags=["Nutrition Analysis"])
api_router.include_router(symptoms.router, prefix="/symptoms", tags=["Symptom Diary & Pattern Insights"])
api_router.include_router(exercise.router, prefix="/exercise", tags=["Exercise & Digestion"])
api_router.include_router(water.router, prefix="/water", tags=["Water Tracker"])
api_router.include_router(meal_plans.router, prefix="/meal-plans", tags=["Meal Planner & Grocery List"])
api_router.include_router(chat.router, prefix="/chat", tags=["Bilingual AI Assistant"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Main Dashboard"])
