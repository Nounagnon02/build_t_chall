"""
Database seed script for Ever After Events.
Populates the database with Beninese wedding agency data and diverse photos.

Usage:
    python seed.py

Requires the .env file to be present with DATABASE_URL configured.
Uses the async SQLAlchemy session from app.core.database.
"""

from __future__ import annotations

import asyncio
import json
import random
import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models import (
    BlogPost,
    ChecklistItem,
    ContactMessage,
    Document,
    FAQ,
    Guest,
    GalleryPhoto,
    Message,
    MoodboardItem,
    NewsletterSubscriber,
    Partner,
    Payment,
    PhotoTag,
    PhotoTagLink,
    RdvBooking,
    RdvSlot,
    Service,
    Testimonial,
    Tool,
    User,
    Wedding,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def dt(y: int, m: int, d: int, h: int = 0, mi: int = 0) -> datetime:
    """Timezone-aware datetime helper."""
    return datetime(y, m, d, h, mi, 0, tzinfo=timezone.utc)


def date_(y: int, m: int, d: int) -> date:
    """Date helper."""
    return date(y, m, d)


def uid() -> str:
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Services (keep descriptions localized to Benin/West Africa)
# ---------------------------------------------------------------------------

SERVICES: list[dict[str, Any]] = [
    {
        "title": "Coordination Complète",
        "slug": "coordination-complete",
        "subtitle": "On s'occupe de tout, vous profitez de chaque instant",
        "description": (
            "Notre formule la plus complète pour les couples qui souhaitent vivre "
            "leur mariage sereinement. De la recherche des prestataires à la "
            "coordination du jour J, nous gérons l'intégralité de l'organisation. "
            "Inclus : briefing équipe, gestion du budget, cahier des charges, "
            "planning détaillé, accompagnement illimité par téléphone et WhatsApp, "
            "et coordination complète le jour J avec deux chefs de projet."
        ),
        "icon_name": "stars",
        "image_url": "/images/photo-1519741497674-611481863552.jpg",
        "price_from": Decimal("2500000"),  # FCFA
        "inclusions": json.dumps([
            "Recherche et sélection des prestataires",
            "Gestion complète du budget",
            "Cahier des charges personnalisé",
            "Planning détaillé jour par jour",
            "Accompagnement illimité (tél & WhatsApp)",
            "Coordination jour J (2 chefs de projet)",
            "Décoration sur mesure",
        ]),
        "sort_order": 1,
    },
    {
        "title": "Organisation Partielle",
        "slug": "organisation-partielle",
        "subtitle": "Vous planifiez, on vous épaule",
        "description": (
            "Pour les couples qui ont déjà bien avancé mais qui ont besoin d'un "
            "coup de pouce professionnel. Nous prenons en charge les aspects les "
            "plus complexes de l'organisation : coordination des prestataires, "
            "suivi budgétaire, gestion des imprévus. Idéal pour compléter votre "
            "organisation sans perdre la main."
        ),
        "icon_name": "edit_note",
        "image_url": "/images/photo-1511795409834-ef04bbd61622.jpg",
        "price_from": Decimal("1200000"),
        "inclusions": json.dumps([
            "Coordination des prestataires sélectionnés",
            "Suivi budgétaire mensuel",
            "Cahier des charges",
            "Planning modifié",
            "Coordination jour J (1 chef de projet)",
        ]),
        "sort_order": 2,
    },
    {
        "title": "Décoration & Scénographie",
        "slug": "decoration-scenographie",
        "subtitle": "Une ambiance unique qui vous ressemble",
        "description": (
            "Créez une atmosphère inoubliable avec notre service de décoration et "
            "scénographie sur mesure. Notre équipe de designers conçoit et réalise "
            "la décoration de votre mariage de A à Z : conception des moodboards, "
            "sélection des tissus, fleurs tropicales, éclairages et mobiliers. "
            "Chaque élément est pensé pour raconter votre histoire."
        ),
        "icon_name": "palette",
        "image_url": "/images/photo-1464366400600-7168b8af9bc3.jpg",
        "price_from": Decimal("800000"),
        "is_custom": True,
        "inclusions": json.dumps([
            "Consultation et moodboard personnalisé",
            "Design floral tropical et éclairage",
            "Mobilier et accessoires",
            "Coordination avec le lieu de réception",
            "Installation et démontage",
        ]),
        "sort_order": 3,
    },
    {
        "title": "Jour J — Wedding Planning",
        "slug": "jour-j-wedding-planning",
        "subtitle": "Le grand jour, en toute sérénité",
        "description": (
            "Vous avez tout organisé mais vous voulez être sûr que le jour J se "
            "déroule sans accroc ? Notre équipe arrive en amont, coordonne les "
            "prestataires, gère le timing et les imprévus. Vous ne portez rien, "
            "ne vous inquiétez de rien : vous profitez de chaque instant de votre "
            "plus belle journée."
        ),
        "icon_name": "celebration",
        "image_url": "/images/photo-1410103594768-5fe9d6e7653f.jpg",
        "price_from": Decimal("750000"),
        "inclusions": json.dumps([
            "Répétition générale la veille",
            "Coordination le jour J (1 chef de projet + 1 assistant)",
            "Gestion des imprévus",
            "Point avec chaque prestataire",
            "Nettoyage et remise en état",
        ]),
        "sort_order": 4,
    },
    {
        "title": "Conciergerie Mariage",
        "slug": "conciergerie-mariage",
        "subtitle": "Des services exclusifs pour un mariage d'exception",
        "description": (
            "Notre service de conciergerie vous ouvre les portes des plus beaux "
            "prestataires et lieux d'exception du Bénin et de la sous-région. "
            "Accès à notre carnet d'adresses exclusif, réservations VIP, "
            "hébergement pour les invités, transport, et bien plus encore. "
            "Un service sur mesure pour les couples qui veulent le meilleur."
        ),
        "icon_name": "concierge",
        "image_url": "/images/photo-1510076857177-7470076d4098.jpg",
        "price_from": Decimal("1500000"),
        "is_custom": True,
        "inclusions": json.dumps([
            "Carnet d'adresses exclusif",
            "Réservations VIP",
            "Hébergement groupe",
            "Transport invités",
            "Activités et animations",
            "Cadeaux invités personnalisés",
        ]),
        "sort_order": 5,
    },
    {
        "title": "Destination & Évasion",
        "slug": "destination-evasion",
        "subtitle": "L'aventure intime sur les côtes béninoises",
        "description": (
            "Vous rêvez d'un mariage intimiste sur une plage de Grand-Popo, "
            "au bord du lac Nokoué ou dans la cité lacustre de Ganvié ? "
            "Nous organisons votre destination wedding de A à Z. Formules "
            "clé en main ou sur-mesure avec découverte du Bénin."
        ),
        "icon_name": "flight",
        "image_url": "/images/photo-1507525428034-b723cf961d3e.jpg",
        "price_from": Decimal("3000000"),
        "is_custom": True,
        "inclusions": json.dumps([
            "Recherche et réservation du lieu",
            "Coordination sur place",
            "Photographie et vidéo",
            "Habillage et accessoires",
            "Célébration symbolique ou civile",
            "Hébergement et transport",
        ]),
        "sort_order": 6,
    },
    {
        "title": "Animation Musicale & Traditions",
        "slug": "animation-musicale-traditions",
        "subtitle": "La bande-son de votre plus beau jour",
        "description": (
            "De la cérémonie à la soirée dansante, nous sélectionnons les meilleurs "
            "artistes, DJs et groupes traditionnels pour chaque moment de votre "
            "mariage. Quatuor, jazz band, orchestre afrobeat, DJ set ou tambours "
            "traditionnels : créez l'ambiance parfaite du cocktail au gâteau."
        ),
        "icon_name": "music_note",
        "image_url": "/images/photo-1465847899084-d164df4dedc2.jpg",
        "price_from": Decimal("600000"),
        "inclusions": json.dumps([
            "Conseil et sélection musicale",
            "Sonorisation et éclairage",
            "Coordination des musiciens",
            "Playlist personnalisée",
            "Répétition avec les artistes",
        ]),
        "sort_order": 7,
    },
    {
        "title": "Design Graphique & Papeterie",
        "slug": "design-graphique-papeterie",
        "subtitle": "Des invitations qui annoncent la couleur",
        "description": (
            "Faites de votre papeterie un reflet de votre univers. Nous concevons "
            "l'intégralité de votre identité visuelle : faire-part, menus, plans "
            "de table, étiquettes cadeaux, signalétique. De l'esquisse à "
            "l'impression, chaque détail compte. Style moderne ou traditionnel."
        ),
        "icon_name": "brush",
        "image_url": "/images/photo-1518199266791-5375a83190b7.jpg",
        "price_from": Decimal("450000"),
        "inclusions": json.dumps([
            "Identité visuelle complète",
            "Faire-part et save-the-date",
            "Menus et plans de table",
            "Signalétique",
            "Coordination avec l'imprimeur",
        ]),
        "sort_order": 8,
    },
]

# ---------------------------------------------------------------------------
# Users — Beninese names
# ---------------------------------------------------------------------------

USERS: list[dict[str, Any]] = [
    {
        "email": "admin@everafterevents.com",
        "password": "Admin1234",
        "first_name": "Mélissa",
        "last_name": "Gbèdji",
        "phone": "+229 97 12 34 56",
        "role": "admin",
        "is_verified": True,
        "avatar_url": "/images/photo-1494790108377-be9c29b29330.jpg",
    },
    {
        "email": "espérance.akpakpo@example.com",
        "password": "Client1234",
        "first_name": "Espérance",
        "last_name": "Akpakpo",
        "phone": "+229 97 23 45 67",
        "role": "client",
        "is_verified": True,
        "avatar_url": "/images/photo-1529626455594-4ff0802cfb7e.jpg",
    },
    {
        "email": "gildas.hounsou@example.com",
        "password": "Client1234",
        "first_name": "Gildas",
        "last_name": "Hounsou",
        "phone": "+229 97 34 56 78",
        "role": "client",
        "is_verified": True,
        "avatar_url": "/images/photo-1507003211169-0a1dd7228f2d.jpg",
    },
    {
        "email": "judicael.dossou@example.com",
        "password": "Client1234",
        "first_name": "Judicaël",
        "last_name": "Dossou",
        "phone": "+229 97 45 67 89",
        "role": "client",
        "is_verified": True,
        "avatar_url": "/images/photo-1506794778202-cad84cf45f1d.jpg",
    },
    {
        "email": "pelagie.sossou@example.com",
        "password": "Client1234",
        "first_name": "Pélagie",
        "last_name": "Sossou",
        "phone": "+229 97 56 78 90",
        "role": "client",
        "is_verified": True,
        "avatar_url": "/images/photo-1531746020798-e6953c6e8e04.jpg",
    },
    {
        "email": "romuald.agossou@example.com",
        "password": "Client1234",
        "first_name": "Romuald",
        "last_name": "Agossou",
        "phone": "+229 97 67 89 01",
        "role": "client",
        "is_verified": True,
        "avatar_url": "/images/photo-1500648767791-00dcc994a43e.jpg",
    },
]

# ---------------------------------------------------------------------------
# Weddings — Beninese venues and locations
# ---------------------------------------------------------------------------

WEDDINGS: list[dict[str, Any]] = [
    {
        "user_index": 1,  # Espérance Akpakpo
        "partner_first_name": "Marcel",
        "partner_last_name": "Akpakpo",
        "wedding_date": date_(2025, 12, 20),
        "venue": "Palais des Congrès, Cotonou",
        "guest_count": 200,
        "total_budget": Decimal("5000000"),
        "spent_budget": Decimal("4850000"),
        "style": "traditionnel",
        "status": "completed",
        "progress_pct": 100,
        "notes": "Mariage traditionnel avec cérémonie à l'église et réception au Palais des Congrès.",
    },
    {
        "user_index": 2,  # Gildas Hounsou
        "partner_first_name": "Arsène",
        "partner_last_name": "Hounsou",
        "wedding_date": date_(2026, 3, 14),
        "venue": "Plage de Grand-Popo",
        "guest_count": 80,
        "total_budget": Decimal("3500000"),
        "spent_budget": Decimal("3200000"),
        "style": "boheme",
        "status": "completed",
        "progress_pct": 100,
        "notes": "Cérémonie sur la plage au coucher du soleil avec cocktails et dance.",
    },
    {
        "user_index": 3,  # Judicaël Dossou
        "partner_first_name": "Bénédicte",
        "partner_last_name": "Dossou",
        "wedding_date": date_(2026, 6, 28),
        "venue": "Hôtel du Lac, Ganvié",
        "guest_count": 120,
        "total_budget": Decimal("4200000"),
        "spent_budget": Decimal("3980000"),
        "style": "moderne",
        "status": "completed",
        "progress_pct": 100,
        "notes": "Réception moderne sur pilotis avec vue sur le lac Nokoué.",
    },
    {
        "user_index": 4,  # Pélagie Sossou
        "partner_first_name": "Blaise",
        "partner_last_name": "Sossou",
        "wedding_date": date_(2026, 9, 12),
        "venue": "Fondation Zinsou, Ouidah",
        "guest_count": 150,
        "total_budget": Decimal("6000000"),
        "spent_budget": Decimal("5500000"),
        "style": "romantique",
        "status": "completed",
        "progress_pct": 100,
        "notes": "Cadre artistique unique à la Fondation Zinsou, ambiance chic et romantique.",
    },
    {
        "user_index": 5,  # Romuald Agossou
        "partner_first_name": "Fidèle",
        "partner_last_name": "Agossou",
        "wedding_date": date_(2026, 4, 25),
        "venue": "Hôtel Bel Azur, Cotonou",
        "guest_count": 250,
        "total_budget": Decimal("7500000"),
        "spent_budget": Decimal("7100000"),
        "style": "luxe",
        "status": "completed",
        "progress_pct": 100,
        "notes": "Grand mariage de luxe en bord de mer avec orchestre et feux d'artifice.",
    },
]

# ---------------------------------------------------------------------------
# Photo Tags
# ---------------------------------------------------------------------------

PHOTO_TAGS: list[dict[str, str]] = [
    {"name": "Romantique", "slug": "romantique"},
    {"name": "Bohème", "slug": "boheme"},
    {"name": "Moderne", "slug": "moderne"},
    {"name": "Traditionnel", "slug": "traditionnel"},
    {"name": "Luxe", "slug": "luxe"},
    {"name": "Intimiste", "slug": "intimiste"},
    {"name": "Plage", "slug": "plage"},
    {"name": "Église", "slug": "eglise"},
]

# ---------------------------------------------------------------------------
# Gallery Photos — mixed diversity (African, Asian, European)
# ---------------------------------------------------------------------------

GALLERY_PHOTOS: list[dict[str, Any]] = [
    {
        "title": "Mariage Traditionnel à Cotonou",
        "description": "Cérémonie de mariage traditionnel au Palais des Congrès, ambiance festive.",
        "image_url": "/images/photo-1519741497674-611481863552.jpg",
        "thumbnail_url": "/images/photo-1519741497674-611481863552.jpg",
        "width": 1200, "height": 800,
        "venue": "Palais des Congrès, Cotonou",
        "season": "ete",
        "rating": 5.0,
        "is_featured": True,
        "sort_order": 1,
        "tags": ["Traditionnel", "Romantique"],
    },
    {
        "title": "Cérémonie Bohème sur la Plage de Grand-Popo",
        "description": "Arche fleurie et drapés pour une cérémonie bohème en bord de mer.",
        "image_url": "/images/photo-1511795409834-ef04bbd61622.jpg",
        "thumbnail_url": "/images/photo-1511795409834-ef04bbd61622.jpg",
        "width": 1200, "height": 800,
        "venue": "Plage de Grand-Popo",
        "season": "ete",
        "rating": 4.8,
        "is_featured": True,
        "sort_order": 2,
        "tags": ["Bohème", "Plage", "Intimiste"],
    },
    {
        "title": "Centre de Table aux Tons Tropicaux",
        "description": "Composition florale aux tons vifs avec fleurs tropicales.",
        "image_url": "/images/photo-1464366400600-7168b8af9bc3.jpg",
        "thumbnail_url": "/images/photo-1464366400600-7168b8af9bc3.jpg",
        "width": 800, "height": 1200,
        "season": "printemps",
        "rating": 4.7,
        "is_featured": False,
        "sort_order": 3,
        "tags": ["Romantique", "Traditionnel"],
    },
    {
        "title": "Mariage Moderne à l'Hôtel du Lac",
        "description": "Dîner chic sur pilotis avec vue sur le lac Nokoué à Ganvié.",
        "image_url": "/images/photo-1410103594768-5fe9d6e7653f.jpg",
        "thumbnail_url": "/images/photo-1410103594768-5fe9d6e7653f.jpg",
        "width": 1200, "height": 800,
        "venue": "Hôtel du Lac, Ganvié",
        "season": "ete",
        "rating": 4.9,
        "is_featured": True,
        "sort_order": 4,
        "tags": ["Moderne", "Luxe"],
    },
    {
        "title": "Couple Asiatique au Jardin",
        "description": "Séance photo élégante d'un couple dans un jardin luxuriant.",
        "image_url": "/images/photo-1529636798458-92182e662485.jpg",
        "thumbnail_url": "/images/photo-1529636798458-92182e662485.jpg",
        "width": 1200, "height": 800,
        "season": "printemps",
        "rating": 4.8,
        "is_featured": True,
        "sort_order": 5,
        "tags": ["Romantique", "Moderne"],
    },
    {
        "title": "Mariage à l'Église Saint-Michel",
        "description": "Sortie de messe sous une haie d'honneur à Cotonou.",
        "image_url": "/images/photo-1501281668745-f7f57925c3b4.jpg",
        "thumbnail_url": "/images/photo-1501281668745-f7f57925c3b4.jpg",
        "width": 1200, "height": 800,
        "venue": "Église Saint-Michel, Cotonou",
        "season": "ete",
        "rating": 4.8,
        "is_featured": False,
        "sort_order": 6,
        "tags": ["Traditionnel", "Église", "Romantique"],
    },
    {
        "title": "Couple Européen en Ville",
        "description": "Séance photo urbaine d'un couple dans une rue pavée.",
        "image_url": "/images/photo-1511285560929-80b456fea0bc.jpg",
        "thumbnail_url": "/images/photo-1511285560929-80b456fea0bc.jpg",
        "width": 800, "height": 1200,
        "season": "printemps",
        "rating": 4.6,
        "is_featured": False,
        "sort_order": 7,
        "tags": ["Romantique", "Intimiste"],
    },
    {
        "title": "Décoration de Table Luxueuse",
        "description": "Vaisselle dorée, verrerie cristal et centre de table sophistiqué.",
        "image_url": "/images/photo-1516749442048-5fe8bfa3e624.jpg",
        "thumbnail_url": "/images/photo-1516749442048-5fe8bfa3e624.jpg",
        "width": 1200, "height": 800,
        "season": "hiver",
        "rating": 4.5,
        "is_featured": False,
        "sort_order": 8,
        "tags": ["Luxe", "Moderne"],
    },
    {
        "title": "Couple Africain en Tenue Traditionnelle",
        "description": "Magnifique couple en tenues traditionnelles béninoises.",
        "image_url": "/images/photo-1587271407850-8d438ca5fdf2.jpg",
        "thumbnail_url": "/images/photo-1587271407850-8d438ca5fdf2.jpg",
        "width": 1200, "height": 800,
        "venue": "Ouidah",
        "season": "ete",
        "rating": 5.0,
        "is_featured": True,
        "sort_order": 9,
        "tags": ["Traditionnel", "Romantique"],
    },
    {
        "title": "Mariage Africain Moderne",
        "description": "Couple africain contemporain lors d'une réception élégante.",
        "image_url": "/images/photo-1542038333242-77ec32e5249a.jpg",
        "thumbnail_url": "/images/photo-1542038333242-77ec32e5249a.jpg",
        "width": 1200, "height": 800,
        "season": "ete",
        "rating": 4.8,
        "is_featured": True,
        "sort_order": 10,
        "tags": ["Moderne", "Luxe"],
    },
    {
        "title": "Couple Asiatique en Tenue de Soirée",
        "description": "Portrait élégant d'un couple asiatique en tenue de soirée.",
        "image_url": "/images/photo-1566706510291-5e6fcdd6d25c.jpg",
        "thumbnail_url": "/images/photo-1566706510291-5e6fcdd6d25c.jpg",
        "width": 800, "height": 1200,
        "season": "printemps",
        "rating": 4.6,
        "is_featured": False,
        "sort_order": 11,
        "tags": ["Romantique", "Moderne"],
    },
    {
        "title": "Pièce Montée et Gâteau",
        "description": "Pièce montée traditionnelle revisitée avec des fleurs fraîches.",
        "image_url": "/images/photo-1555244162-803834f70033.jpg",
        "thumbnail_url": "/images/photo-1555244162-803834f70033.jpg",
        "width": 800, "height": 1200,
        "season": "toutes",
        "rating": 4.6,
        "is_featured": False,
        "sort_order": 12,
        "tags": ["Traditionnel", "Romantique"],
    },
    {
        "title": "Cocktail en Terrasse au Bénin",
        "description": "Moment convivial autour d'un cocktail avec vue sur la lagune.",
        "image_url": "/images/photo-1530023367847-a683933f4172.jpg",
        "thumbnail_url": "/images/photo-1530023367847-a683933f4172.jpg",
        "width": 1200, "height": 800,
        "season": "ete",
        "rating": 4.7,
        "is_featured": False,
        "sort_order": 13,
        "tags": ["Moderne", "Luxe", "Plage"],
    },
    {
        "title": "Couple Métis à la Plage",
        "description": "Portrait romantique d'un couple métis au bord de l'océan.",
        "image_url": "/images/photo-1507003211169-0a1dd7228f2d.jpg",
        "thumbnail_url": "/images/photo-1507003211169-0a1dd7228f2d.jpg",
        "width": 1200, "height": 800,
        "season": "ete",
        "rating": 4.8,
        "is_featured": False,
        "sort_order": 14,
        "tags": ["Romantique", "Plage", "Intimiste"],
    },
    {
        "title": "Mariage d'Hiver aux Chandelles",
        "description": "Dîner aux chandelles dans une salle voûtée, ambiance feutrée.",
        "image_url": "/images/photo-1505236858219-8359eb29e329.jpg",
        "thumbnail_url": "/images/photo-1505236858219-8359eb29e329.jpg",
        "width": 1200, "height": 800,
        "season": "hiver",
        "rating": 4.9,
        "is_featured": False,
        "sort_order": 15,
        "tags": ["Romantique", "Luxe", "Intimiste"],
    },
    {
        "title": "Cérémonie Laïque en Plein Air",
        "description": "Arche fleurie et cérémonie laïque au cœur de la nature.",
        "image_url": "/images/photo-1519225421980-715cb0215aed.jpg",
        "thumbnail_url": "/images/photo-1519225421980-715cb0215aed.jpg",
        "width": 1200, "height": 800,
        "season": "printemps",
        "rating": 4.7,
        "is_featured": False,
        "sort_order": 16,
        "tags": ["Bohème", "Romantique", "Intimiste"],
    },
]

# ---------------------------------------------------------------------------
# Testimonials — Beninese couples + mixed photo diversity
# ---------------------------------------------------------------------------

TESTIMONIALS: list[dict[str, Any]] = [
    {
        "user_index": 1,
        "couple_names": "Espérance & Marcel Akpakpo",
        "wedding_date": date_(2025, 12, 20),
        "venue": "Palais des Congrès, Cotonou",
        "style": "traditionnel",
        "rating": 5.0,
        "content": (
            "Un immense merci à toute l'équipe d'Ever After Events ! Notre mariage "
            "traditionnel au Palais des Congrès a dépassé toutes nos espérances. "
            "Mélissa a été d'un professionnalisme incroyable, chaque détail était "
            "parfait. Du premier rendez-vous au jour J, nous avons été "
            "accompagnés avec bienveillance et expertise. Les invités n'arrêtent "
            "pas de nous dire que c'était le plus beau mariage de l'année !"
        ),
        "photo_url": "/images/photo-1587271407850-8d438ca5fdf2.jpg",
        "is_verified": True,
        "is_featured": True,
        "sort_order": 1,
    },
    {
        "user_index": 2,
        "couple_names": "Gildas & Arsène Hounsou",
        "wedding_date": date_(2026, 3, 14),
        "venue": "Plage de Grand-Popo",
        "style": "boheme",
        "rating": 4.8,
        "content": (
            "Grâce à Ever After Events, notre mariage bohème sur la plage de "
            "Grand-Popo a été un vrai conte de fées. La décoration était exactement ce "
            "dont nous rêvions : des tissus vaporeux partout, des guirlandes lumineuses, "
            "une ambiance chaleureuse et élégante. L'équipe a su gérer les "
            "imprévus avec calme et professionnalisme. Nous recommandons les "
            "yeux fermés !"
        ),
        "photo_url": "/images/photo-1502823403499-6ccfcf4fb453.jpg",
        "is_verified": True,
        "is_featured": True,
        "sort_order": 2,
    },
    {
        "user_index": 3,
        "couple_names": "Judicaël & Bénédicte Dossou",
        "wedding_date": date_(2026, 6, 28),
        "venue": "Hôtel du Lac, Ganvié",
        "style": "moderne",
        "rating": 5.0,
        "content": (
            "Un mariage moderne sur pilotis au bord du lac Nokoué, c'était notre "
            "rêve et Ever After Events l'a rendu possible. L'organisation a été "
            "irréprochable. La cérémonie au coucher du soleil était tout "
            "simplement magique. Merci pour votre créativité et votre réactivité. "
            "Vous avez rendu ce moment inoubliable."
        ),
        "photo_url": "/images/photo-1534528741775-53994a69daeb.jpg",
        "is_verified": True,
        "is_featured": True,
        "sort_order": 3,
    },
    {
        "user_index": 4,
        "couple_names": "Pélagie & Blaise Sossou",
        "wedding_date": date_(2026, 9, 12),
        "venue": "Fondation Zinsou, Ouidah",
        "style": "romantique",
        "rating": 4.9,
        "content": (
            "Notre mariage à la Fondation Zinsou était tout simplement sublime. "
            "Nous voulions quelque chose d'artistique et l'équipe a "
            "parfaitement compris notre vision. La coordination le jour J était "
            "impeccable, nous n'avons eu à nous soucier de rien. Mention spéciale "
            "pour le cocktail dinatoire qui était un véritable voyage gustatif !"
        ),
        "photo_url": "/images/photo-1544005313-94ddf0286df2.jpg",
        "is_verified": True,
        "is_featured": False,
        "sort_order": 4,
    },
    {
        "user_index": 5,
        "couple_names": "Romuald & Fidèle Agossou",
        "wedding_date": date_(2026, 4, 25),
        "venue": "Hôtel Bel Azur, Cotonou",
        "style": "luxe",
        "rating": 5.0,
        "content": (
            "Un grand merci pour avoir organisé notre mariage de luxe avec "
            "tant d'élégance. La réception en bord de mer à l'Hôtel Bel Azur "
            "a ébloui tous nos invités. Tout était parfait, du "
            "moindre détail floral au choix du menu. Une organisation sans faille !"
        ),
        "photo_url": "/images/photo-1487412720507-e7ab37603c6f.jpg",
        "is_verified": True,
        "is_featured": True,
        "sort_order": 5,
    },
    {
        "couple_names": "Aïcha & Karim Ouedraogo",
        "wedding_date": date_(2026, 2, 8),
        "venue": "Hôtel Sofitel, Ouagadougou",
        "style": "luxe",
        "rating": 4.8,
        "content": (
            "Faire appel à Ever After Events a été la meilleure décision de "
            "notre mariage. Leur carnet d'adresses nous a permis de trouver des "
            "prestataires exceptionnels, et la coordination jour J était d'une "
            "précision. Merci du fond du cœur."
        ),
        "photo_url": "/images/photo-1552338614-bb71a2d380b5.jpg",
        "is_verified": True,
        "is_featured": False,
        "sort_order": 6,
    },
    {
        "couple_names": "Yui & Kenji Tanaka",
        "wedding_date": date_(2025, 11, 3),
        "venue": "Chapelle de la Miséricorde, Tokyo",
        "style": "romantique",
        "rating": 4.9,
        "content": (
            "Merci pour avoir organisé notre mariage franco-japonais. Le mélange "
            "des cultures était parfaitement équilibré, et la coordination avec "
            "les prestataires locaux et internationaux était remarquable. "
            "Un grand merci à Mélissa pour sa patience et son professionnalisme."
        ),
        "photo_url": "/images/photo-1566706510291-5e6fcdd6d25c.jpg",
        "is_verified": True,
        "is_featured": False,
        "sort_order": 7,
    },
    {
        "couple_names": "Chloé & Antoine Dubois",
        "wedding_date": date_(2026, 5, 18),
        "venue": "Domaine de la Bastide, Provence",
        "style": "romantique",
        "rating": 4.8,
        "content": (
            "Un mariage romantique en Provence, un rêve devenu réalité ! "
            "L'équipe a su créer une ambiance à la fois décontractée et "
            "élégante. Les invités ont adoré les activités que vous aviez "
            "organisées. Merci pour votre créativité débordante et votre "
            "professionnalisme sans faille."
        ),
        "photo_url": "/images/photo-1494790108377-be9c29b29330.jpg",
        "is_verified": True,
        "is_featured": False,
        "sort_order": 8,
    },
]

# ---------------------------------------------------------------------------
# Blog Posts — localized for Beninese context
# ---------------------------------------------------------------------------

BLOG_POSTS: list[dict[str, Any]] = [
    {
        "title": "10 Conseils pour Organiser son Mariage au Bénin en 6 Mois",
        "slug": "10-conseils-organiser-mariage-benin-6-mois",
        "excerpt": (
            "Vous vous lancez dans l'organisation de votre mariage avec un "
            "planning serré ? Pas de panique ! Voici nos 10 conseils d'experte "
            "pour réussir votre mariage au Bénin en seulement 6 mois."
        ),
        "content": (
            "Organiser un mariage en 6 mois au Bénin, c'est tout à fait possible "
            "avec une bonne méthode. 1. Définissez votre budget en priorité (en FCFA). "
            "2. Choisissez votre lieu avant tout : Cotonou, Ouidah, Grand-Popo "
            "ou Ganvié ? 3. Faites appel à un wedding planner pour gagner un "
            "temps précieux. 4. Privilégiez les prestataires recommandés. "
            "5. Déléguez les tâches que vous n'aimez pas. 6. Utilisez notre "
            "checklist pour ne rien oublier. 7. Prévoyez des marges dans votre "
            "planning. 8. Limitez la liste d'invités si nécessaire. 9. Optez "
            "pour des solutions clé en main pour la décoration. 10. Respirez "
            "et faites-vous confiance !"
        ),
        "cover_image_url": "/images/photo-1519741497674-611481863552.jpg",
        "category": "organisation",
        "reading_time_minutes": 6,
        "is_published": True,
        "published_at": dt(2025, 6, 15, 10, 0),
        "meta_title": "Organiser son mariage au Bénin en 6 mois - 10 conseils",
        "meta_description": "Découvrez nos 10 conseils d'experts pour organiser un mariage au Bénin en 6 mois chrono.",
    },
    {
        "title": "Budget Mariage : Combien Coûte un Mariage au Bénin en 2026 ?",
        "slug": "budget-mariage-benin-2026",
        "excerpt": (
            "Quel budget prévoir pour son mariage au Bénin ? Découvrez nos "
            "estimations détaillées en FCFA et nos conseils pour optimiser votre "
            "budget sans sacrifier vos rêves."
        ),
        "content": (
            "Le budget moyen d'un mariage au Bénin en 2026 se situe entre "
            "2 000 000 et 8 000 000 FCFA, mais tout dépend de vos attentes et "
            "du nombre d'invités. La plus grande part du budget (30-40%) est "
            "généralement consacrée à la réception et au traiteur. Le lieu "
            "représente 15-20%, la robe et les tenues 10-15%, la photographie "
            "et vidéo 8-12%, et la décoration 10-15%. Pour optimiser votre "
            "budget, privilégiez un mariage en semaine ou hors saison, "
            "limitez la liste d'invités, et faites appel à un wedding planner "
            "qui vous aidera à négocier avec les prestataires."
        ),
        "cover_image_url": "/images/photo-1553729459-afe8f2e2e65a.jpg",
        "category": "budget",
        "reading_time_minutes": 6,
        "is_published": True,
        "published_at": dt(2026, 3, 12, 15, 0),
        "meta_title": "Budget mariage Bénin 2026 - Guide complet en FCFA",
        "meta_description": "Tout savoir sur le budget d'un mariage au Bénin en 2026 : fourchettes de prix et répartition des coûts.",
    },
    {
        "title": "Les Plus Beaux Lieux de Réception au Bénin",
        "slug": "plus-beaux-lieux-reception-benin",
        "excerpt": (
            "Du Palais des Congrès à la plage de Grand-Popo, en passant par la "
            "cité lacustre de Ganvié, découvrez notre sélection des plus beaux "
            "lieux pour célébrer votre mariage au Bénin."
        ),
        "content": (
            "Le Bénin regorge de lieux magnifiques pour votre mariage. Le Palais "
            "des Congrès de Cotonou offre une grande capacité et un cadre moderne "
            "idéal pour les grands mariages. La plage de Grand-Popo est parfaite "
            "pour les cérémonies bohèmes au coucher du soleil. L'Hôtel du Lac "
            "à Ganvié propose une expérience unique sur pilotis avec vue sur "
            "le lac Nokoué. La Fondation Zinsou à Ouidah allie art contemporain "
            "et histoire. Enfin, l'Hôtel Bel Azur et le Novotel de Cotonou "
            "sont des valeurs sûres pour une réception élégante."
        ),
        "cover_image_url": "/images/photo-1507525428034-b723cf961d3e.jpg",
        "category": "decoration",
        "reading_time_minutes": 4,
        "is_published": True,
        "published_at": dt(2026, 1, 10, 9, 0),
        "meta_title": "Plus beaux lieux de réception pour mariage au Bénin",
        "meta_description": "Découvrez les plus beaux lieux pour célébrer votre mariage au Bénin : Cotonou, Ouidah, Grand-Popo, Ganvié.",
    },
    {
        "title": "Guide des Tenues Traditionnelles Béninoises pour le Mariage",
        "slug": "guide-tenues-traditionnelles-beninoises-mariage",
        "excerpt": (
            "La robe de mariée et le costume sont des pièces maîtresses du jour J. "
            "Découvrez notre guide pour des tenues qui allient tradition et modernité."
        ),
        "content": (
            "Au Bénin, le mariage est l'occasion de célébrer la richesse des "
            "tissus traditionnels. Le pagne tissé, le bogolan et le kente sont "
            "très prisés pour les cérémonies. Les couleurs vives comme le rouge, "
            "l'or et le bleu roi sont particulièrement populaires. De nombreux "
            "créateurs béninois proposent des robes modernes intégrant des "
            "éléments traditionnels. N'oubliez pas : commencez vos essayages "
            "au moins 4 mois avant le mariage, et prévoyez 2 à 3 retouches."
        ),
        "cover_image_url": "/images/photo-1587271407850-8d438ca5fdf2.jpg",
        "category": "dress",
        "reading_time_minutes": 5,
        "is_published": True,
        "published_at": dt(2026, 2, 5, 11, 0),
        "meta_title": "Guide des tenues traditionnelles béninoises pour le mariage",
        "meta_description": "Tout savoir sur les tenues de mariage au Bénin : pagne tissé, bogolan, kente et créateurs locaux.",
    },
    {
        "title": "Comment Choisir son Traiteur pour un Mariage Réussi au Bénin ?",
        "slug": "comment-choisir-traiteur-mariage-benin",
        "excerpt": (
            "Le repas de mariage est un moment clé. Découvrez nos astuces pour "
            "sélectionner le traiteur qui correspond à vos envies et à votre budget."
        ),
        "content": (
            "Choisir son traiteur est l'une des décisions les plus importantes "
            "dans l'organisation d'un mariage au Bénin. Commencez par définir "
            "votre budget par tête (entre 15 000 et 50 000 FCFA selon le prestige), "
            "puis le style de repas : assis traditionnel, buffet, cocktail "
            "dinatoire. Goûtez toujours avant de signer ! Privilégiez les "
            "traiteurs qui travaillent avec des produits locaux et de saison. "
            "N'oubliez pas de vérifier les avis et de demander des références. "
            "Un bon traiteur saura s'adapter à vos contraintes (allergies, "
            "régimes spécifiques)."
        ),
        "cover_image_url": "/images/photo-1555244162-803834f70033.jpg",
        "category": "catering",
        "reading_time_minutes": 5,
        "is_published": True,
        "published_at": dt(2025, 8, 20, 14, 0),
        "meta_title": "Guide pour choisir son traiteur de mariage au Bénin",
        "meta_description": "Tout ce qu'il faut savoir pour sélectionner le meilleur traiteur pour votre mariage au Bénin.",
    },
]

# ---------------------------------------------------------------------------
# FAQ — localized for Beninese context (XOF currency, etc.)
# ---------------------------------------------------------------------------

FAQ_LIST: list[dict[str, Any]] = [
    {
        "question": "Combien coûte un wedding planner au Bénin ?",
        "answer": (
            "Nos tarifs varient en fonction de la formule choisie et de la "
            "complexité de votre projet. La Coordination Complète démarre à "
            "2 500 000 FCFA, tandis que l'Organisation Partielle commence à "
            "1 200 000 FCFA. Nous proposons également des prestations à la carte. "
            "Contactez-nous pour un devis personnalisé gratuit."
        ),
        "category": "pricing",
        "sort_order": 1,
    },
    {
        "question": "Un devis est-il payant ?",
        "answer": (
            "Non, le premier rendez-vous conseil et le devis sont entièrement "
            "gratuits et sans engagement. Nous échangeons sur votre projet, "
            "vos envies et votre budget, puis nous vous proposons la formule "
            "la mieux adaptée à vos besoins."
        ),
        "category": "pricing",
        "sort_order": 2,
    },
    {
        "question": "Proposez-vous des facilités de paiement ?",
        "answer": (
            "Oui, nous proposons un échelonnement du paiement en plusieurs "
            "fois, sans frais supplémentaires. Généralement : 30% à la "
            "signature du contrat, 30% à mi-parcours, et 40% un mois avant "
            "le jour J. Nous acceptons Mobile Money (MTN, Moov) et virements bancaires."
        ),
        "category": "pricing",
        "sort_order": 3,
    },
    {
        "question": "Quel est le rôle d'un wedding planner exactement ?",
        "answer": (
            "Le wedding planner est votre chef d'orchestre. Il vous accompagne "
            "de A à Z dans l'organisation : définition du budget, recherche et "
            "coordination des prestataires, gestion du planning, décoration, et "
            "présence le jour J pour que tout se déroule sans accroc. Vous "
            "profitez de votre mariage sans stress."
        ),
        "category": "organization",
        "sort_order": 4,
    },
    {
        "question": "À quel moment dois-je faire appel à un wedding planner ?",
        "answer": (
            "Idéalement, le plus tôt possible ! Dès que vous avez une date et "
            "un budget en tête, contactez-nous. Plus nous intervenons tôt, "
            "plus nous pouvons vous faire gagner du temps et de l'argent. "
            "Mais nous intervenons aussi en cours de projet si vous avez "
            "besoin d'un coup de main sur des aspects spécifiques."
        ),
        "category": "organization",
        "sort_order": 5,
    },
    {
        "question": "Combien de temps à l'avance faut-il réserver les prestataires ?",
        "answer": (
            "Les prestataires les plus demandés (lieu, photographe, traiteur) "
            "se réservent 6 à 12 mois à l'avance pour les dates populaires. "
            "Pour un mariage en 6 mois, pas de panique : nous avons un carnet "
            "d'adresses solide et nous trouvons toujours des solutions."
        ),
        "category": "organization",
        "sort_order": 6,
    },
    {
        "question": "Organisez-vous aussi les dots et cérémonies traditionnelles ?",
        "answer": (
            "Oui, tout à fait ! Nous connaissons parfaitement les traditions "
            "béninoises et nous pouvons vous accompagner dans l'organisation "
            "de la dot, de la cérémonie traditionnelle et du repas de famille. "
            "Nous travaillons avec des spécialistes des différentes régions "
            "du Bénin (Fon, Yoruba, Bariba, Dendi, etc.)"
        ),
        "category": "vendors",
        "sort_order": 7,
    },
    {
        "question": "Sélectionnez-vous les prestataires ou puis-je choisir les miens ?",
        "answer": (
            "Les deux sont possibles ! Nous travaillons avec un réseau de "
            "prestataires triés sur le volet (photographes, traiteurs, "
            "fleuristes, DJ...). Mais si vous avez déjà des contacts ou des "
            "coups de cœur, nous les intégrons volontiers et nous nous "
            "chargeons de la coordination avec eux."
        ),
        "category": "vendors",
        "sort_order": 8,
    },
    {
        "question": "Comment se déroule le premier rendez-vous ?",
        "answer": (
            "Le premier rendez-vous, gratuit, dure environ 1h30. Nous faisons "
            "connaissance, vous nous parlez de votre histoire et de vos envies. "
            "Nous vous présentons nos formules et nos réalisations. À la fin "
            "de l'échange, nous avons une vision claire de votre projet et "
            "nous vous faisons une proposition sur mesure."
        ),
        "category": "meetings",
        "sort_order": 9,
    },
    {
        "question": "Organisez-vous des mariages à l'étranger depuis le Bénin ?",
        "answer": (
            "Oui, nous organisons régulièrement des mariages dans toute la "
            "sous-région (Togo, Côte d'Ivoire, Sénégal) et au-delà. "
            "Les rendez-vous se font en visioconférence et nous nous déplaçons "
            "sur place pour les repérages et le jour J."
        ),
        "category": "meetings",
        "sort_order": 10,
    },
    {
        "question": "Comment accéder à mon espace client ?",
        "answer": (
            "Chaque couple reçoit un accès à son espace client personnalisé "
            "sur notre plateforme. Vous y trouverez votre checklist, votre "
            "budget, vos documents, votre liste d'invités et un système de "
            "messagerie pour échanger directement avec votre chef de projet. "
            "L'accès est sécurisé et disponible 24h/24."
        ),
        "category": "client_space",
        "sort_order": 11,
    },
    {
        "question": "Proposez-vous des forfaits pour les petits budgets ?",
        "answer": (
            "Absolument ! Nous avons conscience que chaque budget est unique. "
            "Notre formule Organisation Partielle démarre à 500 000 FCFA et nous "
            "proposons également des consultations à l'heure (à partir de "
            "50 000 FCFA/h) pour les couples qui souhaitent des conseils ponctuels."
        ),
        "category": "general",
        "sort_order": 12,
    },
    {
        "question": "Êtes-vous disponibles le jour du mariage ?",
        "answer": (
            "Oui, c'est notre garantie ! Un chef de projet (ou deux selon la "
            "formule) est présent sur place du début à la fin de votre "
            "réception. Nous coordonnons les prestataires, gérons les "
            "imprévus, et veillons au respect du planning."
        ),
        "category": "general",
        "sort_order": 13,
    },
    {
        "question": "Que se passe-t-il en cas d'intempéries ?",
        "answer": (
            "Au Bénin, la saison des pluies s'étend d'avril à octobre. "
            "Nous avons toujours un plan B ! Dès la phase de préparation, "
            "nous anticipons les scénarios possibles avec vous et le lieu "
            "de réception. Barnums, tentes, repli en intérieur : "
            "nous avons plusieurs solutions pour que votre mariage soit "
            "réussi, quel que soit le temps."
        ),
        "category": "general",
        "sort_order": 14,
    },
]

# ---------------------------------------------------------------------------
# Partners — Beninese vendors and diverse partners
# ---------------------------------------------------------------------------

PARTNERS: list[dict[str, Any]] = [
    {
        "name": "Délices du Bénin Traiteur",
        "logo_url": "/images/photo-1555244162-803834f70033.jpg",
        "website_url": "https://www.delicesdubenin.com",
        "specialty": "Traiteur gastronomique béninois et international",
        "tier": "gold",
        "sort_order": 1,
    },
    {
        "name": "Studio Flash Photo Bénin",
        "logo_url": "/images/photo-1511795409834-ef04bbd61622.jpg",
        "website_url": "https://www.studioflashbenin.com",
        "specialty": "Photographie et vidéo de mariage",
        "tier": "gold",
        "sort_order": 2,
    },
    {
        "name": "Atelier Fleurs Tropicales",
        "logo_url": "/images/photo-1519741497674-611481863552.jpg",
        "website_url": "https://www.atelierfleurscotonou.com",
        "specialty": "Décoration florale tropicale sur mesure",
        "tier": "gold",
        "sort_order": 3,
    },
    {
        "name": "Maison du Pagne Tissé",
        "logo_url": "/images/photo-1587271407850-8d438ca5fdf2.jpg",
        "website_url": "https://www.maisonpagnetisse.com",
        "specialty": "Création de tenues traditionnelles et robes de mariée",
        "tier": "silver",
        "sort_order": 4,
    },
    {
        "name": "Hôtel Bel Azur",
        "logo_url": "/images/photo-1519167758481-83f550bb49b3.jpg",
        "website_url": "https://www.hotelbelazur.com",
        "specialty": "Hôtel et lieu de réception de luxe",
        "tier": "silver",
        "sort_order": 5,
    },
    {
        "name": "DJ Master Afrobeat",
        "logo_url": "/images/photo-1493225457124-a3eb161ffa5f.jpg",
        "website_url": "https://www.djmasterbénin.com",
        "specialty": "Animation musicale et DJ set",
        "tier": "partner",
        "sort_order": 6,
    },
]

# ---------------------------------------------------------------------------
# Tools / Outils
# ---------------------------------------------------------------------------

TOOLS: list[dict[str, Any]] = [
    {
        "name": "Simulateur Budgétaire",
        "slug": "simulateur-budgetaire",
        "description": "Calculez votre budget mariage en FCFA avec des estimations personnalisées par poste de dépense.",
        "icon_name": "Calculator",
        "category": "budget",
        "url": "/simulateur-budget",
        "is_featured": True,
        "sort_order": 1,
    },
    {
        "name": "Checklist Interactive",
        "slug": "checklist-interactive",
        "description": "Suivez l'avancement de votre organisation avec une checklist dynamique par catégorie.",
        "icon_name": "CheckSquare",
        "category": "checklist",
        "url": "/client/checklist",
        "is_featured": True,
        "sort_order": 2,
    },
    {
        "name": "Moodboard Inspiration",
        "slug": "moodboard-inspiration",
        "description": "Créez votre tableau d'inspiration personnalisé avec des photos, couleurs et textures.",
        "icon_name": "Image",
        "category": "design",
        "url": "/moodboard",
        "is_featured": True,
        "sort_order": 3,
    },
    {
        "name": "Conjugal Quiz",
        "slug": "conjugal-quiz",
        "description": "Découvrez votre style de mariage idéal grâce à notre quiz interactif.",
        "icon_name": "HelpCircle",
        "category": "planning",
        "url": "/quiz-style",
        "is_featured": True,
        "sort_order": 4,
    },
    {
        "name": "Conciergerie Prestataires",
        "slug": "conciergerie-prestataires",
        "description": "Accédez à notre carnet d'adresses de prestataires triés sur le volet.",
        "icon_name": "Users",
        "category": "vendor",
        "url": "/prestataires",
        "is_featured": True,
        "sort_order": 5,
    },
    {
        "name": "Gestion des Invités",
        "slug": "gestion-des-invites",
        "description": "Gérez votre liste d'invités, les RSVP et le plan de table.",
        "icon_name": "UserPlus",
        "category": "planning",
        "url": "/client/invites",
        "is_featured": False,
        "sort_order": 6,
    },
    {
        "name": "Configurateur Mariage",
        "slug": "configurateur-mariage",
        "description": "Configurez votre mariage idéal en sélectionnant vos options préférées.",
        "icon_name": "Sliders",
        "category": "planning",
        "url": "/configurateur",
        "is_featured": False,
        "sort_order": 7,
    },
    {
        "name": "Mini-Guides Thématiques",
        "slug": "mini-guides-thematiques",
        "description": "Conseils pratiques et guides PDF pour chaque étape de l'organisation.",
        "icon_name": "BookOpen",
        "category": "other",
        "url": "/blog",
        "is_featured": False,
        "sort_order": 8,
    },
]

# ---------------------------------------------------------------------------
# Checklist Items per wedding — localized
# ---------------------------------------------------------------------------

CHECKLIST_ITEMS_DATA: list[list[dict[str, Any]]] = [
    # Wedding 0: Espérance & Marcel (traditionnel, Palais des Congrès)
    [
        {"title": "Réserver la mairie de Cotonou", "category": "administration", "is_completed": True, "due_date_offset": -180},
        {"title": "Réserver l'église Saint-Michel", "category": "administration", "is_completed": True, "due_date_offset": -170},
        {"title": "Signer le contrat avec le Palais des Congrès", "category": "venue", "is_completed": True, "due_date_offset": -150},
        {"title": "Choisir le traiteur et organiser la dégustation", "category": "catering", "is_completed": True, "due_date_offset": -120},
        {"title": "Réserver le photographe et le vidéaste", "category": "photography", "is_completed": True, "due_date_offset": -140},
        {"title": "Finaliser la décoration de la salle", "category": "decoration", "is_completed": True, "due_date_offset": -60},
        {"title": "Choisir le DJ afrobeat et la playlist", "category": "music", "is_completed": True, "due_date_offset": -90},
        {"title": "Commander les tenues traditionnelles", "category": "dress", "is_completed": True, "due_date_offset": -120},
        {"title": "Envoyer les faire-part", "category": "guests", "is_completed": True, "due_date_offset": -120},
        {"title": "Finaliser le plan de table", "category": "guests", "is_completed": True, "due_date_offset": -30},
        {"title": "Préparer la cérémonie de dot", "category": "other", "is_completed": True, "due_date_offset": -60},
        {"title": "Répétition générale à l'église", "category": "other", "is_completed": True, "due_date_offset": -1},
    ],
    # Wedding 1: Gildas & Arsène (boheme, plage Grand-Popo)
    [
        {"title": "Obtenir les autorisations pour la plage de Grand-Popo", "category": "administration", "is_completed": True, "due_date_offset": -210},
        {"title": "Réserver les hébergements pour les invités", "category": "venue", "is_completed": True, "due_date_offset": -90},
        {"title": "Choisir le traiteur (buffet fruits de mer)", "category": "catering", "is_completed": True, "due_date_offset": -120},
        {"title": "Réserver le photographe", "category": "photography", "is_completed": True, "due_date_offset": -150},
        {"title": "Concevoir l'arche de cérémonie bohème", "category": "decoration", "is_completed": True, "due_date_offset": -60},
        {"title": "Louer le mobilier (fauteuils, tables basses)", "category": "decoration", "is_completed": True, "due_date_offset": -45},
        {"title": "Prévoir un plan B météo (saison sèche)", "category": "other", "is_completed": True, "due_date_offset": -30},
        {"title": "Choisir les tenues légères (bohème)", "category": "dress", "is_completed": True, "due_date_offset": -90},
        {"title": "Envoyer les faire-part version digitale", "category": "guests", "is_completed": True, "due_date_offset": -100},
        {"title": "Organiser le coucher de soleil cocktail", "category": "other", "is_completed": True, "due_date_offset": -20},
    ],
    # Wedding 2: Judicaël & Bénédicte (moderne, Hôtel du Lac)
    [
        {"title": "Réserver l'Hôtel du Lac à Ganvié", "category": "venue", "is_completed": True, "due_date_offset": -180},
        {"title": "Choisir le traiteur gastronomique", "category": "catering", "is_completed": True, "due_date_offset": -120},
        {"title": "Réserver le vidéaste (mariage moderne)", "category": "photography", "is_completed": True, "due_date_offset": -140},
        {"title": "Concevoir la scénographie moderne", "category": "decoration", "is_completed": True, "due_date_offset": -60},
        {"title": "Prévoir l'éclairage architectural sur pilotis", "category": "decoration", "is_completed": True, "due_date_offset": -30},
        {"title": "Sélectionner le DJ et le mapping vidéo", "category": "music", "is_completed": True, "due_date_offset": -80},
        {"title": "Finaliser les tenues modernes", "category": "dress", "is_completed": True, "due_date_offset": -60},
        {"title": "Gérer la liste d'invités (120 pers.)", "category": "guests", "is_completed": True, "due_date_offset": -60},
        {"title": "Organiser les animations (photo booth, DJ)", "category": "music", "is_completed": True, "due_date_offset": -30},
    ],
    # Wedding 3: Pélagie & Blaise (romantique, Fondation Zinsou)
    [
        {"title": "Réserver la Fondation Zinsou à Ouidah", "category": "venue", "is_completed": True, "due_date_offset": -200},
        {"title": "Choisir le traiteur (repas assis 4 services)", "category": "catering", "is_completed": True, "due_date_offset": -150},
        {"title": "Réserver photographe et vidéaste", "category": "photography", "is_completed": True, "due_date_offset": -180},
        {"title": "Concevoir la décoration romantique de la galerie", "category": "decoration", "is_completed": True, "due_date_offset": -60},
        {"title": "Choisir le quatuor à cordes jazz", "category": "music", "is_completed": True, "due_date_offset": -90},
        {"title": "Finaliser la robe et le costume", "category": "dress", "is_completed": True, "due_date_offset": -120},
        {"title": "Envoyer les faire-part artistiques", "category": "guests", "is_completed": True, "due_date_offset": -120},
        {"title": "Gérer les hébergements (150 invités)", "category": "guests", "is_completed": True, "due_date_offset": -60},
        {"title": "Organiser le transport Ouidah-Cotonou", "category": "guests", "is_completed": True, "due_date_offset": -21},
    ],
    # Wedding 4: Romuald & Fidèle (luxe, Hôtel Bel Azur)
    [
        {"title": "Réserver l'Hôtel Bel Azur Cotonou", "category": "venue", "is_completed": True, "due_date_offset": -240},
        {"title": "Réserver le traiteur haut de gamme", "category": "catering", "is_completed": True, "due_date_offset": -180},
        {"title": "Réserver photographe et vidéaste", "category": "photography", "is_completed": True, "due_date_offset": -200},
        {"title": "Concevoir la décoration luxueuse de la salle", "category": "decoration", "is_completed": True, "due_date_offset": -90},
        {"title": "Organiser le feu d'artifice sur la plage", "category": "decoration", "is_completed": True, "due_date_offset": -45},
        {"title": "Choisir l'orchestre afro-jazz", "category": "music", "is_completed": True, "due_date_offset": -100},
        {"title": "Finaliser robe de créateur et costume", "category": "dress", "is_completed": True, "due_date_offset": -150},
        {"title": "Envoyer les faire-part dorés", "category": "guests", "is_completed": True, "due_date_offset": -150},
        {"title": "Gérer les hébergements (250 invités)", "category": "guests", "is_completed": True, "due_date_offset": -90},
        {"title": "Planifier la navette et le parking", "category": "guests", "is_completed": True, "due_date_offset": -30},
        {"title": "Préparer les discours et surprises", "category": "other", "is_completed": True, "due_date_offset": -14},
    ],
]

# ---------------------------------------------------------------------------
# Documents per wedding
# ---------------------------------------------------------------------------

DOCUMENTS_DATA: list[list[dict[str, Any]]] = [
    # Wedding 0: Espérance & Marcel
    [
        {
            "title": "Contrat de Coordination Complète",
            "file_url": "https://everafterevents.bj/contracts/akpakpo-coordination.pdf",
            "file_type": "pdf", "file_size": 245000, "category": "contract", "is_shared": True,
        },
        {
            "title": "Devis détaillé - Prestations",
            "file_url": "https://everafterevents.bj/quotes/akpakpo-devis.pdf",
            "file_type": "pdf", "file_size": 180000, "category": "quote", "is_shared": True,
        },
        {
            "title": "Facture finale - Solde Mariage",
            "file_url": "https://everafterevents.bj/invoices/akpakpo-facture-finale.pdf",
            "file_type": "pdf", "file_size": 120000, "category": "invoice", "is_shared": True,
        },
    ],
    # Wedding 1: Gildas & Arsène
    [
        {
            "title": "Contrat Organisation Bohème",
            "file_url": "https://everafterevents.bj/contracts/hounsou-organisation.pdf",
            "file_type": "pdf", "file_size": 210000, "category": "contract", "is_shared": True,
        },
        {
            "title": "Devis Plage Grand-Popo",
            "file_url": "https://everafterevents.bj/quotes/hounsou-devis.pdf",
            "file_type": "pdf", "file_size": 95000, "category": "quote", "is_shared": True,
        },
    ],
    # Wedding 2: Judicaël & Bénédicte
    [
        {
            "title": "Contrat Coordination Moderne",
            "file_url": "https://everafterevents.bj/contracts/dossou-coordination.pdf",
            "file_type": "pdf", "file_size": 235000, "category": "contract", "is_shared": True,
        },
        {
            "title": "Devis Hôtel du Lac",
            "file_url": "https://everafterevents.bj/quotes/dossou-devis.pdf",
            "file_type": "pdf", "file_size": 150000, "category": "quote", "is_shared": True,
        },
    ],
    # Wedding 3: Pélagie & Blaise
    [
        {
            "title": "Contrat Coordination Romantique",
            "file_url": "https://everafterevents.bj/contracts/sossou-conciergerie.pdf",
            "file_type": "pdf", "file_size": 260000, "category": "contract", "is_shared": True,
        },
        {
            "title": "Devis Fondation Zinsou",
            "file_url": "https://everafterevents.bj/quotes/sossou-devis.pdf",
            "file_type": "pdf", "file_size": 190000, "category": "quote", "is_shared": True,
        },
    ],
    # Wedding 4: Romuald & Fidèle
    [
        {
            "title": "Contrat Mariage de Luxe",
            "file_url": "https://everafterevents.bj/contracts/agossou-coordination.pdf",
            "file_type": "pdf", "file_size": 280000, "category": "contract", "is_shared": True,
        },
        {
            "title": "Devis Hôtel Bel Azur",
            "file_url": "https://everafterevents.bj/quotes/agossou-devis.pdf",
            "file_type": "pdf", "file_size": 220000, "category": "quote", "is_shared": True,
        },
        {
            "title": "Facture finale",
            "file_url": "https://everafterevents.bj/invoices/agossou-facture-finale.pdf",
            "file_type": "pdf", "file_size": 130000, "category": "invoice", "is_shared": True,
        },
    ],
]

# ---------------------------------------------------------------------------
# Guests data — Beninese names
# ---------------------------------------------------------------------------

GUESTS_FIRST_NAMES = [
    "Jean", "Marie", "Pierre", "Béatrice", "François", "Monique", "Michel",
    "Marguerite", "Paul", "Thérèse", "Joseph", "Julienne", "Thomas", "Cécile",
    "Emmanuel", "Philomène", "Antoine", "Clémentine", "David", "Ange", "Léon",
    "Eugénie", "Sènan", "Lionnelle", "Rachidi", "Bénédicte", "Gilles", "Edwige",
]

GUESTS_LAST_NAMES = [
    "Agossou", "Hounsou", "Akpakpo", "Dossou", "Sossou", "Gbèdji", "Zinsou",
    "Hountondji", "Soglo", "Tchibozo", "Adjinacou", "Gandonou", "Kpadé",
    "Yéhouénou", "Sagbohan", "Ahouandjinou", "Amoussou", "Agblonon",
]

GUEST_GROUPS = ["Famille", "Amis", "Travail", "Témoins", "Famille éloignée"]


def build_guests_for_wedding(wedding_index: int) -> list[dict[str, Any]]:
    """Generate 12-20 realistic guests for a wedding."""
    rng = random.Random(42 + wedding_index)
    count = rng.randint(12, 20)
    guests = []
    for i in range(count):
        first = rng.choice(GUESTS_FIRST_NAMES)
        last = rng.choice(GUESTS_LAST_NAMES)
        email = f"{first.lower()}.{last.lower()}.{i}@example.com"
        group = rng.choice(GUEST_GROUPS)
        attending = rng.choice([True, True, True, False, None])
        plus_one = rng.random() < 0.3
        plus_one_name = ""
        if plus_one:
            plus_one_name = f"{rng.choice(GUESTS_FIRST_NAMES)} {rng.choice(GUESTS_LAST_NAMES)}"
        diet = ""
        if rng.random() < 0.15:
            diet = rng.choice(["Végétarien", "Sans gluten", "Halal", "Allergique aux fruits de mer"])
        table = rng.randint(1, 15) if attending else None
        guests.append({
            "first_name": first,
            "last_name": last,
            "email": email,
            "phone": f"+229 {rng.randint(91, 99)} {rng.randint(10, 99)} {rng.randint(10, 99)} {rng.randint(10, 99)}",
            "group_name": group,
            "dietary_restrictions": diet,
            "is_attending": attending,
            "plus_one": plus_one,
            "plus_one_name": plus_one_name,
            "table_number": table,
            "notes": "",
            "created_at": dt(2025, rng.randint(1, 6), rng.randint(1, 28)),
        })
    return guests


# ---------------------------------------------------------------------------
# Messages per wedding — Beninese French
# ---------------------------------------------------------------------------

MESSAGES_DATA: list[list[dict[str, Any]]] = [
    # Wedding 0: Espérance & Marcel
    [
        {
            "content": (
                "Bonjour Mélissa ! Nous avons hâte de commencer l'organisation. "
                "Pouvez-vous nous envoyer le planning des prochaines étapes ?"
            ),
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 2, 5, 10, 30),
        },
        {
            "content": (
                "Bonjour Espérance ! Bien sûr, je vous envoie cela aujourd'hui même. "
                "Voici le planning détaillé avec nos prochains rendez-vous. Au "
                "programme : visite du Palais des Congrès le 15 février !"
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 2, 5, 14, 15),
        },
        {
            "content": (
                "Super, merci ! Est-ce que vous pouvez aussi nous aider pour "
                "la cérémonie de dot ? On ne sait pas trop par où commencer."
            ),
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 2, 10, 9, 0),
        },
        {
            "content": (
                "Bien sûr ! C'est une étape importante. Je vous mets en contact "
                "avec un spécialiste des traditions fons. On peut organiser ça "
                "pour le mois prochain si vous voulez."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 2, 10, 11, 30),
        },
    ],
    # Wedding 1: Gildas & Arsène
    [
        {
            "content": (
                "Bonjour, on veut un thème bohème avec beaucoup de tissus "
                "vaporeux. Est-ce que vous avez des références de décorateurs ?"
            ),
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 5, 12, 9, 0),
        },
        {
            "content": (
                "Bonjour Gildas ! Avec plaisir, je vous envoie le portfolio de "
                "trois décorateurs avec qui nous travaillons régulièrement. "
                "Leurs styles sont différents : épuré, luxuriant et bohème."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 5, 12, 11, 45),
        },
        {
            "content": "Ils sont tous magnifiques ! On a un coup de cœur pour Atelier Fleurs.",
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 5, 13, 8, 30),
        },
        {
            "content": (
                "Parfait, je vous organise un rendez-vous la semaine prochaine. "
                "Je vous propose mercredi à 14h ou vendredi à 10h."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 5, 13, 10, 0),
        },
    ],
    # Wedding 2: Judicaël & Bénédicte
    [
        {
            "content": (
                "Salut ! On pense à une cérémonie au coucher du soleil sur le "
                "lac Nokoué. C'est réalisable niveau logistique ?"
            ),
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 8, 20, 16, 0),
        },
        {
            "content": (
                "Oui tout à fait ! Les couchers de soleil sur le lac sont "
                "magnifiques en juin. Je m'occupe des autorisations pour "
                "la plateforme sur pilotis."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 8, 21, 8, 15),
        },
        {
            "content": "Génial ! Et pour le plan B en cas de pluie, vous avez une idée ?",
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 8, 21, 10, 0),
        },
        {
            "content": (
                "On peut utiliser la grande salle intérieure de l'Hôtel du Lac "
                "qui a une vue panoramique. Rassurez-vous, on a tout prévu !"
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 8, 21, 11, 30),
        },
    ],
    # Wedding 3: Pélagie & Blaise
    [
        {
            "content": (
                "Bonjour, on veut quelque chose d'artistique et romantique. "
                "La Fondation Zinsou nous plaît énormément."
            ),
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 11, 8, 14, 30),
        },
        {
            "content": (
                "Bonjour Pélagie ! Excellent choix. La Fondation Zinsou est "
                "un cadre unique. On peut organiser une visite avec le "
                "commissaire pour voir les espaces disponibles."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 11, 8, 16, 0),
        },
        {
            "content": "Super ! On peut visiter samedi ?",
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 11, 9, 9, 15),
        },
        {
            "content": "Visite programmée ce samedi à 11h. Très belle journée !",
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 11, 9, 11, 0),
        },
    ],
    # Wedding 4: Romuald & Fidèle
    [
        {
            "content": (
                "Bonjour Mélissa, nous aimerions un mariage de luxe avec "
                "orchestre et feu d'artifice. C'est possible à l'Hôtel Bel Azur ?"
            ),
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 6, 5, 10, 0),
        },
        {
            "content": (
                "Bonjour Romuald ! Oui, tout à fait. L'Hôtel Bel Azur a une "
                "grande plage privée parfaite pour le feu d'artifice. "
                "Je connais un excellent orchestre afro-jazz qui s'y produit."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 6, 5, 11, 30),
        },
        {
            "content": "Parfait ! Et pour le menu, on peut avoir un mix gastronomique ?",
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 6, 6, 9, 0),
        },
        {
            "content": (
                "Bien sûr ! Le chef de l'Hôtel Bel Azur propose un menu "
                "fusion franco-béninois. Je vous envoie les propositions "
                "pour dégustation."
            ),
            "is_from_admin": True, "is_read": True, "created_at": dt(2025, 6, 6, 10, 15),
        },
        {
            "content": "Super ! On valide tout ce week-end. Merci !",
            "is_from_admin": False, "is_read": True, "created_at": dt(2025, 6, 6, 12, 0),
        },
    ],
]

