"""SQLAlchemy ORM models — all entities for the Ever After Events platform."""

from __future__ import annotations

import uuid
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def uuid_pk() -> str:
    """Generate a UUID string for primary keys."""
    return str(uuid.uuid4())


def utcnow() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    role: Mapped[str] = mapped_column(
        Enum("client", "admin", name="user_role"), default="client", nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    wedding: Mapped[Optional["Wedding"]] = relationship(
        "Wedding", back_populates="user", uselist=False
    )
    rdv_bookings: Mapped[List["RdvBooking"]] = relationship(
        "RdvBooking", back_populates="user"
    )
    messages: Mapped[List["Message"]] = relationship(
        "Message", back_populates="user", foreign_keys="[Message.user_id]"
    )
    moodboard_items: Mapped[List["MoodboardItem"]] = relationship(
        "MoodboardItem", back_populates="user"
    )

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"


# ---------------------------------------------------------------------------
# Wedding (client project)
# ---------------------------------------------------------------------------

class Wedding(Base):
    __tablename__ = "weddings"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, unique=True
    )
    partner_first_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    partner_last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    wedding_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    venue: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    guest_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_budget: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    spent_budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    style: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "prospect", "signed", "in_progress", "completed", "cancelled",
            name="wedding_status",
        ),
        default="prospect",
        nullable=False,
    )
    progress_pct: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="wedding")
    checklist_items: Mapped[List["ChecklistItem"]] = relationship(
        "ChecklistItem", back_populates="wedding", cascade="all, delete-orphan"
    )
    documents: Mapped[List["Document"]] = relationship(
        "Document", back_populates="wedding", cascade="all, delete-orphan"
    )
    guests: Mapped[List["Guest"]] = relationship(
        "Guest", back_populates="wedding", cascade="all, delete-orphan"
    )
    messages: Mapped[List["Message"]] = relationship(
        "Message", back_populates="wedding", cascade="all, delete-orphan"
    )
    payments: Mapped[List["Payment"]] = relationship(
        "Payment", back_populates="wedding", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Wedding {self.user_id} — {self.status}>"


# ---------------------------------------------------------------------------
# Gallery
# ---------------------------------------------------------------------------

class GalleryPhoto(Base):
    __tablename__ = "gallery_photos"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    blur_hash: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    width: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    height: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    venue: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    season: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    tags: Mapped[List["PhotoTag"]] = relationship(
        "PhotoTag", secondary="photo_tag_links", back_populates="photos"
    )

    def __repr__(self) -> str:
        return f"<GalleryPhoto {self.title}>"


class PhotoTag(Base):
    __tablename__ = "photo_tags"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Relationships
    photos: Mapped[List["GalleryPhoto"]] = relationship(
        "GalleryPhoto", secondary="photo_tag_links", back_populates="tags"
    )

    def __repr__(self) -> str:
        return f"<PhotoTag {self.name}>"


class PhotoTagLink(Base):
    __tablename__ = "photo_tag_links"

    photo_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("gallery_photos.id", ondelete="CASCADE"), primary_key=True
    )
    tag_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("photo_tags.id", ondelete="CASCADE"), primary_key=True
    )


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

class Service(Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    subtitle: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price_from: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False)
    inclusions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Service {self.title}>"


# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------

class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    couple_names: Mapped[str] = mapped_column(String(200), nullable=False)
    wedding_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    venue: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    style: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Testimonial {self.couple_names} — {self.rating}>"


# ---------------------------------------------------------------------------
# Blog
# ---------------------------------------------------------------------------

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    author_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, nullable=False)
    excerpt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    reading_time_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    meta_title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<BlogPost {self.title}>"


# ---------------------------------------------------------------------------
# RDV (Appointments)
# ---------------------------------------------------------------------------

class RdvSlot(Base):
    __tablename__ = "rdv_slots"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    slot_type: Mapped[str] = mapped_column(
        Enum("discovery", "quote", "followup", name="rdv_slot_type"),
        default="discovery",
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    booking: Mapped[Optional["RdvBooking"]] = relationship(
        "RdvBooking", back_populates="slot", uselist=False
    )

    def __repr__(self) -> str:
        return f"<RdvSlot {self.start_time.isoformat()} — {'available' if self.is_available else 'booked'}>"


class RdvBooking(Base):
    __tablename__ = "rdv_bookings"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    slot_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("rdv_slots.id"), nullable=False, unique=True
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("confirmed", "cancelled", "completed", name="rdv_booking_status"),
        default="confirmed",
        nullable=False,
    )
    confirmation_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    meeting_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    slot: Mapped["RdvSlot"] = relationship("RdvSlot", back_populates="booking")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="rdv_bookings")

    def __repr__(self) -> str:
        return f"<RdvBooking {self.first_name} {self.last_name} — {self.status}>"


# ---------------------------------------------------------------------------
# Checklist
# ---------------------------------------------------------------------------

class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    wedding_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("weddings.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(
        Enum(
            "venue", "catering", "photography", "decoration",
            "music", "dress", "guests", "administration", "other",
            name="checklist_category",
        ),
        default="other",
        nullable=False,
    )
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    assigned_to: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    wedding: Mapped["Wedding"] = relationship("Wedding", back_populates="checklist_items")

    def __repr__(self) -> str:
        return f"<ChecklistItem {self.title} — {'done' if self.is_completed else 'pending'}>"


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------

