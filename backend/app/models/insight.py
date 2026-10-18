from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


class FoodPatternInsight(Base):
    __tablename__ = "food_pattern_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    insight_type = Column(String(50), nullable=False)  # food_symptom_association, habit_pattern, nutrition_gap
    title = Column(String(255), nullable=False)
    food_name = Column(String(200), nullable=True)
    symptom_type = Column(String(100), nullable=True)

    frequency = Column(Integer, default=1)
    confidence = Column(String(50), default="moderate")  # low, moderate, high
    supporting_records_count = Column(Integer, default=0)

    date_range_start = Column(DateTime, nullable=True)
    date_range_end = Column(DateTime, nullable=True)

    description = Column(Text, nullable=False)
    actionable_tip = Column(Text, nullable=True)
    medical_disclaimer = Column(
        Text,
        default="This is a wellness pattern observation based strictly on your personal self-reported logs. It does not establish clinical causation or constitute medical advice. Consult a healthcare provider for persistent symptoms."
    )
    user_feedback = Column(String(50), default="none")  # none, helpful, inaccurate, not_relevant

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="pattern_insights")
