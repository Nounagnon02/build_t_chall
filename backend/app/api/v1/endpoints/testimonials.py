"""Testimonials endpoints — list and filter client reviews."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.database import get_db
from app.models import Testimonial
from app.schemas import TestimonialResponse

router = APIRouter()


@router.get("", response_model=List[TestimonialResponse])
async def list_testimonials(
    featured: Optional[bool] = Query(None),
    style: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None, ge=1, le=5),
    db: AsyncSession = Depends(get_db),
):
    """List testimonials with optional filtering."""
    query = select(Testimonial).where(Testimonial.is_active == True)

    if featured:
        query = query.where(Testimonial.is_featured == True)
    if style:
        query = query.where(Testimonial.style.ilike(f"%{style}%"))
    if min_rating:
        query = query.where(Testimonial.rating >= min_rating)

    query = query.order_by(Testimonial.sort_order, Testimonial.created_at.desc())
    result = await db.execute(query)
    testimonials = result.scalars().all()
    return testimonials
