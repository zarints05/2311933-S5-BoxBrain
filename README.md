# BoxBrain 📦

BoxBrain remembers what's inside your boxes and where you put them. Give every cardboard box, suitcase, plastic container, drawer or cupboard a number and a list of contents, stick a QR label on it, and later scan the label with your phone camera to see what's inside without opening it.

```
BOX 17
📍 Storage Room
🏷️ Winter clothes

Contents:
• 3 sweaters
• Jacket
• Scarf
• Gloves
• Boots
```

Or just ask where something is:

```
Search: passport
→ Box 4 "Documents" → Bedroom → Cupboard → Top shelf
```

When you're moving, BoxBrain can also list every box you haven't opened in 12 months, so you can decide what's worth carrying.

> **Status:** Planning. The PRD, SRS and TDD are done. MVP development starts next.

## Features

### MVP (demo before mid-term)

- Nested locations (Bedroom → Cupboard → Top shelf)
- Boxes with a number, label, type, location and notes
- Items inside boxes with name, quantity and notes; move items between boxes
- A QR code for every box and a printable label
- Scan the QR with any phone camera to open the box page
- "Where is my X?" search that shows the box and its full location path
- Mark a box as opened, and list boxes not opened for 3, 6, 12 or 24 months
- One shared demo inventory (no accounts yet), Supabase PostgreSQL in production, SQLite locally, deployed on Vercel

### Beta (demo before final)

- Sign up and log in (JWT + refresh token), profile with name and password change
- Private households shared with family or flatmates, with `owner` and `member` roles
- QR links only open for members of the box's household
- Photos of boxes and items (private, signed URLs)
- Box history: created, opened, moved, edited and by whom
- Moving mode: packed, in transit, unpacked, destination room and a progress summary
- Label sheets with 21 QR labels per A4 page
- Typo-tolerant search
- Admin dashboard with service stats (no access to anyone's inventory), ban / unban users
- Security hardening: rate limits, login lockout, CORS and security headers

Out of scope this semester: automated tests, CI/CD, native apps, an in-app scanner, offline mode and notifications.

## Tech stack

| Part | Technology |
|---|---|
| Backend | FastAPI, SQLModel |
| Database | Supabase PostgreSQL (production), SQLite (local) |
| QR codes | `segno` (SVG) |
| Frontend | React + Vite, React Router |
| Hosting | Vercel |
| Beta | Alembic, PyJWT, Argon2, Supabase Storage, `pg_trgm` |

## Documentation

| Document | What it covers |
|---|---|
| [Product Requirements Document (PRD)](docs/01-prd.md) | Problem, goals, users, scope, features, user stories, metrics, milestones |
| [Software Requirements Specification (SRS)](docs/02-srs.md) | Functional and non-functional requirements, validation, permissions, acceptance criteria, traceability |
| [Technical Design Document (TDD)](docs/03-tdd.md) | Architecture, data model, QR codes and labels, search, API, security, deployment |

## Project structure

```
boxbrain/
├── api/            # FastAPI backend (Vercel serverless function)
├── frontend/       # React + Vite app
├── scripts/        # Seed script with sample locations, boxes and items
├── docs/           # PRD, SRS, TDD
├── requirements.txt
└── vercel.json
```

## Run locally

You need Python 3.11+ and Node.js 20+.

**Backend**

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then fill in the values
python scripts/seed.py           # creates tables and sample data
uvicorn api.index:app --reload --port 8000
```

API docs are at http://localhost:8000/api/docs.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and sends `/api` requests to the backend.

To test QR scanning from your phone during development, set `APP_BASE_URL` to your computer's local network address (for example `http://192.168.0.10:5173`) and keep the phone on the same Wi-Fi.

## Environment variables

| Variable | Release | Description |
|---|---|---|
| `DATABASE_URL` | MVP | `sqlite:///./boxbrain.db` locally, Supabase pooler URL in production |
| `APP_BASE_URL` | MVP | Public app URL that goes inside every QR code |
| `FRONTEND_ORIGIN` | MVP | Frontend URL, used for CORS |
| `JWT_SECRET` | Beta | Long random secret for signing tokens |
| `ACCESS_TOKEN_MINUTES` | Beta | Access token lifetime, default `15` |
| `REFRESH_TOKEN_DAYS` | Beta | Refresh token lifetime, default `7` |
| `SUPABASE_URL` | Beta | Supabase project URL (Storage) |
| `SUPABASE_SERVICE_KEY` | Beta | Server-only key for uploads and signed URLs |
| `STORAGE_BUCKET` | Beta | Private bucket for photos |

Secrets live in your local `.env` file and in Vercel's environment variables. **Never commit them to Git.**

## Deploy to Vercel

1. Import this repository in Vercel.
2. Add the environment variables above for Preview and Production.
3. For `DATABASE_URL`, use Supabase's transaction pooler connection string (port 6543).
4. Set `APP_BASE_URL` to the final production URL **before printing any labels**, since it's baked into every QR code.
5. Push to a branch to get a preview deployment. Merging into `main` deploys to production.

`vercel.json` sends `/api/*` to the FastAPI app and everything else to the React build (with a fallback to `index.html`, so QR links like `/b/<token>` work), which is why the API docs live at `/api/docs`.

## Contributing

- Branch names: `name/#{issue_number}-{task-title}`, for example `rifat/#1-create-prd-srs-tdd-and-update-readme`
- Commit messages follow Conventional Commits: `<type>: <summary> (#issue)`, for example `docs: write PRD for MVP and Beta (#1)`
- Every change goes through a pull request that links its issue with `Closes #<number>`
