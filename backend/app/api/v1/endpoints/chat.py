import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.food import FoodEntry
from app.models.water import WaterLog
from app.models.symptom import SymptomLog
from app.models.exercise import ExerciseLog
from app.schemas.chat import ChatRequest, ChatResponse
from app.api.deps import get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat_with_assistant(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Bilingual Hindi-English AI Assistant powered by Google Gemini API.
    Injects today's actual verified food logs, macro totals, water, and symptoms
    into the context to provide grounded, honest wellness guidance.
    """
    today = datetime.now(timezone.utc).date()
    start_dt = datetime(today.year, today.month, today.day, 0, 0, 0, tzinfo=timezone.utc)
    end_dt = datetime(today.year, today.month, today.day, 23, 59, 59, tzinfo=timezone.utc)

    # 1. Fetch user profile
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()

    # 2. Fetch today's food entries
    food_res = await db.execute(
        select(FoodEntry).where(
            FoodEntry.user_id == current_user.id,
            FoodEntry.logged_at >= start_dt,
            FoodEntry.logged_at <= end_dt,
        )
    )
    today_foods = food_res.scalars().all()

    # 3. Fetch today's water
    water_res = await db.execute(
        select(WaterLog).where(
            WaterLog.user_id == current_user.id,
            WaterLog.logged_at >= start_dt,
            WaterLog.logged_at <= end_dt,
        )
    )
    today_water = sum(w.amount_ml for w in water_res.scalars().all())

    # 4. Fetch recent symptoms (last 3 days)
    symp_res = await db.execute(
        select(SymptomLog)
        .where(SymptomLog.user_id == current_user.id)
        .order_by(SymptomLog.logged_at.desc())
        .limit(5)
    )
    recent_symptoms = symp_res.scalars().all()

    # 5. Fetch today's exercises
    ex_res = await db.execute(
        select(ExerciseLog).where(
            ExerciseLog.user_id == current_user.id,
            ExerciseLog.logged_at >= start_dt,
            ExerciseLog.logged_at <= end_dt,
        )
    )
    today_exercises = ex_res.scalars().all()

    # Calculate today's totals
    tot_cal = sum(f.calories for f in today_foods)
    tot_prot = sum(f.protein_g for f in today_foods)
    tot_carb = sum(f.carbs_g for f in today_foods)
    tot_fat = sum(f.fat_g for f in today_foods)
    tot_fib = sum(f.fiber_g for f in today_foods)

    user_context = {
        "user_profile": {
            "display_name": profile.display_name if profile else "Friend",
            "dietary_preference": profile.dietary_preference if profile else "vegetarian",
            "fitness_goal": profile.fitness_goal if profile else "general_wellness",
            "daily_calorie_target": profile.daily_calorie_target if profile else 2000.0,
            "daily_protein_target": profile.daily_protein_target if profile else 65.0,
            "allergies": json.loads(profile.allergies or "[]") if profile else [],
        },
        "today_nutrition_summary": {
            "date": today.strftime("%Y-%m-%d"),
            "total_calories": round(tot_cal, 1),
            "total_protein_g": round(tot_prot, 1),
            "total_carbs_g": round(tot_carb, 1),
            "total_fat_g": round(tot_fat, 1),
            "total_fiber_g": round(tot_fib, 1),
            "total_water_ml": today_water,
            "exercise_minutes": sum(e.duration_minutes for e in today_exercises),
            "logged_foods_today": [
                {
                    "food_name": f.food_name,
                    "meal": f.meal_category,
                    "portion": f"{f.quantity} {f.unit} ({f.serving_weight_g}g)",
                    "calories": f.calories,
                    "protein_g": f.protein_g,
                }
                for f in today_foods
            ],
            "recent_symptoms": [
                {
                    "symptom": s.symptom_type,
                    "severity": s.severity,
                    "date": s.logged_at.strftime("%Y-%m-%d %H:%M"),
                }
                for s in recent_symptoms
            ],
        },
    }

    # Format history
    history_dicts = [{"role": m.role, "content": m.content} for m in (req.history or [])]

    # Generate response
    ai_response = await gemini_service.chat_assistant(
        user_message=req.message,
        user_context=user_context,
        history=history_dicts,
    )

    # Detect language style approximately
    lower_msg = req.message.lower()
    is_hindi = any(word in lower_msg for word in ["aaj", "kya", "kaise", "batao", "mere", "kitna", "pani", "paani", "khana", "khaya"]) or any('\u0900' <= char <= '\u097F' for char in req.message)

    return ChatResponse(
        response=ai_response,
        detected_language="hi/hinglish" if is_hindi else "en",
        referenced_data={
            "today_calories": round(tot_cal, 1),
            "today_protein_g": round(tot_prot, 1),
            "today_water_ml": today_water,
            "foods_count": len(today_foods),
        },
    )
