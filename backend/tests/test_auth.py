import pytest
from httpx import AsyncClient
from app.core.config import settings


@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    # 1. Register new user
    res = await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json={
            "email": "freshuser@nutriai.app",
            "password": "SecurePassword123!",
            "display_name": "Fresh User",
        },
    )
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "freshuser@nutriai.app"

    # 2. Prevent duplicate email registration
    res_dup = await client.post(
        f"{settings.API_V1_STR}/auth/register",
        json={
            "email": "freshuser@nutriai.app",
            "password": "AnotherPassword123!",
            "display_name": "Clone User",
        },
    )
    assert res_dup.status_code == 400

    # 3. Successful Login
    res_login = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={
            "email": "freshuser@nutriai.app",
            "password": "SecurePassword123!",
        },
    )
    assert res_login.status_code == 200
    login_data = res_login.json()
    assert "access_token" in login_data

    # 4. Failed Login (wrong password)
    res_bad = await client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={
            "email": "freshuser@nutriai.app",
            "password": "WrongPassword!",
        },
    )
    assert res_bad.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_without_token(client: AsyncClient):
    res = await client.get(f"{settings.API_V1_STR}/auth/me")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, auth_headers: dict):
    res = await client.get(f"{settings.API_V1_STR}/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "testuser@nutriai.app"
