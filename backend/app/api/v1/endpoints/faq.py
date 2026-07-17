"""FAQ endpoints — list and search questions."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import FAQ
from app.schemas import FAQResponse

router = APIRouter()


@router.get("", response_model=List[FAQResponse])
async def list_faqs(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None, min_length=2),
    db: AsyncSession = Depends(get_db),
):
    """List FAQs with optional category filter and search."""
    query = select(FAQ).where(FAQ.is_published == True)

    if category:
        query = query.where(FAQ.category == category)

    if search:
        like_pattern = f"%{search}%"
        query = query.where(
            FAQ.question.ilike(like_pattern) | FAQ.answer.ilike(like_pattern)
        )

    query = query.order_by(FAQ.sort_order, FAQ.question)
    result = await db.execute(query)
    faqs = result.scalars().all()
    return faqs


@router.get("/categories", response_model=List[str])
async def list_faq_categories(db: AsyncSession = Depends(get_db)):
    """List distinct FAQ categories."""
    from sqlalchemy import distinct
    result = await db.execute(
        select(distinct(FAQ.category)).where(FAQ.is_published == True)
    )
    categories = result.scalars().all()
    return [c for c in categories if c]