# ---------------------------------------------------------------------------
# Payments per wedding (in FCFA)
# ---------------------------------------------------------------------------

PAYMENTS_DATA: list[list[dict[str, Any]]] = [
    # Wedding 0: Espérance & Marcel
    [
        {"amount": Decimal("1000000"), "label": "Acompte - Coordination Complète", "category": "deposit",
         "due_date": date_(2025, 3, 1), "paid_date": date_(2025, 2, 25), "is_paid": True},
        {"amount": Decimal("1500000"), "label": "Deuxième versement - Prestations", "category": "installment",
         "due_date": date_(2025, 7, 1), "paid_date": date_(2025, 6, 28), "is_paid": True},
        {"amount": Decimal("1500000"), "label": "Troisième versement - Décoration", "category": "installment",
         "due_date": date_(2025, 10, 1), "paid_date": date_(2025, 9, 28), "is_paid": True},
        {"amount": Decimal("850000"), "label": "Solde final mariage", "category": "final",
         "due_date": date_(2025, 11, 20), "paid_date": date_(2025, 11, 18), "is_paid": True},
    ],
    # Wedding 1: Gildas & Arsène
    [
        {"amount": Decimal("800000"), "label": "Acompte Organisation Bohème", "category": "deposit",
         "due_date": date_(2025, 6, 1), "paid_date": date_(2025, 5, 28), "is_paid": True},
        {"amount": Decimal("1200000"), "label": "Deuxième versement", "category": "installment",
         "due_date": date_(2025, 10, 1), "paid_date": date_(2025, 9, 25), "is_paid": True},
        {"amount": Decimal("1200000"), "label": "Solde final", "category": "final",
         "due_date": date_(2026, 2, 14), "paid_date": date_(2026, 2, 10), "is_paid": True},
    ],
    # Wedding 2: Judicaël & Bénédicte
    [
        {"amount": Decimal("1000000"), "label": "Acompte Coordination Moderne", "category": "deposit",
         "due_date": date_(2025, 9, 1), "paid_date": date_(2025, 8, 25), "is_paid": True},
        {"amount": Decimal("1500000"), "label": "Deuxième versement", "category": "installment",
         "due_date": date_(2026, 1, 1), "paid_date": date_(2025, 12, 30), "is_paid": True},
        {"amount": Decimal("1480000"), "label": "Solde final", "category": "final",
         "due_date": date_(2026, 5, 28), "paid_date": date_(2026, 5, 25), "is_paid": True},
    ],
    # Wedding 3: Pélagie & Blaise
    [
        {"amount": Decimal("1500000"), "label": "Acompte Conciergerie", "category": "deposit",
         "due_date": date_(2025, 12, 1), "paid_date": date_(2025, 11, 28), "is_paid": True},
        {"amount": Decimal("2000000"), "label": "Deuxième versement", "category": "installment",
         "due_date": date_(2026, 4, 1), "paid_date": date_(2026, 3, 30), "is_paid": True},
        {"amount": Decimal("2000000"), "label": "Solde final", "category": "final",
         "due_date": date_(2026, 8, 12), "paid_date": date_(2026, 8, 10), "is_paid": True},
    ],
    # Wedding 4: Romuald & Fidèle
    [
        {"amount": Decimal("2000000"), "label": "Acompte Mariage de Luxe", "category": "deposit",
         "due_date": date_(2025, 7, 1), "paid_date": date_(2025, 6, 25), "is_paid": True},
        {"amount": Decimal("2500000"), "label": "Deuxième versement", "category": "installment",
         "due_date": date_(2025, 11, 1), "paid_date": date_(2025, 10, 28), "is_paid": True},
        {"amount": Decimal("1500000"), "label": "Troisième versement", "category": "installment",
         "due_date": date_(2026, 2, 1), "paid_date": date_(2026, 1, 25), "is_paid": True},
        {"amount": Decimal("1100000"), "label": "Solde final", "category": "final",
         "due_date": date_(2026, 3, 25), "paid_date": date_(2026, 3, 22), "is_paid": True},
    ],
]

