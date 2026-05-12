// Sets required env vars before any module is loaded so config/env.ts validation passes.
process.env['DATABASE_URL'] = 'postgresql://dev:dev@localhost:5432/expensio_test';
process.env['WEB_URL'] = 'http://localhost:3000';
process.env['JWT_SECRET'] = 'test-only-secret-key-not-for-production-use';
process.env['JWT_EXPIRY'] = '15m';
process.env['PORT'] = '3001';
process.env['NODE_ENV'] = 'test';
