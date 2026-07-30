**Render Deployment**

- Backend start command: `bash app/api/gunicorn_start.sh`
- Build backend: ensure `pip install -r app/api/requirements.txt` runs during build
- Frontend build: `cd app/frontend && npm install && npm run build` (publishes `dist`)

Environment variables (set in Render dashboard for the backend service):

- `DATABASE_URL` : set this to your Postgres connection string (do NOT commit this to git). Example format:
  `postgresql://<user>:<password>@<host>:<port>/<db>`

To test locally in the backend venv:

```bash
cd app/api
source .venv/bin/activate
export DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
./gunicorn_start.sh
```

To build the frontend for production (Vite will pick up `.env.production`):

```bash
cd app/frontend
npm ci
npm run build
```

Notes:
- The frontend reads `VITE_API_BASE` in production. `app/frontend/.env.production` sets it to `https://ai-lead-generator-7uou.onrender.com`.
- Keep secrets out of the repository; set them via the Render dashboard or your CI secrets.
