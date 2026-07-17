"""Pydantic schemas for request/response validation."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, EmailStr, Field, field_validator

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Generic response wrapper
# ---------------------------------------------------------------------------

class APIResponse(BaseModel, Generic[T]):
    """Standard API response envelope."""
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response."""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Gallery
# ---------------------------------------------------------------------------

class GalleryPhotoResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    blur_hash: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    venue: Optional[str] = None
    season: Optional[str] = None
    rating: Optional[float] = None
    is_featured: bool = False
    tags: List[str] = []
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class GalleryPhotoCreate(BaseModel):
    """Schema for creating a gallery photo (admin only)."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: str = Field(max_length=500)
    thumbnail_url: Optional[str] = Field(default=None, max_length=500)
    venue: Optional[str] = Field(default=None, max_length=200)
    season: Optional[str] = Field(default=None, max_length=50)
    is_featured: bool = False
# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

class ServiceCreate(BaseModel):
    """Schema for creating a service (admin only)."""
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200)
    subtitle: Optional[str] = Field(default=None, max_length=300)
    description: str
    icon_name: Optional[str] = Field(default=None, max_length=50)
    image_url: Optional[str] = Field(default=None, max_length=500)
    price_from: Optional[Decimal] = None
    is_custom: bool = False
    inclusions: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class ServiceResponse(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: Optional[str] = None
    description: str
    icon_name: Optional[str] = None
    image_url: Optional[str] = None
    price_from: Optional[Decimal] = None
    is_custom: bool = False
    inclusions: Optional[str] = None
    sort_order: int = 0

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------

class TestimonialCreate(BaseModel):
    """Schema for creating a testimonial (admin only)."""
    couple_names: str = Field(min_length=1, max_length=200)
    wedding_date: Optional[date] = None
    venue: Optional[str] = Field(default=None, max_length=200)
    style: Optional[str] = Field(default=None, max_length=50)
    rating: float = Field(default=5.0, ge=0, le=5)
    content: str
    photo_url: Optional[str] = Field(default=None, max_length=500)
    video_url: Optional[str] = Field(default=None, max_length=500)
    is_verified: bool = False
    is_featured: bool = False


class TestimonialResponse(BaseModel):
    id: str
    couple_names: str
    wedding_date: Optional[date] = None
    venue: Optional[str] = None
    style: Optional[str] = None
    rating: float
    content: str
    photo_url: Optional[str] = None
    video_url: Optional[str] = None
    is_verified: bool = False
    is_featured: bool = False

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Contact
# ---------------------------------------------------------------------------

class ContactCreate(BaseModel):
    first_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    event_type: Optional[str] = None
    guest_count: Optional[int] = Field(default=None, ge=10, le=10000)
    event_date: Optional[date] = None
    budget_range: Optional[str] = None
    service_type: Optional[str] = None
    message: Optional[str] = Field(default=None, max_length=5000)
    source: Optional[str] = None

    @field_validator("guest_count")
    @classmethod
    def validate_guest_count(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 10:
            raise ValueError("Guest count must be at least 10")
        return v


# ---------------------------------------------------------------------------
# Blog
# ---------------------------------------------------------------------------

class BlogPostCreate(BaseModel):
    """Schema for creating a blog post (admin only)."""
    title: str = Field(min_length=1, max_length=300)
    slug: str = Field(min_length=1, max_length=300)
    excerpt: Optional[str] = None
    content: str
    cover_image_url: Optional[str] = Field(default=None, max_length=500)
    category: Optional[str] = Field(default=None, max_length=100)
    reading_time_minutes: Optional[int] = None
    is_published: bool = False
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_description: Optional[str] = Field(default=None, max_length=300)


class BlogPostUpdate(BaseModel):
    """Schema for updating a blog post — all fields optional (admin only)."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=300)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=300)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image_url: Optional[str] = Field(default=None, max_length=500)
    category: Optional[str] = Field(default=None, max_length=100)
    reading_time_minutes: Optional[int] = None
    is_published: Optional[bool] = None
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_description: Optional[str] = Field(default=None, max_length=300)


