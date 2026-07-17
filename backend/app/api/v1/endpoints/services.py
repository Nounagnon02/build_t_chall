"""Services endpoints — list and retrieve service offerings."""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Service
from app.schemas import ServiceResponse

router = APIRouter()


@router.get("", response_model=List[ServiceResponse])
async def list_services(db: AsyncSession = Depends(get_db)):
    """List all active services ordered by sort_order."""
    result = await db.execute(
        select(Service)
        .where(Service.is_active == True)
        .order_by(Service.sort_order)
    )
    services = result.scalars().all()
    return services


@router.get("/{slug}", response_model=ServiceResponse)
async def get_service(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a single service by slug."""
    result = await db.execute(select(Service).where(Service.slug == slug))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )
    return service
