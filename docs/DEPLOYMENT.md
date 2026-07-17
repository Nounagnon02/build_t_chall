# Guide de Déploiement — Supabase + Render

## Pré-requis

1. **Compte Supabase** — https://supabase.com
2. **Compte Render** — https://render.com
3. **Repo GitHub** de ce projet déjà poussé

---

## 1. Créer la base de données Sur Supabase

1. Sur https://supabase.com/dashboard → **New project**
2. Choose organization, nom du projet (ex: `ever-after-events`)
3. Database password : générer un secret fort (garder en lieu sûr)
4. Region : **Frankfurt** (le plus proche du Bénin / Europe)
5. Wait ~2 minutes pour la création

### Récupérer la connection string

1. Dashboard Supabase → **Project Settings** (icône engrenage)
2. **Database** section
3. Trouver **Connection string**
4. Cliquer sur **URI** (pas "Connection pooler" pour le moment)

La valeur ressemble à :
```
postgresql://postgres.[ref]:[PASSWORD]@[HOST]:5432/postgres
```

Ajouter `+asyncpg` au début pour le backend async :
```
postgresql+asyncpg://postgres.[ref]:[PASSWORD]@[HOST]:5432/postgres
```

> **Note** : Le mot de passe peut contenir des caractères spéciaux (`/`, `@`, etc.) qui doivent être URL-encoded par SQLAlchemy automatiquement. Supabase fournit déjà une version safe.

---

## 2. Déployer le backend Sur Render

### Créer le service

1. Sur Render → **New** → **Web Service**
2. Connect GitHub → choisir ce repo
3. Configuration :

| Champ | Valeur |
|-------|--------|
| **Name** | `ever-after-events-api` |
| **Region** | Frankfurt |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Environment** | `Production` |
| **Instance Type** | `Free` |

### Variables d'environnement

Ajouter les variables suivantes dans l'onglet **Environment** :

```
# Application
ENVIRONMENT=production
DEBUG=false
APP_NAME=Ever After Events API
APP_VERSION=1.0.0

# Database (copier depuis Supabase)
DATABASE_URL=postgresql+asyncpg://postgres.[ref]:[PASSWORD]@[HOST]:5432/postgres

# Sécurité (générer une vraie clé)
SECRET_KEY=<généré ci-dessous>

# CORS (mettre l'URL du frontend une fois déployé)
CORS_ORIGINS=https://build-t-chall-tckt-kp-tech.vercel.app

# Rate limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_CONTACT_PER_MINUTE=5

# Token expiry
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# OpenAI (optionnel, pour le chatbot)
OPENAI_API_KEY=sk-...

# Email (optionnel, Resend)
RESEND_API_KEY=resend_...

# Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Sentry (optionnel)
SENTRY_DSN=https://...
```

### Générer SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Copier la sortie dans `SECRET_KEY`.

### Healthcheck

Render détecte automatiquement `/health` depuis `main.py`. Si besoin de forcer :
```
Health Check Path: /health
```

### Déploiement

Cliquer sur **Create Web Service**. Le déploiement prend ~3-5 minutes.

---

## 3. Déployer le frontend Sur Vercel

### Création du projet

1. Vercel → **Add New** → **Project**
2. Import GitHub repo → Configure
3. **Framework Preset** : Vite
4. Les autres champs sont auto-détectés

### Variables d'environnement

```
VITE_API_URL=https://ever-after-events-api.onrender.com/api/v1
VITE_SITE_URL=https://ever-after-events.vercel.app
```

### Deploy

Cliquer sur **Deploy**. ~1 minute.

---

## 4. Seed la base de données (optionnel — données de démo)

Le schéma est créé automatiquement au premier boot (`init_db()` dans `lifespan`), donc **point fonctionnel sans seed**.

Pour ajouter les données de démo (**admin + contenus + mariages fictifs**), deux options :

### Option A : Via un déploiement temporaire avec cache

```bash
# Local — configurer DATABASE_URL vers Supabase
cd backend
cp backend/.env .env

# Éditer .env avec la connection Supabase
vi .env

# Installer les dépendances
pip install -r requirements.txt

# Seeder
python seed.py
```

### Option B : Via Render Dashboard — Console

1. Render → Dashboard du service backend → **Console**
2. Exécuter :

```bash
cd backend
python seed.py
```

> ⚠️ **Attention** : `seed.py` **efface toutes les données existantes** avant d'insérer. À faire uniquement en début de projet, jamais sur une base en production avec des vrais clients.

### Vérifier le seed

Se connecter avec :
- Email : `admin@everafterevents.com`
- Mot de passe : `Admin1234`

---

## 5. Post-déploiement

### Vérifications

1. **Healthcheck** : `GET https://ever-after-events-api.onrender.com/health` → `{"status": "ok"}`
2. **API Swagger** : `GET https://ever-after-events-api.onrender.com/docs` (si DEBUG=true)
3. **Frontend** : Ouvrir `https://ever-after-events.vercel.app` → navigation OK

### Updating SECRET_KEY

Le `SECRET_KEY` actuel est une valeur de démo. **Toujours générer une vraie clé avant un vrai déploiement** :

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Mettre à jour :
- Render → Environment → `SECRET_KEY`
- Reconstruire le service (Render le fait auto)

### First login au dashboard admin

URL : `https://ever-after-events.vercel.app/admin/login`

```
Email: admin@everafterevents.com
Password: Admin1234
```

**Immédiatement après** : changer le mot de passe via l'interface admin.

---

##穿搭 Résumé des URLs

| Service | URL |
|---------|-----|
| Frontend | `https://ever-after-events.vercel.app` |
| Backend API | `https://ever-after-events-api.onrender.com` |
| Docs API | `https://ever-after-events-api.onrender.com/docs` |
| Supabase Dashboard | `https://app.supabase.com/project/[ref]/dashboard` |

---

## Dépannage

### "502 Bad Gateway" sur Render
- Vérifier que `DATABASE_URL` est correct dans les variables d'environnement
- Logs : Render → Events → voir si démarrage avec erreur DB

### CORS errors depuis le frontend
- Ajouter l'URL du frontend à `CORS_ORIGINS` sur Render : `https://ever-after-events.vercel.app`

### "relation does not exist"
- Le schéma n'a pas été créé : `init_db()` n'a pas tourné
- Check logs Render pour voir si `init_db()` est appelé
- Forcer : `DATABASE_URL=... python -c "from seed import init_db; asyncio.run(init_db())"`

### Seed échoue avec "unique constraint"
- La BDD contient déjà des données : soit `seed.py` qui n'efface pas proprement, soit un professeur manuel
- Solution temporaire : `DELETE FROM <table>;` manuellement via Supabase SQL Editor