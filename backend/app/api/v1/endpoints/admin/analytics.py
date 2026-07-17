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

    # Revenue estimate (signed weddings × avg package price)
    avg_package = 6000
    estimated_revenue = signed_weddings * avg_package

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
        "estimated_revenue": estimated_revenue,
    }


@router.get("/charts")
async def get_analytics_charts(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Monthly trends for charts (last 6 months)."""
    from datetime import datetime, timedelta, timezone
    from sqlalchemy import extract

    now = datetime.now(timezone.utc)
    months = []
    for i in range(5, -1, -1):
        d = now.replace(day=1) - timedelta(days=i * 28)
        months.append((d.year, d.month, d.strftime("%b")))

    leads_by_month = []
    weddings_by_month = []
    rdv_by_month = []

    for year, month, label in months:
        r = await db.execute(
            select(func.count(ProjectLead.id)).where(
                extract("year", ProjectLead.created_at) == year,
                extract("month", ProjectLead.created_at) == month,
            )
        )
        leads_by_month.append({"month": label, "leads": r.scalar() or 0})

        r = await db.execute(
            select(func.count(Wedding.id)).where(
                extract("year", Wedding.created_at) == year,
                extract("month", Wedding.created_at) == month,
            )
        )
        weddings_by_month.append({"month": label, "mariages": r.scalar() or 0})

        r = await db.execute(
            select(func.count(RdvBooking.id)).where(
                extract("year", RdvBooking.created_at) == year,
                extract("month", RdvBooking.created_at) == month,
            )
        )
        rdv_by_month.append({"month": label, "rdv": r.scalar() or 0})

    # Merge into single series
    chart_data = [
        {
            "month": leads_by_month[i]["month"],
            "leads": leads_by_month[i]["leads"],
            "mariages": weddings_by_month[i]["mariages"],
            "rdv": rdv_by_month[i]["rdv"],
        }
        for i in range(6)
    ]

    # Wedding status distribution
    statuses = ["prospect", "signed", "in_progress", "completed", "cancelled"]
    status_data = []
    for s in statuses:
        r = await db.execute(
            select(func.count(Wedding.id)).where(Wedding.status == s)
        )
        count = r.scalar() or 0
        if count > 0:
            status_data.append({"name": s.replace("_", " ").title(), "value": count})

    # Recent activity (last 5 leads)
    r = await db.execute(
        select(ProjectLead).order_by(ProjectLead.created_at.desc()).limit(5)
    )
    recent_leads = [
        {
            "id": str(lead.id),
            "name": lead.full_name,
            "email": lead.email,
            "budget": lead.budget_range or "N/A",
            "date": lead.created_at.strftime("%d/%m/%Y"),
            "status": lead.status,
        }
        for lead in r.scalars().all()
    ]

    return {
        "monthly_trends": chart_data,
        "wedding_status": status_data,
        "recent_leads": recent_leads,
    }
