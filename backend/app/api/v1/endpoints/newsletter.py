"""Newsletter subscription endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import NewsletterSubscriber
from app.schemas import APIResponse, NewsletterSubscribe

router = APIRouter()


@router.post("/subscribe", response_model=APIResponse)
async def subscribe_newsletter(
    data: NewsletterSubscribe,
    db: AsyncSession = Depends(get_db),
):
    """Subscribe an email to the newsletter."""
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == data.email)
    )
    existing = result.scalar_one_or_none()
    if existing:
        if not existing.is_active:
            existing.is_active = True
            await db.flush()
        return APIResponse(success=True, message="Vous êtes déjà inscrit à notre newsletter ✨")

    subscriber = NewsletterSubscriber(email=data.email)
    db.add(subscriber)
    await db.flush()

    return APIResponse(
        success=True,
        message="Merci de vous être inscrit à notre newsletter ✨",
    )
