import pytest
from datetime import datetime, timedelta, timezone
from app.services.symptom_analysis_service import symptom_analysis_service


def test_symptom_pattern_detection():
    base_time = datetime(2026, 10, 10, 12, 0, 0, tzinfo=timezone.utc)

    # User eats Samosa 3 times, followed by Bloating within 2 hours each time
    food_entries = [
        {"food_name": "Samosa", "logged_at": base_time},
        {"food_name": "Samosa", "logged_at": base_time + timedelta(days=1)},
        {"food_name": "Samosa", "logged_at": base_time + timedelta(days=2)},
        {"food_name": "Moong Dal", "logged_at": base_time + timedelta(days=3)},
    ]

    symptom_logs = [
        {"symptom_type": "bloating", "logged_at": base_time + timedelta(hours=1, minutes=30)},
        {"symptom_type": "bloating", "logged_at": base_time + timedelta(days=1, hours=2)},
        {"symptom_type": "bloating", "logged_at": base_time + timedelta(days=2, hours=1)},
    ]

    patterns = symptom_analysis_service.analyze_patterns(
        food_entries=food_entries,
        symptom_logs=symptom_logs,
    )

    assert len(patterns) >= 1
    top = patterns[0]
    assert top["food_name"] == "Samosa"
    assert top["symptom_type"] == "Bloating"
    assert top["frequency"] == 3
    assert top["confidence"] in ["moderate", "high"]
    assert top["avg_lag_hours"] > 0
