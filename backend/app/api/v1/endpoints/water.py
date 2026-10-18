from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.water import WaterLog
from app.schemas.water import WaterLogCreate, WaterLogResponse, WaterDailySummary
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[WaterLogResponse])
async def list_water_logs(
    target_date: Optional[str] = Query(None, description="Date in YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(WaterLog).where(WaterLog.user_id == current_user.id)
    if target_date:
        d = datetime.strptime(target_date, "%Y-%m-%d").date()
        start_dt = datetime(d.year, d.month, d.day, 0, 0, 0, tzinfo=timezone.utc)
        end_dt = datetime(d.year, d.month, d.day, 23, 59, 59, tzinfo=timezone.utc)
        query = query.where(WaterLog.logged_at >= start_dt, WaterLog.logged_at <= end_dt)
    query = query.order_by(WaterLog.logged_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=WaterLogResponse, status_code=status.HTTP_201_CREATED)
async def log_water(
    water_in: WaterLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    log = WaterLog(
        user_id=current_user.id,
        amount_ml=water_in.amount_ml,
        logged_at=water_in.logged_at or datetime.now(timezone.utc),
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


@router.delete("/{log_id}", status_code=status.HTTP_200_OK)
async def delete_water(
    log_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WaterLog).where(WaterLog.id == log_id, WaterLog.user_id == current_user.id)
    )
    log = result.scalars().first()
    if not log:
        raise HTTPException(status_code=404, detail="Water entry not found")

    await db.delete(log)
    await db.commit()
    return {"message": "Water entry deleted successfully"}


@router.get("/summary", response_model=WaterDailySummary)
async def get_water_summary(
    target_date: Optional[str] = Query(None, description="Date in YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if target_date:
        d = datetime.strptime(target_date, "%Y-%m-%d").date()
    else:
        d = datetime.now(timezone.utc).date()

    start_dt = datetime(d.year, d.month, d.day, 0, 0, 0, tzinfo=timezone.utc)
    end_dt = datetime(d.year, d.month, d.day, 23, 59, 59, tzinfo=timezone.utc)

    # Get target from profile
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()
    target_ml = profile.daily_water_target_ml if profile else 2500

    result = await db.execute(
        select(WaterLog).where(
            WaterLog.user_id == current_user.id,
            WaterLog.logged_at >= start_dt,
            WaterLog.logged_at <= end_dt,
        )
    )
    logs = result.scalars().all()
    total_ml = sum(l.amount_ml for l in logs)

    return WaterDailySummary(
        date=d.strftime("%Y-%m-%d"),
        total_ml=total_ml,
        target_ml=target_ml,
        percentage=round((total_ml / max(1, target_ml)) * 100, 1),
        glasses=round(total_ml / 250.0, 1),
    )
