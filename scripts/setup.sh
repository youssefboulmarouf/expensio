#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
API_DIR="$ROOT_DIR/apps/api"

PG_HOST=localhost
PG_PORT=5432
PG_USER=dev
PG_PASS=dev
PG_DB=expensio

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=dev

ok()   { echo -e "${GREEN}✓ $*${NC}"; }
err()  { echo -e "${RED}✗ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠ $*${NC}"; }
info() { echo -e "${BOLD}→ $*${NC}"; }

echo ""
echo -e "${BOLD}Expensio Local Setup${NC}"
echo "========================"
echo ""

# --- Postgres check ---
info "Checking Postgres at $PG_HOST:$PG_PORT..."

pg_reachable() {
  if command -v psql >/dev/null 2>&1; then
    PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres -c '\q' >/dev/null 2>&1
  elif command -v pg_isready >/dev/null 2>&1; then
    pg_isready -h "$PG_HOST" -p "$PG_PORT" -q 2>/dev/null
  elif command -v nc >/dev/null 2>&1; then
    nc -z "$PG_HOST" "$PG_PORT" 2>/dev/null
  else
    err "No tool found to check Postgres (need psql, pg_isready, or nc)"
    exit 1
  fi
}

if pg_reachable; then
  ok "Postgres is reachable"
else
  err "Postgres is not reachable at $PG_HOST:$PG_PORT"
  echo ""
  echo -e "${YELLOW}Start it with Docker:${NC}"
  echo ""
  echo "  docker run -d --name expensio-postgres \\"
  echo "    -e POSTGRES_USER=$PG_USER \\"
  echo "    -e POSTGRES_PASSWORD=$PG_PASS \\"
  echo "    -e POSTGRES_DB=$PG_DB \\"
  echo "    -p ${PG_PORT}:5432 \\"
  echo "    postgres:16-alpine"
  echo ""
  exit 1
fi

# --- Redis check ---
info "Checking Redis at $REDIS_HOST:$REDIS_PORT..."

redis_reachable() {
  if command -v redis-cli >/dev/null 2>&1; then
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASS" ping 2>/dev/null | grep -q "PONG"
  elif command -v nc >/dev/null 2>&1; then
    nc -z "$REDIS_HOST" "$REDIS_PORT" 2>/dev/null
  else
    err "No tool found to check Redis (need redis-cli or nc)"
    exit 1
  fi
}

if redis_reachable; then
  ok "Redis is reachable"
else
  err "Redis is not reachable at $REDIS_HOST:$REDIS_PORT"
  echo ""
  echo -e "${YELLOW}Start it with Docker:${NC}"
  echo ""
  echo "  docker run -d --name expensio-redis \\"
  echo "    -p ${REDIS_PORT}:6379 \\"
  echo "    redis:7-alpine redis-server --requirepass $REDIS_PASS"
  echo ""
  exit 1
fi

# --- Create database if needed ---
info "Checking database '$PG_DB'..."

if command -v psql >/dev/null 2>&1; then
  DB_EXISTS=$(PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres \
    -tAc "SELECT 1 FROM pg_database WHERE datname='$PG_DB'" 2>/dev/null)
  if [ "$DB_EXISTS" = "1" ]; then
    ok "Database '$PG_DB' already exists"
  else
    if PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres \
        -c "CREATE DATABASE $PG_DB" >/dev/null 2>&1; then
      ok "Database '$PG_DB' created"
    else
      err "Failed to create database '$PG_DB' — check that user '$PG_USER' has CREATEDB privileges"
      exit 1
    fi
  fi
else
  warn "psql not found — Prisma will create the database during migration if needed"
fi

# --- Copy .env if needed ---
info "Checking apps/api/.env..."
if [ -f "$API_DIR/.env" ]; then
  warn "apps/api/.env already exists, skipping"
else
  cp "$API_DIR/.env.example" "$API_DIR/.env"
  ok "Created apps/api/.env from .env.example"
fi

# --- Install dependencies ---
info "Checking node_modules..."
if [ -d "$ROOT_DIR/node_modules" ]; then
  warn "node_modules already exists, skipping npm install"
else
  echo "Installing dependencies..."
  (cd "$ROOT_DIR" && npm install)
  ok "Dependencies installed"
fi

# --- Run migrations ---
info "Running database migrations..."
if (cd "$ROOT_DIR" && npm run db:migrate); then
  ok "Migrations complete"
else
  err "Migrations failed — check the output above"
  exit 1
fi

echo ""
echo -e "${GREEN}${BOLD}Setup complete!${NC}"
echo ""
echo "Start the dev servers:"
echo "  npm run dev"
echo ""
