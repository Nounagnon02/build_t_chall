"""Gallery endpoints — list, filter, and retrieve photos."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models import GalleryPhoto, PhotoTag
from app.schemas import GalleryPhotoResponse, PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse)
async def list_photos(
    style: Optional[str] = Query(None, description="Filter by style/tag"),
    season: Optional[str] = Query(None, description="Filter by season"),
    featured: Optional[bool] = Query(None, description="Only featured photos"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List gallery photos with optional filters and pagination."""
    query = select(GalleryPhoto).options(selectinload(GalleryPhoto.tags))

    if featured:
        query = query.where(GalleryPhoto.is_featured == True)

    if season:
        query = query.where(GalleryPhoto.season.ilike(f"%{season}%"))

    if style:
        query = (
            query.join(GalleryPhoto.tags)
            .where(PhotoTag.slug == style.lower())
        )

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Paginate
    query = query.order_by(GalleryPhoto.sort_order, GalleryPhoto.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    photos = result.unique().scalars().all()

    items = []
    for photo in photos:
        items.append(GalleryPhotoResponse(
            id=photo.id,
            title=photo.title,
            description=photo.description,
            image_url=photo.image_url,
            thumbnail_url=photo.thumbnail_url,
            blur_hash=photo.blur_hash,
            width=photo.width,
            height=photo.height,
            venue=photo.venue,
            season=photo.season,
            rating=photo.rating,
            is_featured=photo.is_featured,
            tags=[t.slug for t in photo.tags] if photo.tags else [],
            created_at=photo.created_at,
        ))

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, (total + page_size - 1) // page_size),
    )


@router.get("/tags", response_model=List[str])
async def list_tags(db: AsyncSession = Depends(get_db)):
    """List all available photo tags."""
    result = await db.execute(select(PhotoTag).order_by(PhotoTag.name))
    tags = result.scalars().all()
    return [t.slug for t in tags]


@router.get("/{photo_id}", response_model=GalleryPhotoResponse)
async def get_photo(photo_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single gallery photo by ID."""
    result = await db.execute(
        select(GalleryPhoto)
        .options(selectinload(GalleryPhoto.tags))
        .where(GalleryPhoto.id == photo_id)
    )
    photo = result.scalar_one_or_none()
    if not photo:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")

    return GalleryPhotoResponse(
        id=photo.id,
        title=photo.title,
        description=photo.description,
        image_url=photo.image_url,
        thumbnail_url=photo.thumbnail_url,
        blur_hash=photo.blur_hash,
        width=photo.width,
        height=photo.height,
        venue=photo.venue,
        season=photo.season,
        rating=photo.rating,
        is_featured=photo.is_featured,
        tags=[t.slug for t in photo.tags] if photo.tags else [],
        created_at=photo.created_at,
    )
