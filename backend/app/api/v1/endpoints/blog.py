"""Blog endpoints — list and retrieve articles."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import BlogPost
from app.schemas import BlogPostResponse, PaginatedResponse

router = APIRouter()


@router.get("/posts", response_model=PaginatedResponse)
async def list_posts(
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """List published blog posts with pagination."""
    query = select(BlogPost).where(BlogPost.is_published == True)

    if category:
        query = query.where(BlogPost.category == category)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    query = query.order_by(BlogPost.published_at.desc().nullslast())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    posts = result.scalars().all()

    items = [
        BlogPostResponse(
            id=p.id,
            title=p.title,
            slug=p.slug,
            excerpt=p.excerpt,
            content=p.content,
            cover_image_url=p.cover_image_url,
            category=p.category,
            reading_time_minutes=p.reading_time_minutes,
            is_published=p.is_published,
            published_at=p.published_at,
            meta_title=p.meta_title,
            meta_description=p.meta_description,
            created_at=p.created_at,
        )
        for p in posts
    ]

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, (total + page_size - 1) // page_size),
    )


@router.get("/posts/{slug}", response_model=BlogPostResponse)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a single blog post by slug."""
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published == True)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )
    return BlogPostResponse(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content=post.content,
        cover_image_url=post.cover_image_url,
        category=post.category,
        reading_time_minutes=post.reading_time_minutes,
        is_published=post.is_published,
        published_at=post.published_at,
        meta_title=post.meta_title,
        meta_description=post.meta_description,
        created_at=post.created_at,
    )


@router.get("/categories", response_model=list)
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List distinct blog categories."""
    from sqlalchemy import distinct
    result = await db.execute(select(distinct(BlogPost.category)).where(
        BlogPost.is_published == True,
        BlogPost.category.isnot(None),
    ))
    categories = result.scalars().all()
    return [c for c in categories if c]
