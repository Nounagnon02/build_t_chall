"""Budget simulator endpoints — estimate wedding costs in real-time (FCFA/XOF)."""

from __future__ import annotations

from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from app.schemas import BudgetBreakdownItem, BudgetEstimateResponse

router = APIRouter()

# Base costs per region per person (FCFA)
REGION_COSTS = {
    "cotonou": {"base": 25000, "catering": 18000, "venue": 15000, "decoration": 7000, "photo": 5000, "music": 4000, "dress": 3000, "video": 2500, "stationery": 1500, "transport": 2000, "flowers": 3500, "other": 3000},
    "grand_popo": {"base": 22000, "catering": 16000, "venue": 13000, "decoration": 6000, "photo": 4500, "music": 3500, "dress": 2500, "video": 2000, "stationery": 1200, "transport": 2500, "flowers": 4000, "other": 2500},
    "ouidah": {"base": 23000, "catering": 17000, "venue": 14000, "decoration": 6500, "photo": 4800, "music": 3800, "dress": 2800, "video": 2200, "stationery": 1300, "transport": 2200, "flowers": 3800, "other": 2800},
    "porto_novo": {"base": 20000, "catering": 15000, "venue": 12000, "decoration": 5500, "photo": 4000, "music": 3000, "dress": 2500, "video": 2000, "stationery": 1000, "transport": 1800, "flowers": 3000, "other": 2200},
    "parakou": {"base": 18000, "catering": 13000, "venue": 10000, "decoration": 5000, "photo": 3500, "music": 3000, "dress": 2000, "video": 1800, "stationery": 1000, "transport": 1500, "flowers": 2500, "other": 2000},
    "ganvie": {"base": 21000, "catering": 15000, "venue": 11000, "decoration": 5500, "photo": 4000, "music": 3200, "dress": 2200, "video": 2000, "stationery": 1200, "transport": 2000, "flowers": 3000, "other": 2300},
    "other": {"base": 17000, "catering": 12000, "venue": 10000, "decoration": 4500, "photo": 3500, "music": 2800, "dress": 2000, "video": 1500, "stationery": 1000, "transport": 1500, "flowers": 2500, "other": 2000},
}

# Service type multipliers
SERVICE_MULTIPLIERS = {
    "coordination_complete": 1.0,
    "organization_partielle": 0.85,
    "decoration": 0.75,
    "evenement": 0.9,
}

BUDGET_CATEGORIES = [
    ("venue", "Lieu de réception"),
    ("catering", "Traiteur"),
    ("decoration", "Décoration"),
    ("photo", "Photographe"),
    ("video", "Vidéaste"),
    ("music", "Musique & Animation"),
    ("dress", "Robe & Costume"),
    ("flowers", "Fleurs"),
    ("stationery", "Papeterie"),
    ("transport", "Transport"),
    ("other", "Autres"),
]


@router.get("/estimate", response_model=BudgetEstimateResponse)
async def estimate_budget(
    guest_count: int = Query(default=100, ge=10, le=2000),
    service_type: str = Query(default="coordination_complete"),
    region: str = Query(default="cotonou"),
    db=None,
):
    """Estimate wedding budget based on guests, service type, and region (in FCFA)."""
    # Normalize inputs
    region_key = region.lower().replace(" ", "_")
    if region_key not in REGION_COSTS:
        region_key = "other"

    svc_mult = SERVICE_MULTIPLIERS.get(service_type, 1.0)
    costs = REGION_COSTS[region_key]

    breakdown = []
    total = Decimal(0)

    for key, label in BUDGET_CATEGORIES:
        per_person = costs.get(key, costs["base"])
        amount = Decimal(str(per_person * guest_count)) * Decimal(str(svc_mult))
        breakdown.append(BudgetBreakdownItem(
            category=key,
            label=label,
            amount=amount,
            percentage=0.0,  # calculated below
        ))
        total += amount

    # Calculate percentages
    if total > 0:
        for item in breakdown:
            item.percentage = float(item.amount / total * 100)

    # Add service fee
    service_fee = total * Decimal("0.12")
    breakdown.append(BudgetBreakdownItem(
        category="service_fee",
        label="Frais d'agence (12%)",
        amount=service_fee,
        percentage=float(service_fee / (total + service_fee) * 100),
    ))
    total += service_fee

    return BudgetEstimateResponse(
        total_estimated=total,
        breakdown=breakdown,
        guest_count=guest_count,
        service_type=service_type,
        region=region_key,
    )
