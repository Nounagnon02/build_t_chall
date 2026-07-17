"""Document management endpoints — upload, list, download."""

from __future__ import annotations

import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.models import Document, User
from app.api.v1.deps import get_current_user, get_wedding
from app.schemas import DocumentResponse

router = APIRouter()



@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents for the current user's wedding."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Document).where(Document.wedding_id == wedding.id)
        .order_by(Document.created_at.desc())
    )
    return result.scalars().all()


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    title: str = Form(...),
    category: str = Form("other"),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a document (contract, quote, etc.)."""
    wedding = await get_wedding(current_user, db)

    # Validate file type
    ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".png", ".jpg", ".jpeg", ".gif"}
    ext = os.path.splitext(file.filename or "document.pdf")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Type de fichier non autorisé : {ext}. Formats acceptés : {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Fichier trop volumineux. Taille maximum : {settings.MAX_UPLOAD_SIZE // (1024*1024)} Mo",
        )

    # Save file locally
    upload_dir = os.path.join(settings.UPLOAD_DIR, wedding.id)
    os.makedirs(upload_dir, exist_ok=True)
    ext = os.path.splitext(file.filename or "document.pdf")[1] or ".pdf"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(upload_dir, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    doc = Document(
        wedding_id=wedding.id,
        title=title,
        file_url=f"/uploads/{wedding.id}/{filename}",
        file_type=ext[1:].lower() if ext else "unknown",
        file_size=len(contents),
        category=category,
    )
    db.add(doc)
    await db.flush()
    await db.refresh(doc)
    return doc


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a document."""
    wedding = await get_wedding(current_user, db)
    result = await db.execute(
        select(Document).where(
            Document.id == doc_id,
            Document.wedding_id == wedding.id,
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # Remove file if local
    if os.path.exists(doc.file_url.lstrip("/")):
        os.remove(doc.file_url.lstrip("/"))
    await db.delete(doc)
    await db.flush()
