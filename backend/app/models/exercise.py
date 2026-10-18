from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


class ExerciseLog(Base):
    __tablename__ = "exercise_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    activity_name = Column(String(200), nullable=False)
    activity_category = Column(String(50), nullable=False)  # walking, post_meal_stroll, cardio, strength, yoga, stretching
    duration_minutes = Column(Integer, nullable=False)
    intensity = Column(String(50), default="moderate")  # low, moderate, high
    calories_burned = Column(Float, nullable=False, default=0.0)
    logged_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="exercise_logs")
