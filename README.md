# Ever After Events 🥂

**Agence de Mariages & Événements Premium** — Plateforme complète avec site vitrine, outils interactifs, espace client et back-office administratif.

## Stack

| Couche | Technologie |
|--------|------------|
| **Frontend** | React 18 + Vite 6 + Tailwind CSS 3.4 + Framer Motion 11 |
| **Backend** | Python 3.12 + FastAPI + SQLAlchemy 2.x async |
| **Base de données** | PostgreSQL (Supabase, prod) / SQLite (dev) |
| **Auth** | JWT (access + refresh token rotation) |
| **Déploiement** | Vercel (frontend) + Render (backend) + Supabase (DB) |

## 📁 Structure

```
ever_after_events/
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # UI components (common, layout, sections, chatbot)
│   │   ├── pages/         # 29 pages (public, client, admin)
│   │   ├── services/      # Axios API client
│   │   ├── utils/         # Constants, animations
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # Auth context
│   │   └── router/        # Protected/Admin routes
│   └── public/            # Static assets
├── backend/               # FastAPI REST API
│   ├── app/
│   │   ├── api/v1/        # 20+ endpoint modules
│   │   ├── core/          # Config, DB, security
│   │   ├── models/        # 20+ SQLAlchemy models
│   │   ├── schemas/       # Pydantic v2 schemas
│   │   └── services/      # Email, WebSocket
│   └── tests/             # Pytest async tests
├── vercel.json            # Vercel deploy config (frontend)
└── render.yaml            # Render Blueprint (backend)
```

## 🚀 Installation

### Prérequis
- Node 24+, pnpm
- Python 3.12+
- PostgreSQL (optionnel, SQLite par défaut)

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python seed.py                         # Crée les données de démo
python -m pytest tests/ -v             # 11 tests
uvicorn app.main:app --reload          # http://localhost:8000
```

### Frontend

```bash
cd frontend
pnpm approve-builds esbuild            # Une seule fois
pnpm install
pnpm dev                               # http://localhost:5173
pnpm build                             # Production build
```

### Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@everafterevents.com | Admin123! |
| Client | sophie.thomas@example.com | Test1234 |

## ✨ Fonctionnalités

### Site vitrine (11 sections)
- Hero avec animation particules · À propos · Services (5 offres) · Processus (5 étapes) · Galerie avec lightbox · Témoignages · Statistiques animées · Partenaires (8) · Équipe (4) · FAQ avec accordéon · Contact multi-étapes

### Outils interactifs
- **Quiz style** — 5 questions, résultat personnalisé
- **Configurateur** — Style + couleurs + ambiance
- **Simulateur budget** — Répartition visuelle
- **Moodboard** — Inspirations visuelles

### Espace client (8 pages)
Dashboard · Checklist · Budget · Invités · Documents · Messagerie · Album · Paramètres

### Admin (4 pages)
Dashboard · Clients · Contenu · Statistiques

### Autres pages (16)
Services · Galerie · Blog · BlogPost · Témoignages · FAQ · Contact · Mentions Légales · 404 · Connexion · Inscription · Quiz · Configurateur · Budget · Moodboard · Rendez-vous

### 🤖 Chatbot IA intégré
Assistant virtuel "Eva" avec réponses contextuelles sur les services, prix, disponibilités.

### 🎨 Design system
- Palette : Champagne, Charbon, Ivoire, Blush, Sauge, Perle
- Typographie : Playfair Display + Cormorant Garamond + Montserrat + Great Vibes
- Animations Framer Motion fluides

## 🔒 Sécurité

- JWT avec rotation des refresh tokens
- Hachage bcrypt des mots de passe
- Rate limiting (SlowAPI)
- Validation Pydantic v2
- CORS configuré
- Upload fichiers limité à 10MB

## 📊 Performances

- Code splitting (React.lazy + Suspense)
- Chunks vendor/motion/charts séparés
- Cache statique immutable (Vercel)
- Images lazy load
- Build ~500kB gzip

## 🌐 Déploiement

**1. Base de données — Supabase**
- Créer un projet Supabase → Project Settings → Database → "Connection string"
- Copier l'URL **Direct connection** (`:5432`) et passer en `postgresql+asyncpg://...`
- La poser en variable `DATABASE_URL` sur le service Render (et sur le `.env` local pour test prod)

**2. Frontend → Vercel**
```bash
vercel --prod
# Vercel détecte vercel.json (Vite) automatiquement
# Ajouter VITE_API_URL = https://ever-after-events-api.onrender.com/api/v1
```

**3. Backend → Render (Blueprint)**
```bash
# Connecter le repo dans le dashboard Render → New → Blueprint
# render.yaml est détecté automatiquement
# Renseigner les secrets marqués `sync: false` (SECRET_KEY, DATABASE_URL, CORS_ORIGINS…)
# Healthcheck : GET /health
```

⚠️ À la première mise en prod, le schéma est créé automatiquement (`Base.metadata.create_all`, idempotent) au boot. Pour les évolutions futures, utiliser Alembic — `DATABASE_URL` est lue par `alembic/env.py`.

## 📄 Licence

Projet privé — Ever After Events © 2026

---

Fièrement construit pour le [Build Together Challenge 2026](https://buildtogether.challenge/).
