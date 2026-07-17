"""Partner endpoints — list partner/prestataire logos and details."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Partner
from app.schemas import PartnerResponse

router = APIRouter()


@router.get("", response_model=List[PartnerResponse])
async def list_partners(
    tier: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List active partners, optionally filtered by tier."""
    query = select(Partner).where(Partner.is_active == True)
    if tier:
        query = query.where(Partner.tier == tier)
    query = query.order_by(Partner.sort_order, Partner.name)
    result = await db.execute(query)
    partners = result.scalars().all()
    return partners
