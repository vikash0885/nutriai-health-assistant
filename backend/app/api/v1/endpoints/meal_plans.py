import json
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.meal_plan import MealPlan, MealPlanItem, GroceryItem
from app.models.food import FoodEntry
from app.schemas.meal_plan import (
    MealPlanGenerateRequest,
    MealPlanResponse,
    MealPlanItemResponse,
    GroceryItemCreate,
    GroceryItemUpdate,
    GroceryItemResponse,
)
from app.api.deps import get_current_user
from app.services.gemini_service import gemini_service
from app.services.nutrition_service import nutrition_service

router = APIRouter()


def _format_meal_plan(plan: MealPlan) -> dict:
    return {
        "id": plan.id,
        "user_id": plan.user_id,
        "title": plan.title,
        "target_date": plan.target_date,
        "total_calories": plan.total_calories,
        "total_protein_g": plan.total_protein_g,
        "notes": plan.notes,
        "created_at": plan.created_at,
        "items": [
            {
                "id": item.id,
                "meal_plan_id": item.meal_plan_id,
                "meal_category": item.meal_category,
                "food_name": item.food_name,
                "portion_description": item.portion_description,
                "estimated_calories": item.estimated_calories,
                "protein_g": item.protein_g,
                "carbs_g": item.carbs_g,
                "fat_g": item.fat_g,
                "is_completed": item.is_completed,
                "recipe_instructions": item.recipe_instructions,
                "ingredients": json.loads(item.ingredients_json or "[]"),
            }
            for item in (plan.items or [])
        ],
    }


