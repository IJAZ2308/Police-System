# AI Police Smart System - NEXUS

## Overview

Full-stack AI-powered police management platform with crime prediction, surveillance, FIR automation, facial recognition, emergency alerts, and AI chatbot.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4 (dark police command center theme)
- **Backend**: Express 5 (Node.js)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **State management**: Zustand (auth)
- **Maps**: React-Leaflet (OpenStreetMap)
- **Charts**: Recharts
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **UI**: Lucide React icons, Framer Motion animations

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/             # Express API backend
│   │   └── src/
│   │       ├── lib/auth.ts     # JWT auth helpers
│   │       └── routes/         # All API routes
│   │           ├── auth.ts     # /api/auth/*
│   │           ├── crime.ts    # /api/crime/*, /api/report/*
│   │           ├── alerts.ts   # /api/alerts/*
│   │           ├── fir.ts      # /api/fir/*
│   │           ├── face.ts     # /api/face/*
│   │           ├── officers.ts # /api/officers/*, /api/patrol/*
│   │           ├── cases.ts    # /api/cases/*
│   │           ├── chatbot.ts  # /api/chatbot/*
│   │           └── dashboard.ts # /api/dashboard/*
│   └── police-system/          # React frontend
│       └── src/
│           ├── hooks/          # use-auth.ts (zustand), use-api.ts
│           ├── pages/          # All 11 pages
│           └── components/     # Layout + UI components
├── lib/
│   ├── api-spec/openapi.yaml   # Complete API spec
│   ├── api-client-react/       # Generated React Query hooks
│   ├── api-zod/                # Generated Zod schemas
│   └── db/src/schema/          # users, reports, alerts, firs, cases tables
└── scripts/
```

## Demo Credentials

- **Admin**: admin@nexus.gov / admin123
- **Officer**: officer@nexus.gov / officer123
- **Citizen**: Register at the login screen

## Features

1. **Login/Register** - JWT auth with role-based access (admin/officer/citizen)
2. **Dashboard** - Real-time stats, activity feed, crime analytics
3. **Crime Map** - Leaflet map with heatmap overlays and prediction zones
4. **Crime Reports** - Submit, view, track status of crime reports
5. **Emergency Alerts** - Panic button, alert feed, resolve alerts
6. **FIR Management** - AI-generated FIR from text input (IPC sections auto-filled)
7. **Facial Recognition** - Upload image → match against criminal database
8. **Officers** - Officer roster with status and active cases
9. **Cases** - Case tracking with priority levels
10. **AI Chatbot** - Legal query assistant (knows FIR, rights, bail, domestic violence)
11. **Surveillance** - Mock video feed grid with detection indicators

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user
- `GET /api/crime/predict` - Heatmap prediction data
- `GET /api/crime/stats` - Crime statistics
- `POST /api/report/create` - Create crime report
- `GET /api/report/list` - List reports
- `POST /api/alerts/send` - Send emergency alert
- `GET /api/alerts/list` - List alerts
- `PATCH /api/alerts/:id/resolve` - Resolve alert
- `POST /api/fir/generate` - Generate FIR from description
- `GET /api/fir/list` - List FIRs
- `POST /api/face/match` - Match face against database
- `GET /api/officers` - List officers
- `GET /api/officers/activity` - Officer activity stats
- `GET /api/cases` - List cases
- `POST /api/chatbot/message` - Chat with AI assistant
- `GET /api/patrol/routes` - Optimized patrol routes
- `GET /api/dashboard/stats` - Admin dashboard stats

## Database Tables

- `users` - All users (admin/officer/citizen roles)
- `reports` - Crime incident reports
- `alerts` - Emergency alerts
- `firs` - First Information Reports
- `cases` - Case tracking

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provided)
- `JWT_SECRET` - JWT signing key (defaults to hardcoded dev key)
- `PORT` - Server port (auto-provided)
