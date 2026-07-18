"""Chat endpoint — proxies AI requests to Google Gemini securely from the backend."""

from __future__ import annotations

import os
from typing import List, Optional

from fastapi import APIRouter, HTTPException, status
from httpx import AsyncClient
from pydantic import BaseModel

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent"
)

SYSTEM_PROMPT = (
    "Tu es Eva, l'assistante virtuelle d'Ever After Events, une agence de "
    "mariages & événements premium basée au Bénin.\n\n"
    "Ton rôle :\n"
    "- Répondre aux questions sur les services, tarifs (en FCFA), processus "
    "et disponibilités\n"
    "- Guider les couples dans la préparation de leur mariage au Bénin\n"
    "- Proposer des rendez-vous gratuits et sans engagement\n"
    "- Rester chaleureuse, élégante et professionnelle\n\n"
    "Informations clés :\n"
    "- Prestations : Coordination Complète (dès 2 500 000 FCFA), "
    "Organisation Partielle (dès 1 200 000 FCFA), Décoration & Scénographie, "
    "Conciergerie Mariage, Destination & Évasion, Animation Musicale, "
    "Design Graphique\n"
    "- Premier RDV : gratuit et sans engagement, réservable sur /rendez-vous\n"
    "- Contact : contact@everafterevents.com | +229 01 23 45 67\n"
    "- Basée à Cotonou, Bénin — interventions dans toute la sous-région\n"
    "- Galerie disponible sur /galerie\n"
    "- FAQ sur /faq\n\n"
    "Réponds toujours en français, de façon concise (max 3 phrases), "
    "chaleureuse et élégante. Si tu ne sais pas, oriente vers le contact "
    "ou le RDV."
)


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "model"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    response: str
    provider: str = "gemini"


@router.post("/ask", response_model=ChatResponse)
async def ask_chat(req: ChatRequest):
    """Send a message to the Gemini AI and return the response."""
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="L'assistant IA n'est pas configuré. Contactez l'administrateur.",
        )

    # Build conversation contents
    contents = []
    if req.history:
        for msg in req.history:
            role = "model" if msg.role in ("assistant", "model") else "user"
            contents.append({"role": role, "parts": [{"text": msg.content}]})

    contents.append({"role": "user", "parts": [{"text": req.message}]})

    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "maxOutputTokens": 512,
            "temperature": 0.7,
        },
    }

    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"

    async with AsyncClient(timeout=30) as client:
        resp = await client.post(url, json=payload)

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erreur du service IA : {resp.status_code}",
        )

    data = resp.json()
    text = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )

    if not text:
        text = "Je suis désolée, je n'ai pas pu traiter votre demande."

    return ChatResponse(response=text)
