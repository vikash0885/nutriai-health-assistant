from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    display_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(30), nullable=True, default="prefer_not_to_say")  # male, female, other, prefer_not_to_say
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)

    activity_level = Column(String(50), default="moderate")  # sedentary, light, moderate, active, very_active
    dietary_preference = Column(String(50), default="vegetarian")  # vegetarian, vegan, eggetarian, non_vegetarian, jain
    fitness_goal = Column(String(50), default="general_wellness")  # general_wellness, weight_maintenance, weight_loss, muscle_building, improve_activity

    allergies = Column(Text, default="[]")  # JSON array
    restrictions = Column(Text, default="[]")  # JSON array
    preferred_foods = Column(Text, default="[]")  # JSON array
    disliked_foods = Column(Text, default="[]")  # JSON array

    daily_budget_inr = Column(Float, nullable=True, default=250.0)
    preferred_language = Column(String(20), default="en")  # en, hi, hinglish
    health_considerations = Column(Text, nullable=True)

    # Computed daily targets
    daily_calorie_target = Column(Float, default=2000.0)
    daily_protein_target = Column(Float, default=65.0)
    daily_carb_target = Column(Float, default=250.0)
    daily_fat_target = Column(Float, default=60.0)
    daily_fiber_target = Column(Float, default=30.0)
    daily_water_target_ml = Column(Integer, default=2500)

    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")
