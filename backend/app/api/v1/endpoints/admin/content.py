"""Admin content management endpoints — manage gallery, services, blog, tools, etc."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import (
    BlogPost, FAQ, GalleryPhoto, Partner, PhotoTag,
    PhotoTagLink, Service, Testimonial, Tool, User, RdvBooking, RdvSlot,
    ProjectLead,
)
from app.api.v1.deps import get_current_admin
from app.schemas import (
    BlogPostCreate, BlogPostResponse, BlogPostUpdate,
    FAQResponse, GalleryPhotoCreate, GalleryPhotoResponse,
    PartnerResponse, ServiceCreate, ServiceResponse,
    TestimonialCreate, TestimonialResponse,
    ToolCreate, ToolResponse, ToolUpdate,
    RdvBookingResponse,
    ProjectLeadResponse,
)

router = APIRouter()


# --- Gallery management ---

@router.post("/gallery", response_model=GalleryPhotoResponse, status_code=status.HTTP_201_CREATED)
async def create_gallery_photo(
    data: GalleryPhotoCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Add a new gallery photo (admin only)."""
    photo = GalleryPhoto(**data.model_dump())
    db.add(photo)
    await db.flush()
    await db.refresh(photo)
    return photo


@router.delete("/gallery/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_photo(
    photo_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a gallery photo (admin only)."""
    result = await db.execute(
        select(GalleryPhoto).where(GalleryPhoto.id == photo_id)
    )
    photo = result.scalar_one_or_none()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    await db.delete(photo)
    await db.flush()


# --- Blog management ---

@router.post("/blog", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    data: BlogPostCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a blog post (admin only)."""
    from datetime import datetime, timezone
    post = BlogPost(
        author_id=admin.id,
        **data.model_dump(),
        published_at=datetime.now(timezone.utc) if data.is_published else None,
    )
    db.add(post)
    await db.flush()
    await db.refresh(post)
    return post


@router.put("/blog/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    data: BlogPostUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update a blog post (admin only)."""
    result = await db.execute(
        select(BlogPost).where(BlogPost.id == post_id)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(post, key, value)
    await db.flush()
    await db.refresh(post)
    return post


# --- Service management ---

@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    data: ServiceCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a service offering (admin only)."""
    service = Service(**data.model_dump())
    db.add(service)
    await db.flush()
    await db.refresh(service)
    return service


# --- Testimonial management ---

@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    data: TestimonialCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Add a testimonial (admin only)."""
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    await db.flush()
    await db.refresh(testimonial)
    return testimonial


# --- Tool / Outils management ---

@router.post("/tools", response_model=ToolResponse, status_code=status.HTTP_201_CREATED)
async def create_tool(
    data: ToolCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new tool (admin only)."""
    tool = Tool(**data.model_dump())
    db.add(tool)
    await db.flush()
    await db.refresh(tool)
    return tool


@router.put("/tools/{tool_id}", response_model=ToolResponse)
async def update_tool(
    tool_id: str,
    data: ToolUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update a tool (admin only)."""
    result = await db.execute(
        select(Tool).where(Tool.id == tool_id)
    )
    tool = result.scalar_one_or_none()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tool, key, value)
    await db.flush()
    await db.refresh(tool)
    return tool


@router.delete("/tools/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tool(
    tool_id: str,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a tool (admin only)."""
    result = await db.execute(
        select(Tool).where(Tool.id == tool_id)
    )
    tool = result.scalar_one_or_none()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    await db.delete(tool)
    await db.flush()


# --- RDV / Appointments management ---


@router.get("/rdv", response_model=list[RdvBookingResponse])
async def list_rdv_bookings(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all RDV bookings with slot info (admin only)."""
    result = await db.execute(
        select(RdvBooking).order_by(RdvBooking.created_at.desc())
    )
    bookings = result.scalars().all()

    responses = []
    for b in bookings:
        slot = await db.get(RdvSlot, b.slot_id)
        responses.append(RdvBookingResponse(
            id=b.id,
            slot_id=b.slot_id,
            first_name=b.first_name,
            last_name=b.last_name,
            email=b.email,
            phone=b.phone,
            notes=b.notes,
            status=b.status,
            meeting_link=b.meeting_link,
            start_time=slot.start_time if slot else None,
            end_time=slot.end_time if slot else None,
            created_at=b.created_at,
        ))
    return responses


# --- Project Leads management ---


@router.get("/project-leads", response_model=list[ProjectLeadResponse])
async def list_project_leads(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all project leads (admin only)."""
    result = await db.execute(
        select(ProjectLead).order_by(ProjectLead.created_at.desc())
    )
    return result.scalars().all()


@router.put("/project-leads/{lead_id}/status")
async def update_project_lead_status(
    lead_id: str,
    body: dict,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update a project lead's status (admin only)."""
    result = await db.execute(
        select(ProjectLead).where(ProjectLead.id == lead_id)
    )
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    new_status = body.get("status")
    if new_status not in ("new", "contacted", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")

    from datetime import datetime, timezone
    lead.status = new_status
    if new_status == "contacted":
        lead.contacted_at = datetime.now(timezone.utc)

    await db.flush()
    return {"success": True, "status": lead.status}
