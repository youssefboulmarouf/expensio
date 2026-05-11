# Expensio

[![CI](https://github.com/youssefboulmarouf/expensio/actions/workflows/ci.yml/badge.svg)](https://github.com/youssefboulmarouf/expensio/actions/workflows/ci.yml)

Decentralized expense management on Base — smart contract-powered group expenses with Safe multisig integration.

## Prerequisites

- Node.js >= 20
- npm >= 10
- PostgreSQL 16 on `localhost:5432` (user: `dev`, password: `dev`, db: `expensio`)
- Redis 7 on `localhost:6379` (password: `dev`)

### Option A: Run services with Docker (recommended)

```bash
# Postgres
docker run -d --name expensio-postgres \
  -e POSTGRES_USER=dev \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=expensio \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker run -d --name expensio-redis \
  -p 6379:6379 \
  redis:7-alpine redis-server --requirepass dev
```

### Option B: Local installation

Install PostgreSQL 16 and Redis 7 via your system package manager and create a `dev` user with password `dev`.

## Quick Start

```bash
npm run setup
```

This will verify services are reachable, create the `expensio` database, copy `.env.example` to `.env`, install dependencies, and run migrations.

Then start the dev servers:

```bash
npm run dev
```

## Environments

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Local | http://localhost:3000 | http://localhost:3001 |
| Staging | https://expensio.vercel.app *(placeholder)* | https://expensio-api.up.railway.app *(placeholder)* |

## Apps

| App | URL | Description |
|-----|-----|-------------|
| `apps/web` | http://localhost:3000 | Next.js frontend |
| `apps/api` | http://localhost:3001 | Express REST API |
| `apps/contracts` | — | Hardhat smart contracts |

## Packages

| Package | Description |
|---------|-------------|
| `packages/shared` | Shared TypeScript types and utilities |

## Scripts

```bash
npm run setup        # One-time local environment setup
npm run dev          # Start api + web in dev mode
npm run build        # Build all workspaces
npm run lint         # ESLint across all workspaces
npm run type-check   # TypeScript check across all workspaces
npm run test         # Run tests across all workspaces
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy-staging.yml`, which runs two parallel jobs:

- **deploy-frontend** — builds the Next.js app and deploys it to Vercel production via the Vercel CLI
- **deploy-backend** — deploys `apps/api` to Railway via the Railway CLI, which runs `prisma migrate deploy` before starting the server

PRs do not trigger deployments; only merged commits to `main` do.

### GitHub Secrets

Add the following secrets under **Settings → Secrets and variables → Actions** in the GitHub repo:

| Secret | Where to get it |
|--------|----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Run `vercel whoami` or copy from Project Settings → General |
| `VERCEL_PROJECT_ID` | Vercel Project Settings → General |
| `RAILWAY_TOKEN` | [railway.app/account/tokens](https://railway.app/account/tokens) |

## Networks

- **Local**: Hardhat in-process node
- **Testnet**: Base Sepolia (chainId 84532)
- **Mainnet**: Base (chainId 8453)
