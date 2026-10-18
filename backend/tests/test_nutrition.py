import pytest
from app.services.nutrition_service import nutrition_service


def test_search_foods():
    results = nutrition_service.search_foods("roti")
    assert len(results) > 0
    assert any("roti" in r["name"].lower() for r in results)

    # Hindi search
    hindi_results = nutrition_service.search_foods("दाल")
    assert len(hindi_results) > 0


def test_calculate_portion_nutrients():
    # 2 medium rotis (approx 35g each = 70g)
    calc = nutrition_service.calculate_portion_nutrients(
        food_name="Roti / Chapati (Whole Wheat)",
        quantity=2.0,
        unit="roti (medium)",
    )
    assert calc["serving_weight_g"] == 70.0
    # 264 kcal / 100g * 70g = 184.8 kcal
    assert calc["calories"] == 184.8
    assert calc["protein_g"] > 6.0
    assert calc["fiber_g"] > 5.0
    assert calc["data_source"] == "curated_database"


def test_calculate_daily_targets():
    # 70kg male, 175cm, 30 years old, moderate activity, general wellness
    targets = nutrition_service.calculate_daily_targets(
        age=30,
        gender="male",
        height_cm=175.0,
        weight_kg=70.0,
        activity_level="moderate",
        fitness_goal="general_wellness",
    )
    assert targets["calories"] > 1800.0
    assert targets["protein_g"] >= 70.0
    assert targets["fiber_g"] >= 25.0
    assert targets["water_ml"] >= 2000


def test_safe_weight_loss_target():
    # Verify no extreme calorie deficits are prescribed
    targets = nutrition_service.calculate_daily_targets(
        age=25,
        gender="female",
        height_cm=160.0,
        weight_kg=55.0,
        activity_level="sedentary",
        fitness_goal="weight_loss",
    )
    # Deficit must not drop below safe floor of 1350 kcal
    assert targets["calories"] >= 1350.0
