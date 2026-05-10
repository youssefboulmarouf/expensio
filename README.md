# Expensio

Decentralized expense management on Base — smart contract-powered group expenses with Safe multisig integration.

## Prerequisites

- Node.js >= 20
- npm >= 10
- Docker + Docker Compose (for local Postgres + Redis)
- Git

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start local services
docker compose up -d

# 3. Copy env files and fill in values
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/contracts/.env.example apps/contracts/.env

# 4. Run database migrations (after adding schema)
npm run --workspace=apps/api prisma migrate dev

# 5. Start all dev servers
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
npm run dev          # Start api + web in dev mode
npm run build        # Build all workspaces
npm run lint         # ESLint across all workspaces
npm run type-check   # TypeScript check across all workspaces
npm run test         # Run tests across all workspaces
```

## Networks

- **Local**: Hardhat in-process node
- **Testnet**: Base Sepolia (chainId 84532)
- **Mainnet**: Base (chainId 8453)
