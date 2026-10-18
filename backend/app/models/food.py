from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


class FoodEntry(Base):
    __tablename__ = "food_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    food_name = Column(String(200), nullable=False)
    meal_category = Column(String(50), nullable=False)  # breakfast, lunch, dinner, snack
    quantity = Column(Float, nullable=False, default=1.0)
    unit = Column(String(50), nullable=False, default="serving")
    serving_weight_g = Column(Float, nullable=False, default=100.0)

    # Nutritional values (calculated for the logged portion)
    calories = Column(Float, nullable=False, default=0.0)
    protein_g = Column(Float, nullable=False, default=0.0)
    carbs_g = Column(Float, nullable=False, default=0.0)
    fat_g = Column(Float, nullable=False, default=0.0)
    fiber_g = Column(Float, nullable=False, default=0.0)
    sugar_g = Column(Float, nullable=False, default=0.0)
    sodium_mg = Column(Float, nullable=False, default=0.0)

    source = Column(String(50), default="curated_database")  # curated_database, manual, gemini_vision
    confirmed_by_user = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)

    logged_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="food_entries")
