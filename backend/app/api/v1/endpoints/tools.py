"""Public API endpoints for Tools / Outils."""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Tool
from app.schemas import ToolResponse

router = APIRouter()


@router.get("", response_model=List[ToolResponse])
async def list_tools(
    category: str | None = None,
    featured: bool | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List all active tools, optionally filtered by category or featured flag."""
    stmt = select(Tool).where(Tool.is_active == True).order_by(Tool.sort_order, Tool.name)
    if category:
        stmt = stmt.where(Tool.category == category)
    if featured is not None:
        stmt = stmt.where(Tool.is_featured == featured)
    result = await db.execute(stmt)
    return result.scalars().all()
