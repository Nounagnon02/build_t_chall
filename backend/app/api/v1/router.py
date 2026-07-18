"""Main API v1 router — aggregates all endpoint routers."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    chat,
    contact,
    gallery,
    services,
    testimonials,
    blog,
    budget,
    rdv,
    faq,
    partners,
    newsletter,
    tools,
    moodboard,
    project_leads,
)
from app.api.v1.endpoints.client import (
    dashboard,
    checklist,
    documents,
    guests,
    messages,
    payments,
)
from app.api.v1.endpoints.admin import users, analytics, content

api_router = APIRouter()

# --- Public endpoints ---
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(gallery.router, prefix="/gallery", tags=["Gallery"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(testimonials.router, prefix="/testimonials", tags=["Testimonials"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(budget.router, prefix="/budget", tags=["Budget"])
api_router.include_router(rdv.router, prefix="/rdv", tags=["Appointments"])
api_router.include_router(faq.router, prefix="/faq", tags=["FAQ"])
api_router.include_router(partners.router, prefix="/partners", tags=["Partners"])
api_router.include_router(newsletter.router, prefix="/newsletter", tags=["Newsletter"])
api_router.include_router(tools.router, prefix="/tools", tags=["Tools"])
api_router.include_router(project_leads.router, prefix="/project-leads", tags=["Project Leads"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])

# --- Client (authenticated) ---
api_router.include_router(
    dashboard.router, prefix="/client/dashboard", tags=["Client Dashboard"]
)
api_router.include_router(checklist.router, prefix="/client/checklist", tags=["Client Checklist"])
api_router.include_router(documents.router, prefix="/client/documents", tags=["Client Documents"])
api_router.include_router(guests.router, prefix="/client/guests", tags=["Client Guests"])
api_router.include_router(messages.router, prefix="/client/messages", tags=["Client Messages"])
api_router.include_router(payments.router, prefix="/client/payments", tags=["Client Payments"])
api_router.include_router(moodboard.router, prefix="/client/moodboard", tags=["Client Moodboard"])

# --- Admin ---
api_router.include_router(users.router, prefix="/admin/users", tags=["Admin Users"])
api_router.include_router(analytics.router, prefix="/admin/analytics", tags=["Admin Analytics"])
api_router.include_router(content.router, prefix="/admin/content", tags=["Admin Content"])
