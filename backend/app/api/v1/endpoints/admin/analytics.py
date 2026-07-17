"""Admin analytics dashboard endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import ContactMessage, User, Wedding, Testimonial, RdvBooking, ProjectLead
from app.api.v1.deps import get_current_admin

router = APIRouter()


@router.get("/overview")
async def get_analytics_overview(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get dashboard analytics overview (admin only)."""
    # User counts
    result = await db.execute(select(func.count(User.id)))
    total_users = result.scalar() or 0

    result = await db.execute(
        select(func.count(User.id)).where(User.role == "client")
    )
    total_clients = result.scalar() or 0

    # Wedding counts
    result = await db.execute(select(func.count(Wedding.id)))
    total_weddings = result.scalar() or 0

    result = await db.execute(
        select(func.count(Wedding.id)).where(Wedding.status == "signed")
    )
    signed_weddings = result.scalar() or 0

    # Contact messages
    result = await db.execute(select(func.count(ContactMessage.id)))
    total_contacts = result.scalar() or 0

    result = await db.execute(
        select(func.count(ContactMessage.id)).where(ContactMessage.is_read == False)
    )
    unread_contacts = result.scalar() or 0

    # Testimonials
    result = await db.execute(select(func.count(Testimonial.id)))
    total_testimonials = result.scalar() or 0

    # RDV Bookings
    result = await db.execute(select(func.count(RdvBooking.id)))
    total_rdv = result.scalar() or 0

    result = await db.execute(
        select(func.count(RdvBooking.id)).where(RdvBooking.status == "confirmed")
    )
    pending_rdv = result.scalar() or 0

    # Active clients (joined in last 30 days)
    from datetime import datetime, timedelta, timezone
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= thirty_days_ago)
    )
    new_clients = result.scalar() or 0

    # Project Leads
    result = await db.execute(select(func.count(ProjectLead.id)))
    total_project_leads = result.scalar() or 0

    result = await db.execute(
        select(func.count(ProjectLead.id)).where(ProjectLead.status == "new")
    )
    new_project_leads = result.scalar() or 0

    return {
        "total_users": total_users,
        "total_clients": total_clients,
        "new_clients_30d": new_clients,
        "total_weddings": total_weddings,
        "signed_weddings": signed_weddings,
        "conversion_rate": round((signed_weddings / max(total_contacts, 1)) * 100, 1),
        "total_contacts": total_contacts,
        "unread_contacts": unread_contacts,
        "total_testimonials": total_testimonials,
        "total_rdv": total_rdv,
        "pending_rdv": pending_rdv,
        "total_project_leads": total_project_leads,
        "new_project_leads": new_project_leads,
    }
