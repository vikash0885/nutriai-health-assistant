import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.consent import ConsentRecord
from app.schemas.profile import ProfileUpdate, ProfileResponse, ConsentBase, ConsentResponse
from app.api.deps import get_current_user
from app.services.nutrition_service import nutrition_service

router = APIRouter()


def _format_profile_response(profile: UserProfile) -> dict:
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "display_name": profile.display_name,
        "age": profile.age,
        "gender": profile.gender,
        "height_cm": profile.height_cm,
        "weight_kg": profile.weight_kg,
        "activity_level": profile.activity_level,
        "dietary_preference": profile.dietary_preference,
        "fitness_goal": profile.fitness_goal,
        "allergies": json.loads(profile.allergies or "[]"),
        "restrictions": json.loads(profile.restrictions or "[]"),
        "preferred_foods": json.loads(profile.preferred_foods or "[]"),
        "disliked_foods": json.loads(profile.disliked_foods or "[]"),
        "daily_budget_inr": profile.daily_budget_inr,
        "preferred_language": profile.preferred_language,
        "health_considerations": profile.health_considerations,
        "daily_calorie_target": profile.daily_calorie_target,
        "daily_protein_target": profile.daily_protein_target,
        "daily_carb_target": profile.daily_carb_target,
        "daily_fat_target": profile.daily_fat_target,
        "daily_fiber_target": profile.daily_fiber_target,
        "daily_water_target_ml": profile.daily_water_target_ml,
        "onboarding_completed": profile.onboarding_completed,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at,
    }


@router.get("/", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return _format_profile_response(profile)


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_dict = profile_in.model_dump(exclude_unset=True)

    # Convert list fields to JSON strings
    for json_col in ["allergies", "restrictions", "preferred_foods", "disliked_foods"]:
        if json_col in update_dict and update_dict[json_col] is not None:
            update_dict[json_col] = json.dumps(update_dict[json_col])

    for key, value in update_dict.items():
        setattr(profile, key, value)

    # Automatically recompute daily targets if biometric fields were provided
    if any(k in update_dict for k in ["age", "gender", "height_cm", "weight_kg", "activity_level", "fitness_goal"]):
        targets = nutrition_service.calculate_daily_targets(
            age=profile.age,
            gender=profile.gender,
            height_cm=profile.height_cm,
            weight_kg=profile.weight_kg,
            activity_level=profile.activity_level or "moderate",
            fitness_goal=profile.fitness_goal or "general_wellness",
        )
        if "daily_calorie_target" not in update_dict or not update_dict["daily_calorie_target"]:
            profile.daily_calorie_target = targets["calories"]
        if "daily_protein_target" not in update_dict or not update_dict["daily_protein_target"]:
            profile.daily_protein_target = targets["protein_g"]
        if "daily_carb_target" not in update_dict or not update_dict["daily_carb_target"]:
            profile.daily_carb_target = targets["carbs_g"]
        if "daily_fat_target" not in update_dict or not update_dict["daily_fat_target"]:
            profile.daily_fat_target = targets["fat_g"]
        if "daily_fiber_target" not in update_dict or not update_dict["daily_fiber_target"]:
            profile.daily_fiber_target = targets["fiber_g"]
        if "daily_water_target_ml" not in update_dict or not update_dict["daily_water_target_ml"]:
            profile.daily_water_target_ml = targets["water_ml"]

    await db.commit()
    await db.refresh(profile)
    return _format_profile_response(profile)


@router.get("/consent", response_model=ConsentResponse)
async def get_consent(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ConsentRecord).where(ConsentRecord.user_id == current_user.id))
    consent = result.scalars().first()
    if not consent:
        consent = ConsentRecord(user_id=current_user.id, health_data_consent=True, ai_processing_consent=True)
        db.add(consent)
        await db.commit()
        await db.refresh(consent)
    return consent


@router.put("/consent", response_model=ConsentResponse)
async def update_consent(
    consent_in: ConsentBase,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ConsentRecord).where(ConsentRecord.user_id == current_user.id))
    consent = result.scalars().first()
    if not consent:
        consent = ConsentRecord(user_id=current_user.id)
        db.add(consent)

    consent.health_data_consent = consent_in.health_data_consent
    consent.ai_processing_consent = consent_in.ai_processing_consent
    await db.commit()
    await db.refresh(consent)
    return consent