# ---------------------------------------------------------------------------
# RDV Slots (future dates)
# ---------------------------------------------------------------------------

RDV_SLOTS_DATA: list[dict[str, Any]] = [
    {"start": dt(2026, 7, 21, 9, 0), "end": dt(2026, 7, 21, 10, 0), "slot_type": "discovery"},
    {"start": dt(2026, 7, 21, 10, 0), "end": dt(2026, 7, 21, 11, 0), "slot_type": "discovery"},
    {"start": dt(2026, 7, 23, 14, 0), "end": dt(2026, 7, 23, 15, 30), "slot_type": "quote"},
    {"start": dt(2026, 7, 23, 15, 30), "end": dt(2026, 7, 23, 17, 0), "slot_type": "quote"},
    {"start": dt(2026, 7, 25, 9, 0), "end": dt(2026, 7, 25, 10, 0), "slot_type": "discovery"},
    {"start": dt(2026, 7, 28, 14, 0), "end": dt(2026, 7, 28, 15, 0), "slot_type": "discovery"},
    {"start": dt(2026, 7, 30, 9, 0), "end": dt(2026, 7, 30, 10, 30), "slot_type": "quote"},
    {"start": dt(2026, 8, 4, 9, 0), "end": dt(2026, 8, 4, 10, 0), "slot_type": "discovery"},
    {"start": dt(2026, 8, 6, 14, 0), "end": dt(2026, 8, 6, 15, 30), "slot_type": "quote"},
    {"start": dt(2026, 8, 11, 9, 0), "end": dt(2026, 8, 11, 10, 0), "slot_type": "followup"},
    {"start": dt(2026, 8, 13, 14, 0), "end": dt(2026, 8, 13, 15, 0), "slot_type": "discovery"},
]

