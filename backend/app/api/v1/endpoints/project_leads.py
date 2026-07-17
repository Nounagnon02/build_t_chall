"""Project Lead endpoints — public submission from the guided booking flow."""

from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import ProjectLead
from app.schemas import ProjectLeadCreate, ProjectLeadResponse, APIResponse

router = APIRouter()


@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_project_lead(
    data: ProjectLeadCreate,
    db: AsyncSession = Depends(get_db),
):
    """Submit a complete project lead from the guided flow (public, no auth)."""
    lead = ProjectLead(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone=data.phone,
        notes=data.notes,
        quiz_style=data.quiz_style,
        quiz_answers=data.quiz_answers,
        moodboard_images=data.moodboard_images,
        configurateur_config=data.configurateur_config,
        budget_data=data.budget_data,
    )
    db.add(lead)
    await db.flush()
    await db.refresh(lead)

    return APIResponse(
        success=True,
        data=ProjectLeadResponse.model_validate(lead).model_dump(mode="json"),
        message="Votre projet a bien été envoyé. Nous vous contacterons sous 24h ✨",
    )
