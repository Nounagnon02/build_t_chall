"""Messaging endpoints — client ↔ agency communication."""

from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Message, User
from app.api.v1.deps import get_current_user, get_current_admin, get_wedding
from app.schemas import MessageCreate, MessageResponse

router = APIRouter()


@router.get("", response_model=List[MessageResponse])
async def list_messages(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get messages for the current user's wedding."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Message).where(Message.wedding_id == wedding.id)
        .order_by(Message.created_at)
    )
    return result.scalars().all()


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send a message from client to agency."""
    wedding = await get_wedding(current_user, db)

    if data.wedding_id != wedding.id:
        raise HTTPException(status_code=403, detail="Access denied")

    message = Message(
        wedding_id=wedding.id,
        user_id=current_user.id,
        content=data.content,
        is_from_admin=False,
    )
    db.add(message)
    await db.flush()
    await db.refresh(message)
    return message


@router.put("/{message_id}/read")
async def mark_as_read(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a message as read."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Message).where(
            Message.id == message_id,
            Message.wedding_id == wedding.id,
        )
    )
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.is_read = True
    from datetime import datetime, timezone
    message.read_at = datetime.now(timezone.utc)
    await db.flush()
    return {"success": True}