# ---------------------------------------------------------------------------
# Contact Messages
# ---------------------------------------------------------------------------

CONTACT_MESSAGES: list[dict[str, Any]] = [
    {
        "first_name": "Ange",
        "email": "ange.tchibozo@example.com",
        "phone": "+229 97 98 76 54",
        "event_type": "mariage",
        "guest_count": 100,
        "event_date": date_(2027, 6, 12),
        "budget_range": "2 500 000 - 4 000 000 FCFA",
        "service_type": "Coordination Complète",
        "message": (
            "Bonjour, nous nous marions en juin 2027 et nous cherchons une "
            "wedding planner pour nous accompagner. Pouvez-vous m'envoyer "
            "votre brochure et vos tarifs ? Merci d'avance !"
        ),
        "source": "instagram",
        "is_read": False,
    },
    {
        "first_name": "Sènan",
        "email": "senan.hountondji@example.com",
        "phone": "+229 97 87 65 43",
        "event_type": "mariage",
        "guest_count": 150,
        "event_date": date_(2027, 8, 20),
        "budget_range": "4 000 000 - 6 000 000 FCFA",
        "service_type": "Organisation Partielle",
        "message": (
            "Nous avons déjà réservé la salle mais nous avons besoin d'aide "
            "pour la coordination des prestataires. Est-ce que votre formule "
            "partielle correspond à notre besoin ?"
        ),
        "source": "google",
        "is_read": True,
    },
    {
        "first_name": "Lionnelle",
        "email": "lionnelle.sagbohan@example.com",
        "phone": "+229 97 12 34 56",
        "event_type": "mariage",
        "guest_count": 40,
        "event_date": date_(2027, 5, 8),
        "budget_range": "1 500 000 - 2 500 000 FCFA",
        "service_type": "Destination & Évasion",
        "message": (
            "Bonjour, nous cherchons une formule destination à Grand-Popo "
            "pour un petit mariage intimiste. Avez-vous des disponibilités ?"
        ),
        "source": "recommendation",
        "is_read": False,
    },
]

