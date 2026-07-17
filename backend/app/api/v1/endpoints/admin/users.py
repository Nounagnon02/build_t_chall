"""Admin user management endpoints."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.api.v1.deps import get_current_admin
from app.schemas import PaginatedResponse, UserResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all users (admin only)."""
    query = select(User)

    if role:
        query = query.where(User.role == role)
    if search:
        like = f"%{search}%"
        query = query.where(
            User.first_name.ilike(like) |
            User.last_name.ilike(like) |
            User.email.ilike(like)
        )

    total_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(total_query)).scalar() or 0

    query = query.order_by(User.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    users = result.scalars().all()

    items = [
        UserResponse(
            id=u.id, email=u.email, first_name=u.first_name,
            last_name=u.last_name, phone=u.phone, role=u.role,
            is_active=u.is_active, is_verified=u.is_verified,
            avatar_url=u.avatar_url, created_at=u.created_at,
        )
        for u in users
    ]

    return PaginatedResponse(
        items=items, total=total, page=page,
        page_size=page_size, total_pages=max(1, (total + page_size - 1) // page_size),
    )


@router.put("/{user_id}/toggle-status")
async def toggle_user_status(
    user_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Activate or deactivate a user (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    await db.flush()
    return {
        "success": True,
        "is_active": user.is_active,
    }
