from datetime import datetime, timedelta, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.food import FoodEntry
from app.models.water import WaterLog
from app.models.exercise import ExerciseLog
from app.models.insight import FoodPatternInsight
from app.schemas.nutrition import DailyNutritionSummary, WeeklyNutritionSummary, MacroProgress, MealNutrition, DayTrendItem
from app.schemas.insight import FoodAlternative
from app.api.deps import get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter()


@router.get("/daily-summary", response_model=DailyNutritionSummary)
async def get_daily_summary(
    target_date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format, defaults to today"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve comprehensive daily nutrition metrics, macro targets, water, and exercise."""
    if target_date:
        try:
            d = datetime.strptime(target_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    else:
        d = datetime.now(timezone.utc).date()

    date_str = d.strftime("%Y-%m-%d")
    start_dt = datetime(d.year, d.month, d.day, 0, 0, 0, tzinfo=timezone.utc)
    end_dt = datetime(d.year, d.month, d.day, 23, 59, 59, tzinfo=timezone.utc)

    # 1. Fetch User Profile for targets
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()

    cal_target = profile.daily_calorie_target if profile else 2000.0
    prot_target = profile.daily_protein_target if profile else 65.0
    carb_target = profile.daily_carb_target if profile else 250.0
    fat_target = profile.daily_fat_target if profile else 60.0
    fib_target = profile.daily_fiber_target if profile else 30.0
    water_target = profile.daily_water_target_ml if profile else 2500

    # 2. Fetch Food Entries for date
    food_res = await db.execute(
        select(FoodEntry).where(
            FoodEntry.user_id == current_user.id,
            FoodEntry.logged_at >= start_dt,
            FoodEntry.logged_at <= end_dt,
        )
    )
    entries = food_res.scalars().all()

    # 3. Fetch Water Logs for date
    water_res = await db.execute(
        select(WaterLog).where(
            WaterLog.user_id == current_user.id,
            WaterLog.logged_at >= start_dt,
            WaterLog.logged_at <= end_dt,
        )
    )
    water_logs = water_res.scalars().all()
    total_water = sum(w.amount_ml for w in water_logs)

    # 4. Fetch Exercise Logs for date
    ex_res = await db.execute(
        select(ExerciseLog).where(
            ExerciseLog.user_id == current_user.id,
            ExerciseLog.logged_at >= start_dt,
            ExerciseLog.logged_at <= end_dt,
        )
    )
    exercise_logs = ex_res.scalars().all()
    total_exercise_min = sum(e.duration_minutes for e in exercise_logs)
    total_cal_burned = sum(e.calories_burned for e in exercise_logs)

    # 5. Fetch Insights Count
    ins_res = await db.execute(
        select(FoodPatternInsight).where(FoodPatternInsight.user_id == current_user.id)
    )
    insights_count = len(ins_res.scalars().all())

    # Aggregate Nutrients
    tot_cal = sum(e.calories for e in entries)
    tot_prot = sum(e.protein_g for e in entries)
    tot_carb = sum(e.carbs_g for e in entries)
    tot_fat = sum(e.fat_g for e in entries)
    tot_fib = sum(e.fiber_g for e in entries)
    tot_sugar = sum(e.sugar_g for e in entries)
    tot_sodium = sum(e.sodium_mg for e in entries)

    meal_breakdown = {
        "breakfast": MealNutrition(category="breakfast", calories=0, protein_g=0, carbs_g=0, fat_g=0, fiber_g=0, food_count=0),
        "lunch": MealNutrition(category="lunch", calories=0, protein_g=0, carbs_g=0, fat_g=0, fiber_g=0, food_count=0),
        "dinner": MealNutrition(category="dinner", calories=0, protein_g=0, carbs_g=0, fat_g=0, fiber_g=0, food_count=0),
        "snack": MealNutrition(category="snack", calories=0, protein_g=0, carbs_g=0, fat_g=0, fiber_g=0, food_count=0),
    }

    for e in entries:
        cat = e.meal_category.lower()
        if cat in meal_breakdown:
            meal_breakdown[cat].calories += round(e.calories, 1)
            meal_breakdown[cat].protein_g += round(e.protein_g, 1)
            meal_breakdown[cat].carbs_g += round(e.carbs_g, 1)
            meal_breakdown[cat].fat_g += round(e.fat_g, 1)
            meal_breakdown[cat].fiber_g += round(e.fiber_g, 1)
            meal_breakdown[cat].food_count += 1

    return DailyNutritionSummary(
        date=date_str,
        total_calories=round(tot_cal, 1),
        calorie_target=cal_target,
        calorie_percentage=round((tot_cal / max(1.0, cal_target)) * 100, 1),
        protein=MacroProgress(
            current=round(tot_prot, 1),
            target=prot_target,
            percentage=round((tot_prot / max(1.0, prot_target)) * 100, 1),
            unit="g",
        ),
        carbs=MacroProgress(
            current=round(tot_carb, 1),
            target=carb_target,
            percentage=round((tot_carb / max(1.0, carb_target)) * 100, 1),
            unit="g",
        ),
        fat=MacroProgress(
            current=round(tot_fat, 1),
            target=fat_target,
            percentage=round((tot_fat / max(1.0, fat_target)) * 100, 1),
            unit="g",
        ),
        fiber=MacroProgress(
            current=round(tot_fib, 1),
            target=fib_target,
            percentage=round((tot_fib / max(1.0, fib_target)) * 100, 1),
            unit="g",
        ),
        total_sugar_g=round(tot_sugar, 1),
        total_sodium_mg=round(tot_sodium, 1),
        meal_breakdown=meal_breakdown,
        total_water_ml=total_water,
        water_target_ml=water_target,
        total_exercise_minutes=total_exercise_min,
        calories_burned=round(total_cal_burned, 1),
        insights_count=insights_count,
        entry_count=len(entries),
    )


@router.get("/weekly-summary", response_model=WeeklyNutritionSummary)
async def get_weekly_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve 7-day rolling nutritional trends, daily calories, macronutrients, and water."""
    today = datetime.now(timezone.utc).date()
    days_data = []

    # Fetch User Profile for targets
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()
    cal_target = profile.daily_calorie_target if profile else 2000.0

    total_cals = 0.0
    total_prots = 0.0
    total_carbs = 0.0
    total_fats = 0.0
    total_fibers = 0.0
    total_waters = 0

    for i in range(6, -1, -1):
        target_day = today - timedelta(days=i)
        start_dt = datetime(target_day.year, target_day.month, target_day.day, 0, 0, 0, tzinfo=timezone.utc)
        end_dt = datetime(target_day.year, target_day.month, target_day.day, 23, 59, 59, tzinfo=timezone.utc)

        food_res = await db.execute(
            select(FoodEntry).where(
                FoodEntry.user_id == current_user.id,
                FoodEntry.logged_at >= start_dt,
                FoodEntry.logged_at <= end_dt,
            )
        )
        f_entries = food_res.scalars().all()

        water_res = await db.execute(
            select(WaterLog).where(
                WaterLog.user_id == current_user.id,
                WaterLog.logged_at >= start_dt,
                WaterLog.logged_at <= end_dt,
            )
        )
        w_entries = water_res.scalars().all()

        c = sum(e.calories for e in f_entries)
        p = sum(e.protein_g for e in f_entries)
        cb = sum(e.carbs_g for e in f_entries)
        ft = sum(e.fat_g for e in f_entries)
        fb = sum(e.fiber_g for e in f_entries)
        wt = sum(w.amount_ml for w in w_entries)

        total_cals += c
        total_prots += p
        total_carbs += cb
        total_fats += ft
        total_fibers += fb
        total_waters += wt

        days_data.append(
            DayTrendItem(
                date=target_day.strftime("%Y-%m-%d"),
                day_name=target_day.strftime("%a"),
                calories=round(c, 1),
                calorie_target=cal_target,
                protein_g=round(p, 1),
                carbs_g=round(cb, 1),
                fat_g=round(ft, 1),
                fiber_g=round(fb, 1),
                water_ml=wt,
            )
        )

    avg_c = round(total_cals / 7.0, 1)
    avg_p = round(total_prots / 7.0, 1)
    avg_cb = round(total_carbs / 7.0, 1)
    avg_ft = round(total_fats / 7.0, 1)
    avg_fb = round(total_fibers / 7.0, 1)
    avg_wt = round(total_waters / 7.0, 1)

    # Calculate gaps and potential excesses
    gaps = []
    excesses = []
    if avg_p < (profile.daily_protein_target if profile else 65.0) * 0.8:
        gaps.append("Average protein intake is below your daily target. Consider adding paneer, dal, or sprouts.")
    if avg_fb < 20.0:
        gaps.append("Average dietary fiber is below 20g. Consider increasing whole vegetables, oats, and fruits.")
    if avg_wt < 1800:
        gaps.append("Weekly hydration average is under 1.8 Liters. Sip water consistently throughout your day.")

    if avg_c > cal_target * 1.25 and cal_target > 0:
        excesses.append("Average caloric intake exceeds your target by more than 25%. Check portion sizes.")

    return WeeklyNutritionSummary(
        start_date=(today - timedelta(days=6)).strftime("%Y-%m-%d"),
        end_date=today.strftime("%Y-%m-%d"),
        avg_calories=avg_c,
        avg_protein_g=avg_p,
        avg_carbs_g=avg_cb,
        avg_fat_g=avg_ft,
        avg_fiber_g=avg_fb,
        avg_water_ml=avg_wt,
        days=days_data,
        nutrition_gaps=gaps,
        potential_excesses=excesses,
    )


@router.get("/food-alternatives", response_model=List[FoodAlternative])
async def get_alternatives(
    food_name: str = Query(..., description="Food name to find healthy alternatives for"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """'Eat This, Try This' Engine: Generates smart, affordable food alternatives with Gemini."""
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()
    dietary_pref = profile.dietary_preference if profile else "vegetarian"

    # Fetch last logged instance of this food or use database defaults
    food_calc = nutrition_service.calculate_portion_nutrients(
        food_name=food_name,
        quantity=1.0,
        unit="serving",
    )

    alternatives = await gemini_service.get_food_alternatives(
        logged_food=food_name,
        calories=food_calc["calories"],
        protein_g=food_calc["protein_g"],
        carbs_g=food_calc["carbs_g"],
        fat_g=food_calc["fat_g"],
        fiber_g=food_calc["fiber_g"],
        dietary_preference=dietary_pref,
    )
    return alternatives
