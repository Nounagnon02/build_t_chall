"""Contact form endpoints — submit messages and handle inquiries."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import ContactMessage
from app.schemas import ContactCreate, APIResponse
from app.services.email import send_contact_confirmation

router = APIRouter()


@router.post("", response_model=APIResponse)
async def submit_contact(
    data: ContactCreate,
    db: AsyncSession = Depends(get_db),
):
    """Submit a contact form message."""
    # Basic honeypot check (anti-spam)
    if data.message and "http://" in data.message and "everafterevents" not in data.message:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Spam detected")

    contact = ContactMessage(
        first_name=data.first_name,
        email=data.email,
        phone=data.phone,
        event_type=data.event_type,
        guest_count=data.guest_count,
        event_date=data.event_date,
        budget_range=data.budget_range,
        service_type=data.service_type,
        message=data.message,
        source=data.source,
    )
    db.add(contact)
    await db.flush()

    # Send confirmation email (fire-and-forget)
    await send_contact_confirmation(data.first_name, data.email)

    return APIResponse(
        success=True,
        message="Votre message a bien été envoyé. Nous vous répondrons sous 24h ✨",
    )