class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    wedding_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("weddings.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)  # pdf, docx, xlsx, etc.
    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # bytes
    category: Mapped[str] = mapped_column(
        Enum("contract", "quote", "invoice", "other", name="document_category"),
        default="other",
        nullable=False,
    )
    is_shared: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    wedding: Mapped["Wedding"] = relationship("Wedding", back_populates="documents")

    def __repr__(self) -> str:
        return f"<Document {self.title}>"


# ---------------------------------------------------------------------------
# Guests
# ---------------------------------------------------------------------------

class Guest(Base):
    __tablename__ = "guests"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    wedding_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("weddings.id", ondelete="CASCADE"), nullable=False
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    group_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # family, friends, work...
    dietary_restrictions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_attending: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)  # RSVP
    plus_one: Mapped[bool] = mapped_column(Boolean, default=False)
    plus_one_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    table_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    wedding: Mapped["Wedding"] = relationship("Wedding", back_populates="guests")

    def __repr__(self) -> str:
        return f"<Guest {self.first_name} {self.last_name}>"


# ---------------------------------------------------------------------------
# Messages (client ↔ agency)
# ---------------------------------------------------------------------------

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    wedding_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("weddings.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_from_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    wedding: Mapped["Wedding"] = relationship("Wedding", back_populates="messages")
    user: Mapped["User"] = relationship("User", back_populates="messages")

    def __repr__(self) -> str:
        return f"<Message by {'admin' if self.is_from_admin else 'client'} — {'read' if self.is_read else 'unread'}>"


# ---------------------------------------------------------------------------
# Payments
# ---------------------------------------------------------------------------

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    wedding_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("weddings.id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(
        Enum(
            "deposit", "installment", "final", "other",
            name="payment_category",
        ),
        default="installment",
        nullable=False,
    )
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    paid_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    wedding: Mapped["Wedding"] = relationship("Wedding", back_populates="payments")

    def __repr__(self) -> str:
        return f"<Payment {self.label} — {self.amount}€ {'paid' if self.is_paid else 'pending'}>"


# ---------------------------------------------------------------------------
# Moodboard Items
# ---------------------------------------------------------------------------

class MoodboardItem(Base):
    __tablename__ = "moodboard_items"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    position_x: Mapped[float] = mapped_column(Float, default=0)
    position_y: Mapped[float] = mapped_column(Float, default=0)
    width: Mapped[int] = mapped_column(Integer, default=200)
    height: Mapped[int] = mapped_column(Integer, default=200)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="moodboard_items")

    def __repr__(self) -> str:
        return f"<MoodboardItem {self.caption or 'untitled'}>"


# ---------------------------------------------------------------------------
# Contact Messages (public form submissions)
# ---------------------------------------------------------------------------

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    event_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    guest_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    event_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    budget_range: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    service_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # how they found us
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<ContactMessage from {self.first_name} ({self.email})>"


# ---------------------------------------------------------------------------
# FAQ
# ---------------------------------------------------------------------------

class FAQ(Base):
    __tablename__ = "faqs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    question: Mapped[str] = mapped_column(String(500), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(
        Enum(
            "pricing", "organization", "vendors", "meetings", "client_space", "general",
            name="faq_category",
        ),
        default="general",
        nullable=False,
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<FAQ {self.question[:50]}...>"


# ---------------------------------------------------------------------------
# Partner
# ---------------------------------------------------------------------------

class Partner(Base):
    __tablename__ = "partners"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    logo_url: Mapped[str] = mapped_column(String(500), nullable=False)
    website_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    specialty: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    tier: Mapped[str] = mapped_column(
        Enum("gold", "silver", "partner", name="partner_tier"),
        default="partner",
        nullable=False,
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Partner {self.name} ({self.tier})>"


# ---------------------------------------------------------------------------
# Tools / Outils (manageable resources)
# ---------------------------------------------------------------------------

class Tool(Base):
    __tablename__ = "tools"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    category: Mapped[str] = mapped_column(
        Enum("budget", "planning", "checklist", "design", "vendor", "other", name="tool_category"),
        default="other",
        nullable=False,
    )
    url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Tool {self.name}>"


# ---------------------------------------------------------------------------
# Newsletter subscription
# ---------------------------------------------------------------------------

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<NewsletterSubscriber {self.email}>"


# ---------------------------------------------------------------------------
# Project Leads (public booking flow submissions)
# ---------------------------------------------------------------------------

class ProjectLead(Base):
    """A complete project submission from the public booking flow (no auth required)."""
    __tablename__ = "project_leads"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=uuid_pk
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Quiz
    quiz_style: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    quiz_answers: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Moodboard
    moodboard_images: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)

    # Configurateur
    configurateur_config: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Budget
    budget_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Status
    status: Mapped[str] = mapped_column(
        String(20), default="new", nullable=False
    )
    contacted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<ProjectLead {self.first_name} {self.last_name} — {self.status}>"