@router.post("/generate", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_meal_plan(
    req: MealPlanGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate an AI-powered personalized meal plan based on user profile,
    dietary preferences, caloric targets, and budget.
    """
    prof_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = prof_res.scalars().first()

    dietary_pref = req.dietary_preference or (profile.dietary_preference if profile else "vegetarian")
    goal = profile.fitness_goal if profile else "general_wellness"
    target_cal = req.target_calories or (profile.daily_calorie_target if profile else 2000.0)
    target_prot = req.target_protein_g or (profile.daily_protein_target if profile else 65.0)
    allergies = req.allergies or (json.loads(profile.allergies or "[]") if profile else [])
    budget = req.budget_inr or (profile.daily_budget_inr if profile else 250.0)
    target_date = req.target_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")

    plan_data = await gemini_service.generate_smart_meal_plan(
        dietary_preference=dietary_pref,
        fitness_goal=goal,
        target_calories=target_cal,
        target_protein_g=target_prot,
        allergies=allergies,
        budget_inr=budget,
        custom_requests=req.custom_requests,
    )

    new_plan = MealPlan(
        user_id=current_user.id,
        title=plan_data.get("title", f"Custom {dietary_pref.capitalize()} Plan"),
        target_date=target_date,
        total_calories=plan_data.get("total_calories", target_cal),
        total_protein_g=plan_data.get("total_protein_g", target_prot),
        notes=plan_data.get("notes", ""),
    )
    db.add(new_plan)
    await db.flush()

    for item in plan_data.get("items", []):
        db_item = MealPlanItem(
            meal_plan_id=new_plan.id,
            meal_category=item.get("meal_category", "snack"),
            food_name=item.get("food_name", "Healthy Meal"),
            portion_description=item.get("portion_description", "1 serving"),
            estimated_calories=item.get("estimated_calories", 200.0),
            protein_g=item.get("protein_g", 10.0),
            carbs_g=item.get("carbs_g", 25.0),
            fat_g=item.get("fat_g", 5.0),
            recipe_instructions=item.get("recipe_instructions", ""),
            ingredients_json=json.dumps(item.get("ingredients", [])),
        )
        db.add(db_item)

    await db.commit()
    # Eagerly load items
    result = await db.execute(
        select(MealPlan).options(selectinload(MealPlan.items)).where(MealPlan.id == new_plan.id)
    )
    saved_plan = result.scalars().first()
    return _format_meal_plan(saved_plan)


@router.get("/", response_model=List[MealPlanResponse])
async def list_meal_plans(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(MealPlan)
        .options(selectinload(MealPlan.items))
        .where(MealPlan.user_id == current_user.id)
        .order_by(MealPlan.created_at.desc())
    )
    plans = result.scalars().all()
    return [_format_meal_plan(p) for p in plans]


@router.get("/{plan_id}", response_model=MealPlanResponse)
async def get_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(MealPlan)
        .options(selectinload(MealPlan.items))
        .where(MealPlan.id == plan_id, MealPlan.user_id == current_user.id)
    )
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return _format_meal_plan(plan)


@router.post("/{plan_id}/add-to-diary")
async def add_plan_to_diary(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Adds all items from the chosen meal plan directly into the user's Food Diary."""
    result = await db.execute(
        select(MealPlan)
        .options(selectinload(MealPlan.items))
        .where(MealPlan.id == plan_id, MealPlan.user_id == current_user.id)
    )
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    added_entries = []
    for item in plan.items:
        entry = FoodEntry(
            user_id=current_user.id,
            food_name=item.food_name,
            meal_category=item.meal_category,
            quantity=1.0,
            unit="serving",
            serving_weight_g=150.0,
            calories=item.estimated_calories,
            protein_g=item.protein_g,
            carbs_g=item.carbs_g,
            fat_g=item.fat_g,
            fiber_g=3.0,
            sugar_g=1.5,
            sodium_mg=200.0,
            source="meal_planner",
            confirmed_by_user=True,
            notes=f"Added from Meal Plan: {plan.title}",
            logged_at=datetime.now(timezone.utc),
        )
        db.add(entry)
        item.is_completed = True
        added_entries.append(entry)

    await db.commit()
    return {"message": f"Successfully logged {len(added_entries)} meals to your Food Diary!"}


@router.post("/{plan_id}/grocery-list")
async def generate_grocery_list_from_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Extracts ingredients from meal plan and builds an organized grocery shopping list."""
    result = await db.execute(
        select(MealPlan)
        .options(selectinload(MealPlan.items))
        .where(MealPlan.id == plan_id, MealPlan.user_id == current_user.id)
    )
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    def categorize_ingredient(ing: str) -> str:
        ing_low = ing.lower()
        if any(w in ing_low for w in ["onion", "tomato", "palak", "spinach", "bhindi", "peas", "cucumber", "lauki", "lemon", "carrot", "beans", "coriander", "ginger", "garlic", "apple", "banana"]):
            return "Produce & Fresh Veggies"
        if any(w in ing_low for w in ["paneer", "curd", "dahi", "milk", "egg", "chicken", "fish", "tofu", "buttermilk"]):
            return "Dairy & Proteins"
        if any(w in ing_low for w in ["atta", "wheat", "rice", "dal", "moong", "chana", "poha", "rava", "dalia", "oats", "besan"]):
            return "Grains & Pulses"
        if any(w in ing_low for w in ["turmeric", "cumin", "jeera", "mustard", "garam masala", "salt", "chilli", "ghee", "oil", "chaat"]):
            return "Spices & Oils"
        return "Pantry"

    added_count = 0
    all_ingredients = set()
    for item in plan.items:
        ing_list = json.loads(item.ingredients_json or "[]")
        for ing in ing_list:
            clean = ing.strip()
            if clean and clean.lower() not in all_ingredients:
                all_ingredients.add(clean.lower())
                cat = categorize_ingredient(clean)
                g_item = GroceryItem(
                    user_id=current_user.id,
                    item_name=clean,
                    category=cat,
                    quantity="1 pack / standard qty",
                    is_purchased=False,
                )
                db.add(g_item)
                added_count += 1

    await db.commit()
    return {"message": f"Added {added_count} items to your Grocery List."}


@router.get("/grocery-list", response_model=List[GroceryItemResponse])
async def list_grocery_items(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GroceryItem)
        .where(GroceryItem.user_id == current_user.id)
        .order_by(GroceryItem.created_at.desc())
    )
    return result.scalars().all()


@router.post("/grocery-list", response_model=GroceryItemResponse, status_code=status.HTTP_201_CREATED)
async def add_grocery_item(
    item_in: GroceryItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = GroceryItem(
        user_id=current_user.id,
        item_name=item_in.item_name,
        category=item_in.category,
        quantity=item_in.quantity,
        is_purchased=False,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.put("/grocery-list/{item_id}", response_model=GroceryItemResponse)
async def update_grocery_item(
    item_id: int,
    item_in: GroceryItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GroceryItem).where(GroceryItem.id == item_id, GroceryItem.user_id == current_user.id)
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")

    update_dict = item_in.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(item, key, value)

    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/grocery-list/{item_id}", status_code=status.HTTP_200_OK)
async def delete_grocery_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(GroceryItem).where(GroceryItem.id == item_id, GroceryItem.user_id == current_user.id)
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Item deleted from grocery list"}
