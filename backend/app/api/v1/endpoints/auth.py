from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.consent import ConsentRecord
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Create new user
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
    )
    db.add(new_user)
    await db.flush()

    # Create default user profile
    profile = UserProfile(
        user_id=new_user.id,
        display_name=user_in.display_name or "Health Seeker",
        dietary_preference="vegetarian",
        fitness_goal="general_wellness",
        daily_calorie_target=2000.0,
        daily_protein_target=65.0,
        daily_carb_target=250.0,
        daily_fat_target=60.0,
        daily_fiber_target=30.0,
        daily_water_target_ml=2500,
        onboarding_completed=False,
    )
    db.add(profile)

    # Create consent record
    consent = ConsentRecord(
        user_id=new_user.id,
        health_data_consent=True,
        ai_processing_consent=True,
    )
    db.add(consent)

    await db.commit()
    await db.refresh(new_user)

    # Generate JWT
    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user,
    }


@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    user = result.scalars().first()

    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account",
        )

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Acknowledge client logout and token invalidation."""
    return {"message": "Successfully logged out. Please clear your local session token."}


@router.delete("/account", status_code=status.HTTP_200_OK)
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Complete account and health data deletion in compliance with user privacy rights.
    Cascades and deletes profile, logs, consent, and chat records permanently.
    """
    await db.delete(current_user)
    await db.commit()
    return {"message": "Your account and all associated health records have been permanently deleted."}
