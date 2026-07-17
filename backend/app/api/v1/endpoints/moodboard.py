"""Moodboard endpoints — manage inspiration images (authenticated users)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import MoodboardItem, User
from app.api.v1.deps import get_current_user
from app.schemas import MoodboardItemCreate, MoodboardItemResponse, MoodboardItemUpdate

router = APIRouter()


@router.get("/", response_model=list[MoodboardItemResponse])
async def list_moodboard_items(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all moodboard items for the authenticated user."""
    result = await db.execute(
        select(MoodboardItem)
        .where(MoodboardItem.user_id == user.id)
        .order_by(MoodboardItem.sort_order, MoodboardItem.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=MoodboardItemResponse, status_code=status.HTTP_201_CREATED)
async def create_moodboard_item(
    data: MoodboardItemCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add an image to the user's moodboard."""
    item = MoodboardItem(
        user_id=user.id,
        image_url=data.image_url,
        caption=data.caption,
        category=data.category,
        position_x=data.position_x or 0,
        position_y=data.position_y or 0,
        width=data.width or 200,
        height=data.height or 200,
        sort_order=data.sort_order or 0,
    )
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


@router.put("/{item_id}", response_model=MoodboardItemResponse)
async def update_moodboard_item(
    item_id: str,
    data: MoodboardItemUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a moodboard item caption, position, etc."""
    result = await db.execute(
        select(MoodboardItem).where(
            MoodboardItem.id == item_id,
            MoodboardItem.user_id == user.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Élément introuvable.")

    if data.caption is not None:
        item.caption = data.caption
    if data.category is not None:
        item.category = data.category
    if data.position_x is not None:
        item.position_x = data.position_x
    if data.position_y is not None:
        item.position_y = data.position_y
    if data.sort_order is not None:
        item.sort_order = data.sort_order

    await db.flush()
    await db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_moodboard_item(
    item_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove an image from the moodboard."""
    result = await db.execute(
        select(MoodboardItem).where(
            MoodboardItem.id == item_id,
            MoodboardItem.user_id == user.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Élément introuvable.")

    await db.delete(item)
    await db.flush()
