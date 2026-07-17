"""Guest list management endpoints."""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Guest, User
from app.api.v1.deps import get_current_user, get_wedding
from app.schemas import GuestCreate, GuestResponse

router = APIRouter()



@router.get("", response_model=List[GuestResponse])
async def list_guests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List guests for the current user's wedding."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Guest).where(Guest.wedding_id == wedding.id)
        .order_by(Guest.last_name, Guest.first_name)
    )
    return result.scalars().all()


@router.post("", response_model=GuestResponse, status_code=status.HTTP_201_CREATED)
async def add_guest(
    data: GuestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a guest to the wedding."""
    wedding = await get_wedding(current_user, db)
    guest = Guest(wedding_id=wedding.id, **data.model_dump())
    db.add(guest)
    await db.flush()
    await db.refresh(guest)
    return guest


@router.put("/{guest_id}", response_model=GuestResponse)
async def update_guest(
    guest_id: str,
    data: GuestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a guest's details."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Guest).where(
            Guest.id == guest_id,
            Guest.wedding_id == wedding.id,
        )
    )
    guest = result.scalar_one_or_none()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(guest, key, value)
    await db.flush()
    await db.refresh(guest)
    return guest


@router.delete("/{guest_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_guest(
    guest_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a guest from the list."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Guest).where(
            Guest.id == guest_id,
            Guest.wedding_id == wedding.id,
        )
    )
    guest = result.scalar_one_or_none()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    await db.delete(guest)
    await db.flush()
