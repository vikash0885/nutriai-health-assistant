from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    symptom_type = Column(String(100), nullable=False)  # bloating, acidity, heartburn, indigestion, constipation, nausea, headache, fatigue, other
    severity = Column(String(50), nullable=False)  # mild, moderate, severe
    logged_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    onset_minutes_after_meal = Column(Integer, nullable=True)
    suspected_food = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="symptom_logs")
