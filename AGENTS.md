# AGENTS.md

Instructions for AI coding agents (and humans) working in this repo.

## Project

BoxBrain: FastAPI backend (`backend/`) + Vite/React/TypeScript frontend (`frontend/`), deployed together on Vercel (`vercel.json` routes `/api/*` to the backend).

- Requirements and design live in `docs/`: [Product Requirements Document (PRD)](docs/01-prd.md), [Software Requirements Specification (SRS)](docs/02-srs.md), [Technical Design Document (TDD)](docs/03-tdd.md). Each doc covers both releases; items are marked **MVP** or **Beta**. Read them before implementing a feature.
- Releases: **MVP** is demoed before the mid-term (box CRUD with search only); **Beta** is demoed before the final (accounts, households, QR labels, photos, moving mode, admin, security). Do not build Beta items while MVP work is in progress.
- Automated tests and CI/CD are out of scope for this semester.

## Branch naming

Every change starts from a GitHub issue. Branch names follow:

```
Zarin/#{issue_number}-{task_title}
```

Rules:
- `{issue_number}`: the GitHub issue number, prefixed with `#`.
- `{task_title}`: the issue title in lowercase kebab-case: letters, digits and `-` only, no spaces or punctuation, max ~50 characters.
- Always branch from an up-to-date `main`.

Examples:

| Issue | Branch |
|---|---|
| #2 docs: create PRD, SRS, TDD and update README for MVP and Beta | `Zarin/#2-create-prd-srs-tdd-and-update-readme` |
| #4 feat: build box CRUD REST API | `Zarin/#4-build-box-crud-rest-api` |

Create it (quote the name, because `#` starts a comment in many shells):

```bash
git switch main
git pull
git switch -c "Zarin/#4-build-box-crud-rest-api"
git push -u origin "Zarin/#4-build-box-crud-rest-api"
```

If there is no issue for the work yet, create the issue first, then the branch.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary> (#<issue_number>)
```

| Type | Use for |
|---|---|
| `feat` | A new feature or endpoint |
| `fix` | A bug fix |
| `docs` | Documentation only (`docs/`, README, AGENTS.md) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting only, no code meaning change |
| `chore` | Dependencies, config, tooling (`requirements.txt`, `package.json`, `vercel.json`) |

Rules:
- Summary in lowercase imperative mood ("add", not "added" or "adds"), no full stop, max ~72 characters.
- End with the issue reference, e.g. `(#4)`.
- One logical change per commit. If a change touches unrelated things, split it into separate commits.
- Never commit secrets, `.env` files, `node_modules/`, `.venv/`, `frontend/dist/` or `boxbrain.db`.

Examples:

```
docs: add SRS with functional and non-functional requirements (#2)
feat: add box crud api with sqlmodel and validation (#4)
fix: return 404 for missing box on patch (#7)
chore: add sqlmodel and psycopg to requirements (#4)
```

## Pull requests

- One pull request per issue, from the feature branch into `main`.
- PR title uses the same format as commits, e.g. `feat: build box crud rest api (#4)`.
- PR description must include `Closes #{issue_number}` so the issue closes on merge.
- Do not push directly to `main`.

## Running locally

```bash
# backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
fastapi dev main.py

# frontend
cd frontend
npm install
npm run dev
```
