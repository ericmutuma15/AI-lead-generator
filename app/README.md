# AI Lead Capture & Insights Platform

This workspace contains a scaffold for the AI Lead Capture & Insights Platform defined in the project PRD.

## Architecture

- `backend/` - Flask API and database model for lead capture, storage, and analytics.
- `frontend/` - React + Vite dashboard for lead overview, lead table, and basic analytics.
- `docker-compose.yml` - Optional local Postgres development service.

## Setup

### Backend

1. Create a Python virtual environment:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run the backend:
   ```bash
   flask run
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Notes

- The backend uses `DATABASE_URL` for PostgreSQL and falls back to SQLite for local development.
- The frontend connects to the backend at `http://localhost:5000/api`.
- This scaffold implements the MVP features described in the PRD: lead capture storage, lead list, status tracking, and dashboard analytics.