# ===================================================================
# Main seed logic
# ===================================================================


async def clear_data(session: AsyncSession) -> None:
    """Delete all data from tables in reverse dependency order."""
    print("  Clearing existing data...")
    tables = [
        "photo_tag_links",
        "moodboard_items",
        "rdv_bookings",
        "rdv_slots",
        "photo_tags",
        "gallery_photos",
        "messages",
        "payments",
        "guests",
        "documents",
        "checklist_items",
        "testimonials",
        "blog_posts",
        "weddings",
        "users",
        "services",
        "faqs",
        "partners",
        "tools",
        "contact_messages",
        "newsletter_subscribers",
    ]
    for table in tables:
        await session.execute(text(f"DELETE FROM {table}"))
    print("  Existing data cleared.")


async def seed_main() -> None:
    """Run the full seed."""
    print("  Initializing database tables...")
    await init_db()
    print("  Tables created.")

    async with AsyncSessionLocal() as session:
        # ── 0. Clear existing data ──────────────────────────────────────
        await clear_data(session)

        # ── 1. Users ────────────────────────────────────────────────────
        print("  Creating users...")
        users: list[User] = []
        for u in USERS:
            user = User(
                id=uid(),
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                first_name=u["first_name"],
                last_name=u["last_name"],
                phone=u.get("phone"),
                role=u["role"],
                is_active=True,
                is_verified=u.get("is_verified", False),
                avatar_url=u.get("avatar_url"),
                created_at=dt(2024, 8, 1),
                updated_at=dt(2024, 8, 1),
                last_login=dt(2024, 8, 1),
            )
            session.add(user)
            users.append(user)
        await session.flush()
        print(f"  Created {len(users)} users.")

        admin_user = users[0]

        # ── 2. Services ─────────────────────────────────────────────────
        print("  Creating services...")
        for svc in SERVICES:
            service = Service(
                id=uid(),
                title=svc["title"],
                slug=svc["slug"],
                subtitle=svc.get("subtitle"),
                description=svc["description"],
                icon_name=svc.get("icon_name"),
                image_url=svc.get("image_url"),
                price_from=svc.get("price_from"),
                is_custom=svc.get("is_custom", False),
                inclusions=svc.get("inclusions"),
                sort_order=svc.get("sort_order", 0),
                is_active=True,
                created_at=dt(2024, 7, 1),
            )
            session.add(service)
        await session.flush()
        print(f"  Created {len(SERVICES)} services.")

        # ── 3. Weddings ─────────────────────────────────────────────────
        print("  Creating weddings...")
        weddings: list[Wedding] = []
        for w in WEDDINGS:
            user = users[w["user_index"]]
            wedding = Wedding(
                id=uid(),
                user_id=user.id,
                partner_first_name=w["partner_first_name"],
                partner_last_name=w["partner_last_name"],
                wedding_date=w["wedding_date"],
                venue=w["venue"],
                guest_count=w["guest_count"],
                total_budget=w.get("total_budget"),
                spent_budget=w.get("spent_budget", Decimal("0")),
                style=w["style"],
                status=w["status"],
                progress_pct=w["progress_pct"],
                notes=w.get("notes"),
                created_at=dt(2024, 9, 1),
            )
            session.add(wedding)
            weddings.append(wedding)
        await session.flush()
        print(f"  Created {len(weddings)} weddings.")

        # ── 4. Gallery Photos & Tags ────────────────────────────────────
        print("  Creating gallery tags and photos...")
        tag_objs: list[PhotoTag] = []
        for t in PHOTO_TAGS:
            tag = PhotoTag(id=uid(), name=t["name"], slug=t["slug"])
            session.add(tag)
            tag_objs.append(tag)
        await session.flush()
        tag_map: dict[str, PhotoTag] = {t.name: t for t in tag_objs}

        photos: list[GalleryPhoto] = []
        for p in GALLERY_PHOTOS:
            photo = GalleryPhoto(
                id=uid(),
                title=p["title"],
                description=p.get("description"),
                image_url=p["image_url"],
                thumbnail_url=p.get("thumbnail_url"),
                width=p.get("width"),
                height=p.get("height"),
                venue=p.get("venue"),
                season=p.get("season"),
                rating=p.get("rating"),
                is_featured=p.get("is_featured", False),
                sort_order=p.get("sort_order", 0),
                created_at=dt(2025, 3, 1),
            )
            session.add(photo)
            photos.append(photo)
        await session.flush()

        link_count = 0
        for p, photo in zip(GALLERY_PHOTOS, photos):
            for tag_name in p.get("tags", []):
                tag = tag_map.get(tag_name)
                if tag:
                    link = PhotoTagLink(photo_id=photo.id, tag_id=tag.id)
                    session.add(link)
                    link_count += 1
        await session.flush()
        print(f"  Created {len(photos)} photos with {link_count} tag links.")

        # ── 5. Testimonials ─────────────────────────────────────────────
        print("  Creating testimonials...")
        for t in TESTIMONIALS:
            user_id = None
            if t.get("user_index") is not None:
                user_id = users[t["user_index"]].id
            testimonial = Testimonial(
                id=uid(),
                user_id=user_id,
                couple_names=t["couple_names"],
                wedding_date=t.get("wedding_date"),
                venue=t.get("venue"),
                style=t.get("style"),
                rating=t["rating"],
                content=t["content"],
                photo_url=t.get("photo_url"),
                is_verified=t.get("is_verified", False),
                is_featured=t.get("is_featured", False),
                sort_order=t.get("sort_order", 0),
                is_active=True,
                created_at=dt(2025, 11, 1),
            )
            session.add(testimonial)
        await session.flush()
        print(f"  Created {len(TESTIMONIALS)} testimonials.")

        # ── 6. Blog Posts ──────────────────────────────────────────────
        print("  Creating blog posts...")
        for b in BLOG_POSTS:
            post = BlogPost(
                id=uid(),
                author_id=admin_user.id,
                title=b["title"],
                slug=b["slug"],
                excerpt=b.get("excerpt"),
                content=b["content"],
                cover_image_url=b.get("cover_image_url"),
                category=b.get("category"),
                reading_time_minutes=b.get("reading_time_minutes"),
                is_published=b.get("is_published", False),
                published_at=b.get("published_at"),
                meta_title=b.get("meta_title"),
                meta_description=b.get("meta_description"),
                created_at=b.get("published_at", dt(2025, 6, 1)),
                updated_at=b.get("published_at", dt(2025, 6, 1)),
            )
            session.add(post)
        await session.flush()
        print(f"  Created {len(BLOG_POSTS)} blog posts.")

        # ── 7. FAQ ──────────────────────────────────────────────────────
        print("  Creating FAQ entries...")
        for f in FAQ_LIST:
            faq = FAQ(
                id=uid(),
                question=f["question"],
                answer=f["answer"],
                category=f["category"],
                sort_order=f.get("sort_order", 0),
                is_published=True,
                created_at=dt(2024, 7, 15),
            )
            session.add(faq)
        await session.flush()
        print(f"  Created {len(FAQ_LIST)} FAQ entries.")

        # ── 8. Partners ─────────────────────────────────────────────────
        print("  Creating partners...")
        for p in PARTNERS:
            partner = Partner(
                id=uid(),
                name=p["name"],
                logo_url=p["logo_url"],
                website_url=p.get("website_url"),
                specialty=p.get("specialty"),
                tier=p["tier"],
                sort_order=p.get("sort_order", 0),
                is_active=True,
                created_at=dt(2024, 7, 1),
            )
            session.add(partner)
        await session.flush()
        print(f"  Created {len(PARTNERS)} partners.")

        # ── 9. Tools ────────────────────────────────────────────────────
        print("  Creating tools...")
        for t in TOOLS:
            tool = Tool(
                id=uid(),
                name=t["name"],
                slug=t["slug"],
                description=t.get("description"),
                icon_name=t.get("icon_name"),
                category=t.get("category", "other"),
                url=t.get("url"),
                is_featured=t.get("is_featured", False),
                sort_order=t.get("sort_order", 0),
                is_active=True,
                created_at=dt(2024, 8, 1),
            )
            session.add(tool)
        await session.flush()
        print(f"  Created {len(TOOLS)} tools.")

        # ── 10. RDV Slots (future dates) ────────────────────────────────
        print("  Creating RDV slots...")
        for s in RDV_SLOTS_DATA:
            slot = RdvSlot(
                id=uid(),
                start_time=s["start"],
                end_time=s["end"],
                is_available=True,
                slot_type=s["slot_type"],
                created_at=dt(2026, 7, 1),
            )
            session.add(slot)
        await session.flush()
        print(f"  Created {len(RDV_SLOTS_DATA)} RDV slots.")

        # ── 11. Checklist Items per Wedding ─────────────────────────────
        print("  Creating checklist items...")
        checklist_count = 0
        for wi, wedding in enumerate(weddings):
            for item in CHECKLIST_ITEMS_DATA[wi]:
                w_date = WEDDINGS[wi]["wedding_date"]
                due = w_date + timedelta(days=item["due_date_offset"])
                completed_at = None
                if item["is_completed"]:
                    completed_at = dt(due.year, due.month, due.day, 12, 0) + timedelta(days=1)
                ci = ChecklistItem(
                    id=uid(),
                    wedding_id=wedding.id,
                    title=item["title"],
                    category=item["category"],
                    due_date=due,
                    is_completed=item["is_completed"],
                    completed_at=completed_at,
                    sort_order=0,
                    assigned_to="Mélissa Gbèdji",
                    created_at=dt(2024, 10, 1),
                )
                session.add(ci)
                checklist_count += 1
        await session.flush()
        print(f"  Created {checklist_count} checklist items.")

        # ── 12. Documents per Wedding ───────────────────────────────────
        print("  Creating documents...")
        doc_count = 0
        for wi, wedding in enumerate(weddings):
            for item in DOCUMENTS_DATA[wi]:
                doc = Document(
                    id=uid(),
                    wedding_id=wedding.id,
                    title=item["title"],
                    file_url=item["file_url"],
                    file_type=item["file_type"],
                    file_size=item.get("file_size"),
                    category=item["category"],
                    is_shared=item.get("is_shared", False),
                    created_at=dt(2024, 11, 1),
                )
                session.add(doc)
                doc_count += 1
        await session.flush()
        print(f"  Created {doc_count} documents.")

        # ── 13. Guests per Wedding ──────────────────────────────────────
        print("  Creating guests...")
        guest_count_total = 0
        for wi, wedding in enumerate(weddings):
            guests_data = build_guests_for_wedding(wi)
            for g in guests_data:
                guest = Guest(
                    id=uid(),
                    wedding_id=wedding.id,
                    first_name=g["first_name"],
                    last_name=g["last_name"],
                    email=g.get("email"),
                    phone=g.get("phone"),
                    group_name=g.get("group_name"),
                    dietary_restrictions=g.get("dietary_restrictions"),
                    is_attending=g.get("is_attending"),
                    plus_one=g.get("plus_one", False),
                    plus_one_name=g.get("plus_one_name"),
                    table_number=g.get("table_number"),
                    notes=g.get("notes"),
                    created_at=g.get("created_at", dt(2025, 1, 1)),
                )
                session.add(guest)
                guest_count_total += 1
        await session.flush()
        print(f"  Created {guest_count_total} guests.")

        # ── 14. Messages per Wedding ────────────────────────────────────
        print("  Creating messages...")
        msg_count = 0
        for wi, wedding in enumerate(weddings):
            client_user = users[WEDDINGS[wi]["user_index"]]
            for m in MESSAGES_DATA[wi]:
                sender_id = admin_user.id if m["is_from_admin"] else client_user.id
                message = Message(
                    id=uid(),
                    wedding_id=wedding.id,
                    user_id=sender_id,
                    content=m["content"],
                    is_from_admin=m["is_from_admin"],
                    is_read=m.get("is_read", True),
                    read_at=m["created_at"] + timedelta(hours=1) if m.get("is_read", True) else None,
                    created_at=m["created_at"],
                )
                session.add(message)
                msg_count += 1
        await session.flush()
        print(f"  Created {msg_count} messages.")

        # ── 15. Payments per Wedding ────────────────────────────────────
        print("  Creating payments...")
        pay_count = 0
        for wi, wedding in enumerate(weddings):
            for p in PAYMENTS_DATA[wi]:
                payment = Payment(
                    id=uid(),
                    wedding_id=wedding.id,
                    amount=p["amount"],
                    label=p["label"],
                    category=p["category"],
                    due_date=p["due_date"],
                    paid_date=p.get("paid_date"),
                    is_paid=p.get("is_paid", True),
                    notes="",
                    created_at=p.get("due_date", dt(2025, 1, 1)),
                )
                session.add(payment)
                pay_count += 1
        await session.flush()
        print(f"  Created {pay_count} payments.")

        # ── 16. Contact Messages ────────────────────────────────────────
        print("  Creating contact messages...")
        for cm in CONTACT_MESSAGES:
            contact = ContactMessage(
                id=uid(),
                first_name=cm["first_name"],
                email=cm["email"],
                phone=cm.get("phone"),
                event_type=cm.get("event_type"),
                guest_count=cm.get("guest_count"),
                event_date=cm.get("event_date"),
                budget_range=cm.get("budget_range"),
                service_type=cm.get("service_type"),
                message=cm.get("message"),
                source=cm.get("source"),
                is_read=cm.get("is_read", False),
                created_at=dt(2026, 7, 5),
            )
            session.add(contact)
        await session.flush()
        print(f"  Created {len(CONTACT_MESSAGES)} contact messages.")

        # ── 17. Newsletter Subscribers ──────────────────────────────────
        print("  Creating newsletter subscribers...")
        subscriber_emails = [
            "espérance.akpakpo@example.com",
            "gildas.hounsou@example.com",
            "futuremariee.benin@example.com",
            "pauline.bioka@example.com",
        ]
        for i, email in enumerate(subscriber_emails):
            sub = NewsletterSubscriber(
                id=uid(),
                email=email,
                is_active=(i < 3),
                created_at=dt(2026, 1, 1),
            )
            session.add(sub)
        await session.flush()
        print(f"  Created {len(subscriber_emails)} newsletter subscribers.")

        # ── Final commit ───────────────────────────────────────────────
        await session.commit()

        print()
        print("=" * 55)
        print("  Seed completed successfully!")
        print("=" * 55)
        print(f"  Users:               {len(USERS)}")
        print(f"  Weddings:            {len(weddings)}")
        print(f"  Services:            {len(SERVICES)}")
        print(f"  Photos:              {len(photos)}")
        print(f"  Photo tags:          {len(PHOTO_TAGS)}")
        print(f"  Testimonials:        {len(TESTIMONIALS)}")
        print(f"  Blog posts:          {len(BLOG_POSTS)}")
        print(f"  FAQ:                 {len(FAQ_LIST)}")
        print(f"  Partners:            {len(PARTNERS)}")
        print(f"  Tools:               {len(TOOLS)}")
        print(f"  RDV slots:           {len(RDV_SLOTS_DATA)}")
        print(f"  Checklist items:     {checklist_count}")
        print(f"  Documents:           {doc_count}")
        print(f"  Guests:              {guest_count_total}")
        print(f"  Messages:            {msg_count}")
        print(f"  Payments:            {pay_count}")
        print(f"  Contact messages:    {len(CONTACT_MESSAGES)}")
        print(f"  Newsletter subs:     {len(subscriber_emails)}")
        print("=" * 55)
        print("  Identifiants:")
        print("    Admin:  admin@everafterevents.com / Admin1234")
        print("    Client: espérance.akpakpo@example.com / Client1234")
        print("=" * 55)


def main() -> None:
    """Entry point."""
    print("Ever After Events -- Database Seed")
    print()
    asyncio.run(seed_main())


if __name__ == "__main__":
    main()
