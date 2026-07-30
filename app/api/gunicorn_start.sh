#!/usr/bin/env bash
set -euo pipefail

# Change to this script's directory (so module imports work reliably)
cd "$(dirname "$0")"

# Configuration (can be overridden via environment)
WORKERS="${WEB_CONCURRENCY:-2}"
TIMEOUT="${TIMEOUT:-120}"
PORT="${PORT:-5000}"
BIND="0.0.0.0:${PORT}"

echo "Starting Gunicorn on ${BIND} with ${WORKERS} workers (timeout ${TIMEOUT}s)"

exec gunicorn --workers "$WORKERS" --bind "$BIND" --timeout "$TIMEOUT" "wsgi:application"
