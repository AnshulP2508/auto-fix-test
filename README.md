# Vulnerable Commerce Lab

This project is a deliberately vulnerable ecommerce application for isolated cybersecurity training, QA stress testing, and CTF-style practice. It must never be deployed to production or connected to real users, real payment credentials, or real customer data.

Every page renders the banner:

`⚠️ VULNERABLE LAB ENVIRONMENT — NOT FOR PRODUCTION`

## Stack

- Frontend: Next.js with SSR and React
- Backend: NestJS with TypeORM
- Database: PostgreSQL
- Cache: Redis
- Auth: JWT
- Payment: mock Razorpay only
- Real-time: Socket.io
- Runtime: local Docker only

## Run

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- nginx proxy: http://localhost:8080

Seed data after the backend starts:

```bash
docker compose exec backend npm run seed
```

Default seeded admin:

- Email: `admin@lab.test`
- Password: `password`

## Reset Lab State

```bash
docker compose down -v
docker compose up --build
docker compose exec backend npm run seed
```

## Training Notes

The intended vulnerabilities are documented in `VULNERABILITIES.md`. That file is the source of truth for bug names, CWE mappings, reproduction steps, and remediation guidance.

Use only in a private lab network. Do not expose the containers to the internet.

## Sentry

Sentry setup is documented in `docs/SENTRY_SETUP.md`. The lab is configured for separate frontend and backend projects named `ecommerce-frontend` and `ecommerce-backend`, with DSNs supplied through environment variables.
