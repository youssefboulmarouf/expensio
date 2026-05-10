# Expensio

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

## Networks

- **Local**: Hardhat in-process node
- **Testnet**: Base Sepolia (chainId 84532)
- **Mainnet**: Base (chainId 8453)
