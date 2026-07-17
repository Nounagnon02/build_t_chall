"""Email service using Resend API (with console fallback for development)."""

from __future__ import annotations

import logging

from app.core.config import settings

logger = logging.getLogger("ever_after_events.email")


async def send_email(
    to: str,
    subject: str,
    html_content: str,
    from_email: str = "noreply@everafterevents.com",
) -> bool:
    """
    Send an email via Resend API.
    Falls back to console logging in development.
    """
    if settings.is_development or not settings.RESEND_API_KEY:
        logger.info("Email to %s — subject: %s — preview: %s...", to, subject, html_content[:200])
        return True

    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": from_email,
                    "to": [to],
                    "subject": subject,
                    "html": html_content,
                },
            )
            response.raise_for_status()
            return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, e)
        return False


async def send_contact_confirmation(first_name: str, email: str) -> bool:
    """Send confirmation email after contact form submission."""
    html = f"""<!DOCTYPE html>
<html>
<body style="font-family: 'Montserrat', sans-serif; background: #FAF6F1; padding: 40px;">
<div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
<div style="background: #1A1A2E; padding: 32px; text-align: center;">
<h1 style="color: #C9A96E; font-family: 'Playfair Display', serif; margin: 0;">Ever After Events</h1>
<p style="color: #FAF6F1; font-style: italic;">Merci de nous avoir contactés</p>
</div>
<div style="padding: 32px;">
<p>Bonjour {first_name},</p>
<p>Nous avons bien reçu votre message et nous vous remercions de l'intérêt que vous portez à Ever After Events.</p>
<p>Notre équipe vous répondra sous <strong>24 heures maximum</strong>.</p>
<p>En attendant, n'hésitez pas à :</p>
<ul>
<li>Découvrir nos <a href="https://everafterevents.com/services">services</a></li>
<li>Utiliser notre <a href="https://everafterevents.com/simulateur-budget">simulateur de budget</a></li>
<li>Consulter notre <a href="https://everafterevents.com/faq">FAQ</a></li>
</ul>
<p>A très vite,</p>
<p><strong>L'équipe Ever After Events</strong></p>
</div>
<div style="background: #F0ECE8; padding: 16px; text-align: center; font-size: 12px; color: #666;">
<p>Ever After Events — Agence de Mariages & Événements Premium</p>
</div>
</div>
</body>
</html>"""
    return await send_email(to=email, subject="Nous avons reçu votre message ✨", html_content=html)
