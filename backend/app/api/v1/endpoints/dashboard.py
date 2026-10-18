from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.food import FoodEntry
from app.models.water import WaterLog
from app.models.exercise import ExerciseLog
from app.models.symptom import SymptomLog
from app.models.insight import FoodPatternInsight
from app.api.deps import get_current_user
from app.services.habit_service import habit_service

router = APIRouter()


@router.get("/")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Consolidated Dashboard summary endpoint:
    Aggregates today's metrics, recent diary logs, habit insights, and pattern highlights.
    """
    today = datetime.now(timezone.utc).date()
    start_dt = datetime(today.year, today.month, today.day, 0, 0, 0, tzinfo=timezone.utc)
    end_dt = datetime(today.year, today.month, today.day, 23, 59, 59, tzinfo=timezone.utc)

    # 1. Profile
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()

    cal_target = profile.daily_calorie_target if profile else 2000.0
    prot_target = profile.daily_protein_target if profile else 65.0
    carb_target = profile.daily_carb_target if profile else 250.0
    fat_target = profile.daily_fat_target if profile else 60.0
    fib_target = profile.daily_fiber_target if profile else 30.0
    water_target = profile.daily_water_target_ml if profile else 2500

    # 2. Today's Food Entries
    food_res = await db.execute(
        select(FoodEntry)
        .where(FoodEntry.user_id == current_user.id, FoodEntry.logged_at >= start_dt, FoodEntry.logged_at <= end_dt)
        .order_by(FoodEntry.logged_at.desc())
    )
    today_foods = food_res.scalars().all()

    tot_cal = sum(f.calories for f in today_foods)
    tot_prot = sum(f.protein_g for f in today_foods)
    tot_carb = sum(f.carbs_g for f in today_foods)
    tot_fat = sum(f.fat_g for f in today_foods)
    tot_fib = sum(f.fiber_g for f in today_foods)

    # 3. Today's Water
    w_res = await db.execute(
        select(WaterLog)
        .where(WaterLog.user_id == current_user.id, WaterLog.logged_at >= start_dt, WaterLog.logged_at <= end_dt)
    )
    today_water = sum(w.amount_ml for w in w_res.scalars().all())

    # 4. Today's Exercise
    ex_res = await db.execute(
        select(ExerciseLog)
        .where(ExerciseLog.user_id == current_user.id, ExerciseLog.logged_at >= start_dt, ExerciseLog.logged_at <= end_dt)
    )
    today_ex = ex_res.scalars().all()
    total_ex_min = sum(e.duration_minutes for e in today_ex)
    total_cal_burned = sum(e.calories_burned for e in today_ex)

    # 5. Recent Symptoms
    s_res = await db.execute(
        select(SymptomLog)
        .where(SymptomLog.user_id == current_user.id)
        .order_by(SymptomLog.logged_at.desc())
        .limit(5)
    )
    recent_symptoms = [
        {
            "id": s.id,
            "symptom_type": s.symptom_type,
            "severity": s.severity,
            "logged_at": s.logged_at.isoformat(),
            "notes": s.notes,
        }
        for s in s_res.scalars().all()
    ]

    # 6. Pattern Insights
    ins_res = await db.execute(
        select(FoodPatternInsight)
        .where(FoodPatternInsight.user_id == current_user.id)
        .order_by(FoodPatternInsight.created_at.desc())
        .limit(3)
    )
    pattern_insights = [
        {
            "id": i.id,
            "title": i.title,
            "food_name": i.food_name,
            "symptom_type": i.symptom_type,
            "frequency": i.frequency,
            "confidence": i.confidence,
            "description": i.description,
            "actionable_tip": i.actionable_tip,
            "user_feedback": i.user_feedback,
        }
        for i in ins_res.scalars().all()
    ]

    # 7. Habit Insights
    # Fetch historical daily summaries for habits (last 7 days)
    history_days = []
    for i in range(6, -1, -1):
        day_date = today - timedelta(days=i)
        d_start = datetime(day_date.year, day_date.month, day_date.day, 0, 0, 0, tzinfo=timezone.utc)
        d_end = datetime(day_date.year, day_date.month, day_date.day, 23, 59, 59, tzinfo=timezone.utc)
        d_foods = await db.execute(
            select(FoodEntry).where(FoodEntry.user_id == current_user.id, FoodEntry.logged_at >= d_start, FoodEntry.logged_at <= d_end)
        )
        f_list = d_foods.scalars().all()
        if f_list:
            history_days.append({
                "date": day_date.strftime("%Y-%m-%d"),
                "total_calories": sum(f.calories for f in f_list),
                "total_fiber_g": sum(f.fiber_g for f in f_list),
            })

    all_water = await db.execute(select(WaterLog).where(WaterLog.user_id == current_user.id))
    all_exercise = await db.execute(select(ExerciseLog).where(ExerciseLog.user_id == current_user.id))
    all_foods = await db.execute(select(FoodEntry).where(FoodEntry.user_id == current_user.id))

    habit_insights = habit_service.analyze_habits(
        daily_summaries=history_days,
        total_foods_logged=len(all_foods.scalars().all()),
        water_logs=[{"amount_ml": w.amount_ml} for w in all_water.scalars().all()],
        exercise_logs=[{"activity_category": e.activity_category, "activity_name": e.activity_name} for e in all_exercise.scalars().all()],
    )

    return {
        "user": {
            "display_name": profile.display_name if profile else "Friend",
            "dietary_preference": profile.dietary_preference if profile else "vegetarian",
            "fitness_goal": profile.fitness_goal if profile else "general_wellness",
            "onboarding_completed": profile.onboarding_completed if profile else False,
        },
        "today_nutrition": {
            "date": today.strftime("%Y-%m-%d"),
            "total_calories": round(tot_cal, 1),
            "calorie_target": cal_target,
            "calorie_percentage": round((tot_cal / max(1.0, cal_target)) * 100, 1),
            "protein": {
                "current": round(tot_prot, 1),
                "target": prot_target,
                "percentage": round((tot_prot / max(1.0, prot_target)) * 100, 1),
            },
            "carbs": {
                "current": round(tot_carb, 1),
                "target": carb_target,
                "percentage": round((tot_carb / max(1.0, carb_target)) * 100, 1),
            },
            "fat": {
                "current": round(tot_fat, 1),
                "target": fat_target,
                "percentage": round((tot_fat / max(1.0, fat_target)) * 100, 1),
            },
            "fiber": {
                "current": round(tot_fib, 1),
                "target": fib_target,
                "percentage": round((tot_fib / max(1.0, fib_target)) * 100, 1),
            },
            "entry_count": len(today_foods),
        },
        "hydration": {
            "total_ml": today_water,
            "target_ml": water_target,
            "percentage": round((today_water / max(1, water_target)) * 100, 1),
            "glasses": round(today_water / 250.0, 1),
        },
        "activity": {
            "total_minutes": total_ex_min,
            "calories_burned": round(total_cal_burned, 1),
            "sessions_count": len(today_ex),
        },
        "recent_meals": [
            {
                "id": f.id,
                "food_name": f.food_name,
                "meal_category": f.meal_category,
                "portion": f"{f.quantity} {f.unit}",
                "calories": f.calories,
                "protein_g": f.protein_g,
                "carbs_g": f.carbs_g,
                "fat_g": f.fat_g,
                "logged_at": f.logged_at.isoformat(),
            }
            for f in today_foods[:5]
        ],
        "recent_symptoms": recent_symptoms,
        "pattern_insights": pattern_insights,
        "habit_insights": habit_insights,
    }
