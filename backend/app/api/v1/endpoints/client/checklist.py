"""Checklist endpoints — manage wedding to-do items."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import ChecklistItem, User
from app.api.v1.deps import get_current_user, get_wedding
from app.schemas import ChecklistItemCreate, ChecklistItemResponse, ChecklistItemUpdate

router = APIRouter()



@router.get("", response_model=List[ChecklistItemResponse])
async def list_checklist(
    category: Optional[str] = Query(None),
    is_completed: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get checklist items for the current user's wedding."""
    wedding = await get_wedding(current_user, db)
    query = select(ChecklistItem).where(ChecklistItem.wedding_id == wedding.id)

    if category:
        query = query.where(ChecklistItem.category == category)
    if is_completed is not None:
        query = query.where(ChecklistItem.is_completed == is_completed)

    query = query.order_by(ChecklistItem.sort_order, ChecklistItem.due_date)
    result = await db.execute(query)
    items = result.scalars().all()
    return items


@router.post("", response_model=ChecklistItemResponse, status_code=status.HTTP_201_CREATED)
async def create_checklist_item(
    data: ChecklistItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a new checklist item."""
    wedding = await get_wedding(current_user, db)
    item = ChecklistItem(
        wedding_id=wedding.id,
        **data.model_dump(),
    )
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ChecklistItemResponse)
async def update_checklist_item(
    item_id: str,
    data: ChecklistItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a checklist item."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(ChecklistItem).where(
            ChecklistItem.id == item_id,
            ChecklistItem.wedding_id == wedding.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    await db.flush()
    await db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checklist_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a checklist item."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(ChecklistItem).where(
            ChecklistItem.id == item_id,
            ChecklistItem.wedding_id == wedding.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    await db.delete(item)
    await db.flush()
