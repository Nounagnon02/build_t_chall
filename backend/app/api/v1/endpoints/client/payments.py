"""Payment tracking endpoints — view payment schedule and history."""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Payment, User
from app.api.v1.deps import get_current_user, get_wedding
from pydantic import BaseModel

router = APIRouter()


class PaymentResponse(BaseModel):
    id: str
    label: str
    amount: str
    category: str
    due_date: str | None = None
    paid_date: str | None = None
    is_paid: bool
    notes: str | None = None

    model_config = {"from_attributes": True}


@router.get("", response_model=List[PaymentResponse])
async def list_payments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List payments for the current user's wedding."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Payment).where(Payment.wedding_id == wedding.id)
        .order_by(Payment.due_date)
    )
    payments = result.scalars().all()
    return [
        PaymentResponse(
            id=p.id,
            label=p.label,
            amount=str(p.amount),
            category=p.category,
            due_date=p.due_date.isoformat() if p.due_date else None,
            paid_date=p.paid_date.isoformat() if p.paid_date else None,
            is_paid=p.is_paid,
            notes=p.notes,
        )
        for p in payments
    ]
