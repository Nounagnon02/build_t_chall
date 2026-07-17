"""Client dashboard endpoint — provides an overview of the wedding project."""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models import ChecklistItem, Message, Payment, User, Wedding
from app.api.v1.deps import get_current_user
from app.schemas import DashboardResponse

router = APIRouter()


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the authenticated client's wedding dashboard data."""
    result = await db.execute(
        select(Wedding)
        .options(
            selectinload(Wedding.checklist_items),
            selectinload(Wedding.messages),
            selectinload(Wedding.payments),
        )
        .where(Wedding.user_id == current_user.id)
    )
    wedding = result.scalar_one_or_none()

    if not wedding:
        return DashboardResponse(
            progress_pct=0,
            upcoming_tasks=0,
            completed_tasks=0,
            unread_messages=0,
        )

    # Calculate stats
    total_tasks = len(wedding.checklist_items)
    completed_tasks = sum(1 for t in wedding.checklist_items if t.is_completed)
    upcoming_tasks = total_tasks - completed_tasks

    unread_messages = sum(
        1 for m in wedding.messages if not m.is_read and m.is_from_admin
    )

    next_payment = None
    for p in wedding.payments:
        if not p.is_paid and p.due_date:
            if next_payment is None or (p.due_date and (next_payment.get("due_date") is None or p.due_date < next_payment["due_date"])):
                next_payment = {
                    "id": p.id,
                    "label": p.label,
                    "amount": str(p.amount),
                    "due_date": p.due_date.isoformat() if p.due_date else None,
                    "category": p.category,
                }

    days_until_wedding = None
    if wedding.wedding_date:
        days_until_wedding = (wedding.wedding_date - date.today()).days

    recent_messages = []
    for m in sorted(wedding.messages, key=lambda x: x.created_at or "", reverse=True)[:5]:
        recent_messages.append({
            "id": m.id,
            "content": m.content[:150],
            "is_from_admin": m.is_from_admin,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        })

    return DashboardResponse(
        wedding={
            "id": wedding.id,
            "partner_first_name": wedding.partner_first_name,
            "partner_last_name": wedding.partner_last_name,
            "wedding_date": wedding.wedding_date.isoformat() if wedding.wedding_date else None,
            "venue": wedding.venue,
            "guest_count": wedding.guest_count,
            "total_budget": str(wedding.total_budget) if wedding.total_budget else None,
            "spent_budget": str(wedding.spent_budget),
            "style": wedding.style,
            "status": wedding.status,
        },
        progress_pct=wedding.progress_pct,
        upcoming_tasks=upcoming_tasks,
        completed_tasks=completed_tasks,
        unread_messages=unread_messages,
        next_payment=next_payment,
        days_until_wedding=days_until_wedding,
        recent_messages=recent_messages,
    )
