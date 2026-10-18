import json
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.symptom import SymptomLog
from app.models.food import FoodEntry
from app.models.insight import FoodPatternInsight
from app.schemas.symptom import SymptomLogCreate, SymptomLogUpdate, SymptomLogResponse
from app.schemas.insight import InsightResponse, InsightFeedbackUpdate
from app.api.deps import get_current_user
from app.services.symptom_analysis_service import symptom_analysis_service

router = APIRouter()


@router.get("/", response_model=List[SymptomLogResponse])
async def list_symptoms(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all recorded symptoms for the authenticated user."""
    result = await db.execute(
        select(SymptomLog)
        .where(SymptomLog.user_id == current_user.id)
        .order_by(SymptomLog.logged_at.desc())
    )
    symptoms = result.scalars().all()
    return symptoms


@router.post("/", response_model=SymptomLogResponse, status_code=status.HTTP_201_CREATED)
async def create_symptom(
    symptom_in: SymptomLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Record a user-reported digestive or bodily symptom."""
    symptom = SymptomLog(
        user_id=current_user.id,
        symptom_type=symptom_in.symptom_type,
        severity=symptom_in.severity,
        logged_at=symptom_in.logged_at or datetime.now(timezone.utc),
        onset_minutes_after_meal=symptom_in.onset_minutes_after_meal,
        suspected_food=symptom_in.suspected_food,
        notes=symptom_in.notes,
    )
    db.add(symptom)
    await db.commit()
    await db.refresh(symptom)
    return symptom


@router.put("/{symptom_id}", response_model=SymptomLogResponse)
async def update_symptom(
    symptom_id: int,
    symptom_in: SymptomLogUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SymptomLog).where(SymptomLog.id == symptom_id, SymptomLog.user_id == current_user.id)
    )
    symptom = result.scalars().first()
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom log not found")

    update_dict = symptom_in.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(symptom, key, value)

    await db.commit()
    await db.refresh(symptom)
    return symptom


@router.delete("/{symptom_id}", status_code=status.HTTP_200_OK)
async def delete_symptom(
    symptom_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SymptomLog).where(SymptomLog.id == symptom_id, SymptomLog.user_id == current_user.id)
    )
    symptom = result.scalars().first()
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom log not found")

    await db.delete(symptom)
    await db.commit()
    return {"message": "Symptom log deleted successfully"}


@router.get("/patterns", response_model=List[InsightResponse])
async def get_pattern_analysis(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Food & Symptom Pattern Analyzer:
    Analyzes actual recorded food entries and symptom logs over time.
    Calculates time lags, co-occurrence, and flags associations with medical disclaimers.
    """
    # Fetch food entries
    f_res = await db.execute(
        select(FoodEntry).where(FoodEntry.user_id == current_user.id)
    )
    food_entries = [
        {"food_name": f.food_name, "logged_at": f.logged_at}
        for f in f_res.scalars().all()
    ]

    # Fetch symptom logs
    s_res = await db.execute(
        select(SymptomLog).where(SymptomLog.user_id == current_user.id)
    )
    symptom_logs = [
        {"symptom_type": s.symptom_type, "logged_at": s.logged_at}
        for s in s_res.scalars().all()
    ]

    # Run deterministic mining
    raw_patterns = symptom_analysis_service.analyze_patterns(
        food_entries=food_entries,
        symptom_logs=symptom_logs,
    )

    # Enhance descriptions with Gemini (or fallback)
    insights_data = await symptom_analysis_service.generate_insight_descriptions(raw_patterns)

    # Persist or update in database
    saved_insights = []
    for idata in insights_data:
        # Check if insight already exists
        exist_res = await db.execute(
            select(FoodPatternInsight).where(
                FoodPatternInsight.user_id == current_user.id,
                FoodPatternInsight.food_name == idata.get("food_name"),
                FoodPatternInsight.symptom_type == idata.get("symptom_type"),
            )
        )
        existing = exist_res.scalars().first()
        if existing:
            existing.frequency = idata["frequency"]
            existing.confidence = idata["confidence"]
            existing.supporting_records_count = idata["supporting_records_count"]
            existing.description = idata["description"]
            existing.actionable_tip = idata["actionable_tip"]
            saved_insights.append(existing)
        else:
            new_ins = FoodPatternInsight(
                user_id=current_user.id,
                insight_type=idata["insight_type"],
                title=idata["title"],
                food_name=idata.get("food_name"),
                symptom_type=idata.get("symptom_type"),
                frequency=idata["frequency"],
                confidence=idata["confidence"],
                supporting_records_count=idata["supporting_records_count"],
                description=idata["description"],
                actionable_tip=idata["actionable_tip"],
                medical_disclaimer=idata["medical_disclaimer"],
                user_feedback="none",
            )
            db.add(new_ins)
            saved_insights.append(new_ins)

    await db.commit()
    for ins in saved_insights:
        await db.refresh(ins)

    return saved_insights


@router.post("/feedback/{insight_id}", response_model=InsightResponse)
async def submit_insight_feedback(
    insight_id: int,
    feedback_in: InsightFeedbackUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Allows users to mark an insight as helpful, inaccurate, or not relevant."""
    result = await db.execute(
        select(FoodPatternInsight).where(
            FoodPatternInsight.id == insight_id,
            FoodPatternInsight.user_id == current_user.id,
        )
    )
    insight = result.scalars().first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight record not found")

    insight.user_feedback = feedback_in.user_feedback
    await db.commit()
    await db.refresh(insight)
    return insight
