from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.exercise import ExerciseLog
from app.schemas.exercise import ExerciseLogCreate, ExerciseLogResponse, ExercisePlanItem
from app.api.deps import get_current_user
from app.services.exercise_service import exercise_service

router = APIRouter()


@router.get("/", response_model=List[ExerciseLogResponse])
async def list_exercises(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExerciseLog)
        .where(ExerciseLog.user_id == current_user.id)
        .order_by(ExerciseLog.logged_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=ExerciseLogResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise_in: ExerciseLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Fetch weight for accurate MET calorie calculation
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()
    weight = profile.weight_kg if profile and profile.weight_kg else 65.0

    calories_burned = exercise_in.calories_burned
    if calories_burned is None or calories_burned <= 0:
        calories_burned = exercise_service.estimate_calories_burned(
            category=exercise_in.activity_category,
            duration_minutes=exercise_in.duration_minutes,
            weight_kg=weight,
            intensity=exercise_in.intensity,
        )

    log = ExerciseLog(
        user_id=current_user.id,
        activity_name=exercise_in.activity_name,
        activity_category=exercise_in.activity_category,
        duration_minutes=exercise_in.duration_minutes,
        intensity=exercise_in.intensity,
        calories_burned=calories_burned,
        logged_at=exercise_in.logged_at or datetime.now(timezone.utc),
        notes=exercise_in.notes,
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


@router.delete("/{log_id}", status_code=status.HTTP_200_OK)
async def delete_exercise(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExerciseLog).where(ExerciseLog.id == log_id, ExerciseLog.user_id == current_user.id)
    )
    log = result.scalars().first()
    if not log:
        raise HTTPException(status_code=404, detail="Exercise log not found")

    await db.delete(log)
    await db.commit()
    return {"message": "Exercise log deleted successfully"}


@router.get("/recommendations", response_model=List[ExercisePlanItem])
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()
    goal = profile.fitness_goal if profile else "general_wellness"
    activity = profile.activity_level if profile else "moderate"

    routines = exercise_service.get_recommended_routines(fitness_goal=goal, activity_level=activity)
    return routines
