"""Appointment booking endpoints — availability and reservations."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models import RdvBooking, RdvSlot
from app.schemas import (
    RdvBookingCreate,
    RdvBookingResponse,
    RdvSlotResponse,
)

router = APIRouter()


@router.get("/disponibilites", response_model=List[RdvSlotResponse])
async def get_available_slots(
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    slot_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Get available appointment slots within a date range."""
    query = select(RdvSlot).where(RdvSlot.is_available == True)

    now = datetime.now(timezone.utc)
    query = query.where(RdvSlot.start_time > now)

    if date_from:
        try:
            d_from = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            query = query.where(RdvSlot.start_time >= d_from)
        except ValueError:
            pass

    if date_to:
        try:
            d_to = datetime.strptime(date_to, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            end_of_day = d_to + timedelta(days=1)
            query = query.where(RdvSlot.start_time <= end_of_day)
        except ValueError:
            pass

    if slot_type:
        query = query.where(RdvSlot.slot_type == slot_type)

    query = query.order_by(RdvSlot.start_time)
    result = await db.execute(query)
    slots = result.scalars().all()
    return slots


@router.post("/reserver", response_model=RdvBookingResponse, status_code=status.HTTP_201_CREATED)
async def book_appointment(
    data: RdvBookingCreate,
    db: AsyncSession = Depends(get_db),
):
    """Reserve an appointment slot."""
    # Verify slot exists and is available (with FOR UPDATE to prevent race conditions)
    result = await db.execute(
        select(RdvSlot).where(RdvSlot.id == data.slot_id).with_for_update()
    )
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ce créneau n'existe pas.",
        )
    if not slot.is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce créneau n'est plus disponible.",
        )

    # Mark slot as unavailable
    slot.is_available = False

    # Create booking
    booking = RdvBooking(
        slot_id=data.slot_id,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone=data.phone,
        notes=data.notes,
    )
    db.add(booking)
    await db.flush()
    await db.refresh(booking)

    return RdvBookingResponse(
        id=booking.id,
        slot_id=booking.slot_id,
        first_name=booking.first_name,
        last_name=booking.last_name,
        email=booking.email,
        phone=booking.phone,
        notes=booking.notes,
        status=booking.status,
        meeting_link=booking.meeting_link,
        start_time=slot.start_time,
        end_time=slot.end_time,
    )