class BlogPostResponse(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    reading_time_minutes: Optional[int] = None
    is_published: bool = False
    published_at: Optional[datetime] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Budget
# ---------------------------------------------------------------------------

class BudgetBreakdownItem(BaseModel):
    category: str
    label: str
    amount: Decimal
    percentage: float


class BudgetEstimateResponse(BaseModel):
    total_estimated: Decimal
    breakdown: List[BudgetBreakdownItem]
    guest_count: int
    service_type: str
    region: str


# ---------------------------------------------------------------------------
# RDV
# ---------------------------------------------------------------------------

class RdvSlotResponse(BaseModel):
    id: str
    start_time: datetime
    end_time: datetime
    slot_type: str
    is_available: bool

    model_config = {"from_attributes": True}


class RdvBookingCreate(BaseModel):
    slot_id: str
    first_name: str = Field(min_length=2)
    last_name: str = Field(min_length=2)
    email: EmailStr
    phone: Optional[str] = None
    notes: Optional[str] = None


class RdvBookingResponse(BaseModel):
    id: str
    slot_id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: str
    meeting_link: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Checklist
# ---------------------------------------------------------------------------

class ChecklistItemCreate(BaseModel):
    title: str = Field(min_length=2, max_length=300)
    description: Optional[str] = None
    category: str = "other"
    due_date: Optional[date] = None
    assigned_to: Optional[str] = None


class ChecklistItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[date] = None
    is_completed: Optional[bool] = None
    assigned_to: Optional[str] = None


class ChecklistItemResponse(BaseModel):
    id: str
    wedding_id: str
    title: str
    description: Optional[str] = None
    category: str
    due_date: Optional[date] = None
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    sort_order: int = 0
    assigned_to: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------

class DocumentResponse(BaseModel):
    id: str
    wedding_id: str
    title: str
    file_url: str
    file_type: str
    file_size: Optional[int] = None
    category: str
    is_shared: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Guests
# ---------------------------------------------------------------------------

class GuestCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: Optional[str] = None
    phone: Optional[str] = None
    group_name: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    plus_one: bool = False
    plus_one_name: Optional[str] = None


class GuestResponse(BaseModel):
    id: str
    wedding_id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    group_name: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    is_attending: Optional[bool] = None
    plus_one: bool = False
    plus_one_name: Optional[str] = None
    table_number: Optional[int] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Messages
# ---------------------------------------------------------------------------

class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=10000)
    wedding_id: str


class MessageResponse(BaseModel):
    id: str
    wedding_id: str
    user_id: str
    content: str
    is_from_admin: bool = False
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# FAQ
# ---------------------------------------------------------------------------

class FAQResponse(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    sort_order: int = 0

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Partner
# ---------------------------------------------------------------------------

class PartnerResponse(BaseModel):
    id: str
    name: str
    logo_url: str
    website_url: Optional[str] = None
    specialty: Optional[str] = None
    tier: str

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Newsletter
# ---------------------------------------------------------------------------

class NewsletterSubscribe(BaseModel):
    email: EmailStr


# ---------------------------------------------------------------------------
# Tools / Outils
# ---------------------------------------------------------------------------

class ToolResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    icon_name: Optional[str] = None
    category: str = "other"
    url: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0

    model_config = {"from_attributes": True}


class ToolCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    icon_name: Optional[str] = Field(default=None, max_length=50)
    category: str = "other"
    url: Optional[str] = Field(default=None, max_length=500)
    is_featured: bool = False
    sort_order: int = 0


class ToolUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    icon_name: Optional[str] = Field(default=None, max_length=50)
    category: Optional[str] = None
    url: Optional[str] = Field(default=None, max_length=500)
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


# ---------------------------------------------------------------------------
# Staff / Team
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Moodboard
# ---------------------------------------------------------------------------

class MoodboardItemCreate(BaseModel):
    image_url: str = Field(max_length=500)
    caption: Optional[str] = Field(default=None, max_length=200)
    category: Optional[str] = Field(default=None, max_length=50)
    position_x: float = 0
    position_y: float = 0
    width: int = 200
    height: int = 200
    sort_order: int = 0


class MoodboardItemUpdate(BaseModel):
    caption: Optional[str] = Field(default=None, max_length=200)
    category: Optional[str] = Field(default=None, max_length=50)
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    sort_order: Optional[int] = None


class MoodboardItemResponse(BaseModel):
    id: str
    image_url: str
    caption: Optional[str] = None
    category: Optional[str] = None
    position_x: float = 0
    position_y: float = 0
    width: int = 200
    height: int = 200
    sort_order: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Chatbot
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Wedding / Dashboard
# ---------------------------------------------------------------------------

class WeddingUpdate(BaseModel):
    partner_first_name: Optional[str] = None
    partner_last_name: Optional[str] = None
    wedding_date: Optional[date] = None
    venue: Optional[str] = None
    guest_count: Optional[int] = None
    total_budget: Optional[Decimal] = None
    style: Optional[str] = None
    notes: Optional[str] = None


class DashboardResponse(BaseModel):
    wedding: Optional[Any] = None
    progress_pct: int = 0
    upcoming_tasks: int = 0
    completed_tasks: int = 0
    unread_messages: int = 0
    next_payment: Optional[Any] = None
    days_until_wedding: Optional[int] = None
    recent_messages: List[Any] = []


# ---------------------------------------------------------------------------
# Project Leads (public booking flow)
# ---------------------------------------------------------------------------

class ProjectLeadCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=20)
    notes: Optional[str] = None
    quiz_style: Optional[str] = None
    quiz_answers: Optional[dict] = None
    moodboard_images: Optional[list] = None
    configurateur_config: Optional[dict] = None
    budget_data: Optional[dict] = None


class ProjectLeadResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    notes: Optional[str] = None
    quiz_style: Optional[str] = None
    quiz_answers: Optional[dict] = None
    moodboard_images: Optional[list] = None
    configurateur_config: Optional[dict] = None
    budget_data: Optional[dict] = None
    status: str
    contacted_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Error
# ---------------------------------------------------------------------------

