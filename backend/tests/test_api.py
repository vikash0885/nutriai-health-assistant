import pytest
from httpx import AsyncClient
from app.core.config import settings


@pytest.mark.asyncio
async def test_food_flow(client: AsyncClient, auth_headers: dict):
    # 1. Search food
    s_res = await client.get(f"{settings.API_V1_STR}/foods/search?query=dal", headers=auth_headers)
    assert s_res.status_code == 200
    assert len(s_res.json()["items"]) > 0

    # 2. Log food entry
    log_res = await client.post(
        f"{settings.API_V1_STR}/foods/",
        json={
            "food_name": "Moong Dal (Yellow / Green)",
            "meal_category": "lunch",
            "quantity": 1.0,
            "unit": "katori",
            "serving_weight_g": 150.0,
        },
        headers=auth_headers,
    )
    assert log_res.status_code == 201
    entry = log_res.json()
    assert entry["food_name"] == "Moong Dal (Yellow / Green)"
    assert entry["calories"] > 0
    assert entry["protein_g"] > 0
    entry_id = entry["id"]

    # 3. List entries
    list_res = await client.get(f"{settings.API_V1_STR}/foods/", headers=auth_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 4. Delete entry
    del_res = await client.delete(f"{settings.API_V1_STR}/foods/{entry_id}", headers=auth_headers)
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_water_and_exercise(client: AsyncClient, auth_headers: dict):
    # Log water
    w_res = await client.post(
        f"{settings.API_V1_STR}/water/",
        json={"amount_ml": 500},
        headers=auth_headers,
    )
    assert w_res.status_code == 201
    assert w_res.json()["amount_ml"] == 500

    # Check water summary
    w_sum = await client.get(f"{settings.API_V1_STR}/water/summary", headers=auth_headers)
    assert w_sum.status_code == 200
    assert w_sum.json()["total_ml"] == 500

    # Log exercise
    ex_res = await client.post(
        f"{settings.API_V1_STR}/exercise/",
        json={
            "activity_name": "Evening Post-Meal Digestion Stroll",
            "activity_category": "post_meal_stroll",
            "duration_minutes": 20,
            "intensity": "low",
        },
        headers=auth_headers,
    )
    assert ex_res.status_code == 201
    assert ex_res.json()["calories_burned"] > 0


@pytest.mark.asyncio
async def test_dashboard_endpoint(client: AsyncClient, auth_headers: dict):
    res = await client.get(f"{settings.API_V1_STR}/dashboard/", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "today_nutrition" in data
    assert "hydration" in data
    assert "activity" in data
    assert "habit_insights" in data
