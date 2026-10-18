from datetime import datetime, date, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from app.models.food import FoodEntry
from app.schemas.food import (
    FoodEntryCreate,
    FoodEntryUpdate,
    FoodEntryResponse,
    PortionCalculateRequest,
    PortionCalculateResponse,
)
from app.api.deps import get_current_user
from app.services.nutrition_service import nutrition_service
from app.services.gemini_service import gemini_service

router = APIRouter()


@router.get("/search")
async def search_foods(
    query: Optional[str] = Query(None, description="Search term for Indian or global foods"),
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
):
    """Search curated Indian & global nutrition database."""
    items = nutrition_service.search_foods(query=query or "", limit=limit)
    return {"items": items}


@router.post("/calculate-portion", response_model=PortionCalculateResponse)
async def calculate_portion(
    req: PortionCalculateRequest,
    current_user: User = Depends(get_current_user),
):
    """Calculate nutrients for a specific portion using deterministic formulas."""
    calc = nutrition_service.calculate_portion_nutrients(
        food_name=req.food_name,
        quantity=req.quantity,
        unit=req.unit,
    )
    return calc


@router.get("/", response_model=List[FoodEntryResponse])
async def list_food_entries(
    target_date: Optional[str] = Query(None, description="Filter by date in YYYY-MM-DD format"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve logged food entries for authenticated user."""
    query = select(FoodEntry).where(FoodEntry.user_id == current_user.id)

    if target_date:
        try:
            d = datetime.strptime(target_date, "%Y-%m-%d").date()
            start_dt = datetime(d.year, d.month, d.day, 0, 0, 0, tzinfo=timezone.utc)
            end_dt = datetime(d.year, d.month, d.day, 23, 59, 59, tzinfo=timezone.utc)
            query = query.where(FoodEntry.logged_at >= start_dt, FoodEntry.logged_at <= end_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    query = query.order_by(FoodEntry.logged_at.desc())
    result = await db.execute(query)
    entries = result.scalars().all()
    return entries


@router.post("/", response_model=FoodEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_food_entry(
    entry_in: FoodEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new food entry with verified nutrient calculations."""
    # If calories/protein/carbs were not provided or needed verification, compute them
    if entry_in.calories is None or entry_in.protein_g is None:
        calc = nutrition_service.calculate_portion_nutrients(
            food_name=entry_in.food_name,
            quantity=entry_in.quantity,
            unit=entry_in.unit,
            serving_weight_g=entry_in.serving_weight_g,
        )
        calories = calc["calories"]
        protein_g = calc["protein_g"]
        carbs_g = calc["carbs_g"]
        fat_g = calc["fat_g"]
        fiber_g = calc["fiber_g"]
        sugar_g = calc["sugar_g"]
        sodium_mg = calc["sodium_mg"]
        source = calc["data_source"]
    else:
        calories = entry_in.calories
        protein_g = entry_in.protein_g
        carbs_g = entry_in.carbs_g or 0.0
        fat_g = entry_in.fat_g or 0.0
        fiber_g = entry_in.fiber_g or 0.0
        sugar_g = entry_in.sugar_g or 0.0
        sodium_mg = entry_in.sodium_mg or 0.0
        source = entry_in.source

    entry = FoodEntry(
        user_id=current_user.id,
        food_name=entry_in.food_name,
        meal_category=entry_in.meal_category,
        quantity=entry_in.quantity,
        unit=entry_in.unit,
        serving_weight_g=entry_in.serving_weight_g,
        calories=calories,
        protein_g=protein_g,
        carbs_g=carbs_g,
        fat_g=fat_g,
        fiber_g=fiber_g,
        sugar_g=sugar_g,
        sodium_mg=sodium_mg,
        source=source,
        confirmed_by_user=entry_in.confirmed_by_user,
        image_url=entry_in.image_url,
        notes=entry_in.notes,
        logged_at=entry_in.logged_at or datetime.now(timezone.utc),
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("/{entry_id}", response_model=FoodEntryResponse)
async def get_food_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(FoodEntry).where(FoodEntry.id == entry_id, FoodEntry.user_id == current_user.id)
    )
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Food entry not found")
    return entry


@router.put("/{entry_id}", response_model=FoodEntryResponse)
async def update_food_entry(
    entry_id: int,
    entry_in: FoodEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(FoodEntry).where(FoodEntry.id == entry_id, FoodEntry.user_id == current_user.id)
    )
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Food entry not found")

    update_dict = entry_in.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(entry, key, value)

    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_200_OK)
async def delete_food_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(FoodEntry).where(FoodEntry.id == entry_id, FoodEntry.user_id == current_user.id)
    )
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Food entry not found")

    await db.delete(entry)
    await db.commit()
    return {"message": "Food entry removed successfully"}


@router.post("/upload-image")
async def upload_food_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a food photo for Gemini Vision AI analysis.
    Validates format & size, extracts detected dishes, and pairs with nutrition database.
    """
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file.content_type}. Please upload JPG, PNG, or WebP.",
        )

    # Read image contents (max 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds 5MB size limit.")

    # Call Gemini Multimodal Image Understanding
    detected_items = await gemini_service.analyze_food_image(
        image_bytes=contents,
        mime_type=file.content_type,
    )

    # For each detected item, map to database nutrients if possible
    enriched_items = []
    for item in detected_items:
        fname = item.get("food_name", "")
        db_match = nutrition_service.get_food_by_name(fname)
        default_calc = nutrition_service.calculate_portion_nutrients(
            food_name=fname,
            quantity=1.0,
            unit="serving",
        )
        enriched_items.append({
            "detected_name": fname,
            "matched_food_name": db_match["name"] if db_match else fname,
            "category": item.get("category", "General"),
            "estimated_portion": item.get("estimated_portion", "1 serving"),
            "confidence": item.get("confidence", "medium"),
            "note": item.get("note", ""),
            "estimated_nutrients": default_calc,
            "standard_units": db_match.get("standard_units", []) if db_match else [],
        })

    return {
        "status": "success",
        "detected_count": len(enriched_items),
        "items": enriched_items,
        "message": "Dishes detected successfully." if enriched_items else "No food items could be clearly identified. You can search and log your meal manually below.",
        "disclaimer": "AI image estimation provides approximate dish identifications. You can modify the food name, portion, and quantity before confirming.",
    }
