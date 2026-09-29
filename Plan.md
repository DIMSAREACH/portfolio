# Implementation Plan

## Developer Portfolio & Content Management Platform

**Version:** 1.0.0
**Derived From:** [PRD.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/PRD.md)
**Created:** 2026-09-29
**Status:** Ready for Execution

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Planning Principles](#2-planning-principles)
- [3. Architecture Implementation Order](#3-architecture-implementation-order)
- [4. MVP Roadmap](#4-mvp-roadmap)
- [5. Milestones](#5-milestones)
- [6. Git Workflow](#6-git-workflow)
- [7. Environment Setup](#7-environment-setup)
- [8. Development Phases](#8-development-phases)
  - [Phase 0 — Project Planning & Repository Setup](#phase-0--project-planning--repository-setup)
  - [Phase 1 — Backend Foundation](#phase-1--backend-foundation)
  - [Phase 2 — MongoDB Database & Models](#phase-2--mongodb-database--models)
  - [Phase 3 — Authentication & Authorization](#phase-3--authentication--authorization)
  - [Phase 4 — Core Admin API (CRUD)](#phase-4--core-admin-api-crud)
  - [Phase 5 — Public API](#phase-5--public-api)
  - [Phase 6 — Seed Data](#phase-6--seed-data)
  - [Phase 7 — Angular Frontend Foundation](#phase-7--angular-frontend-foundation)
  - [Phase 8 — Public Portfolio Pages](#phase-8--public-portfolio-pages)
  - [Phase 9 — Admin Dashboard — Layout & Auth](#phase-9--admin-dashboard--layout--auth)
  - [Phase 10 — Admin Dashboard — CRUD Sections](#phase-10--admin-dashboard--crud-sections)
  - [Phase 11 — Blog System (Full Stack)](#phase-11--blog-system-full-stack)
  - [Phase 12 — Media & CV Management](#phase-12--media--cv-management)
  - [Phase 13 — Contact System](#phase-13--contact-system)
  - [Phase 14 — Multilingual Support (i18n)](#phase-14--multilingual-support-i18n)
  - [Phase 15 — Theme & Accessibility](#phase-15--theme--accessibility)
  - [Phase 16 — SEO & Performance](#phase-16--seo--performance)
  - [Phase 17 — Testing & Quality](#phase-17--testing--quality)
  - [Phase 18 — Security Hardening](#phase-18--security-hardening)
  - [Phase 19 — Docker & CI/CD](#phase-19--docker--cicd)
  - [Phase 20 — Production Deployment & Final QA](#phase-20--production-deployment--final-qa)
- [9. Database Implementation Plan](#9-database-implementation-plan)
- [10. Backend Implementation Plan](#10-backend-implementation-plan)
- [11. API Implementation Order](#11-api-implementation-order)
- [12. Frontend Implementation Plan](#12-frontend-implementation-plan)
- [13. Angular Architecture](#13-angular-architecture)
- [14. UI Implementation Order](#14-ui-implementation-order)
- [15. Admin CRUD Implementation Strategy](#15-admin-crud-implementation-strategy)
- [16. Authentication Implementation Plan](#16-authentication-implementation-plan)
- [17. Security Implementation Plan](#17-security-implementation-plan)
- [18. Testing Plan](#18-testing-plan)
- [19. Docker Plan](#19-docker-plan)
- [20. CI/CD Plan](#20-cicd-plan)
- [21. Documentation Plan](#21-documentation-plan)
- [22. Feature Matrix](#22-feature-matrix)
- [23. Risk Register](#23-risk-register)
- [24. Assumptions](#24-assumptions)
- [25. Open Questions](#25-open-questions)
- [26. PRD-to-Plan Traceability](#26-prd-to-plan-traceability)
- [27. Master Task Checklist](#27-master-task-checklist)
- [28. AI Coding Agent Execution Rules](#28-ai-coding-agent-execution-rules)

---

## 1. Overview

This plan converts the product requirements defined in `PRD.md` into a dependency-aware, sequential implementation plan. It is designed so that an AI coding agent can:

1. Read `PRD.md` (product requirements).
2. Read `Plan.md` (this document — implementation roadmap).
3. Identify the next incomplete task.
4. Check its dependencies.
5. Implement only the required task.
6. Run relevant tests.
7. Fix failures.
8. Update the task status.
9. Continue to the next task.

**Project:** Developer Portfolio & Content Management Platform
**Stack:** Angular 19+ · Node.js/Express · TypeScript · MongoDB/Mongoose · JWT · Cloudinary · Docker · GitHub Actions
**Scope:** Single-admin portfolio website + private CMS dashboard

---

## 2. Planning Principles

| Principle | Description |
|-----------|-------------|
| **Build in dependency order** | Never build a feature before its dependencies exist |
| **No over-engineering** | Simple, maintainable, modular, secure, testable, production-ready |
| **Small tasks** | Each task should be implementable in one focused coding session |
| **Test during development** | Don't wait until the end to test; test alongside each major feature |
| **MVP first** | Build the shortest path to a working portfolio, then polish |
| **PRD is source of truth** | Don't add features not in the PRD; don't contradict the PRD |
| **Reuse before rebuild** | Plan reusable components and services; don't duplicate UI |
| **Stable IDs** | Every task has a unique, stable ID for referencing |

---

## 3. Architecture Implementation Order

```
Phase 0: Repository Setup & Tooling
        ↓
Phase 1: Backend Foundation (Express, TypeScript, Config)
        ↓
Phase 2: Database (MongoDB Connection, All Models)
        ↓
Phase 3: Authentication (JWT, Login, Middleware)
        ↓
Phase 4: Admin API (All CRUD Endpoints)
        ↓
Phase 5: Public API (Read-Only Endpoints)
        ↓
Phase 6: Seed Data
        ↓
Phase 7: Angular Foundation (Routing, Services, Shared Components)
        ↓
Phase 8: Public Portfolio Pages
        ↓
Phase 9: Admin Dashboard (Layout, Auth UI)
        ↓
Phase 10: Admin Dashboard (CRUD Sections)
        ↓
Phase 11: Blog System (Full Stack)
        ↓
Phase 12: Media & CV Management
        ↓
Phase 13: Contact System
        ↓
Phase 14: Multilingual (i18n)
        ↓
Phase 15: Theme & Accessibility
        ↓
Phase 16: SEO & Performance
        ↓
Phase 17: Testing & Quality
        ↓
Phase 18: Security Hardening
        ↓
Phase 19: Docker & CI/CD
        ↓
Phase 20: Production Deployment & Final QA
```

---

## 4. MVP Roadmap

The shortest path to a working, demonstrable portfolio:

```
SETUP-* → BACKEND-* → DB-* → AUTH-* → API-ADMIN (Projects, Skills, Profile)
    ↓
API-PUBLIC (Projects, Skills, Profile, Contact)
    ↓
SEED-* → FE-* (Foundation + Home, Projects, Skills, Contact, 404)
    ↓
ADMIN-* (Login, Layout, Dashboard, Project CRUD, Skill CRUD)
    ↓
THEME-* (Dark/Light toggle)
    ↓
Deploy → MVP Complete
```

**MVP Features (P0):**

| Feature | Backend | Frontend |
|---------|---------|----------|
| Health check endpoint | ✅ | — |
| Auth (login/logout/refresh) | ✅ | ✅ (login page, guard, interceptor) |
| Profile API + admin form | ✅ | ✅ |
| Projects CRUD + public list/detail | ✅ | ✅ |
| Skills CRUD + public page | ✅ | ✅ |
| Home page | — | ✅ |
| Contact form + API | ✅ | ✅ |
| Admin dashboard overview | ✅ | ✅ |
| Dark/light theme toggle | — | ✅ |
| Responsive design | — | ✅ |
| Basic SEO (titles, meta) | — | ✅ |

---

## 5. Milestones

| Milestone | Description | Completion Criteria | Target Phase |
|-----------|-------------|--------------------|--------------|
| **M1** | Repository & Infrastructure Ready | Repo initialized; Angular and Express running; Docker Compose works | Phase 0 |
| **M2** | Backend Foundation Ready | Express configured with middleware, logging, error handling, TypeScript compiling | Phase 1 |
| **M3** | Database Ready | All 13 Mongoose models created; DB connects on startup | Phase 2 |
| **M4** | Authentication Ready | Login/logout/refresh working; middleware protects admin routes | Phase 3 |
| **M5** | Admin API Ready | All admin CRUD endpoints functional with validation and Swagger docs | Phase 4 |
| **M6** | Public API Ready | All public read-only endpoints return correct data with pagination | Phase 5 |
| **M7** | Seed Data Ready | `npm run seed` populates all collections with realistic data | Phase 6 |
| **M8** | Public Portfolio Ready | All public pages render data from API; responsive; theme toggle works | Phase 8 |
| **M9** | Admin CMS Ready | Full admin dashboard with all CRUD operations working end-to-end | Phase 10 |
| **M10** | Blog & Contact Ready | Blog with Markdown rendering; contact form with email notifications | Phase 13 |
| **M11** | i18n & Polish Ready | EN/KH switching; accessibility; SEO meta tags; performance optimized | Phase 16 |
| **M12** | Testing & Security Ready | Test suites passing; security hardening applied | Phase 18 |
| **M13** | Deployment Ready | Docker images build; CI/CD pipelines configured; production deployed | Phase 20 |

---

## 6. Git Workflow

### Branch Strategy

```
main          — Production-ready code
develop       — Integration branch
feature/*     — Feature branches
fix/*         — Bug fix branches
```

### Branch Naming

```
feature/phase-0-project-setup
feature/backend-foundation
feature/database-models
feature/auth
feature/admin-api-projects
feature/admin-api-skills
feature/public-api
feature/angular-foundation
feature/public-home-page
feature/admin-dashboard
feature/blog-system
feature/contact-system
feature/i18n
feature/theme-accessibility
feature/seo-performance
feature/testing
feature/security
feature/docker-cicd
feature/production-deployment
fix/contact-form-validation
fix/auth-token-refresh
```

### Commit Conventions

```
feat: add project CRUD endpoints
fix: resolve token refresh race condition
docs: update README with setup instructions
refactor: extract pagination utility
test: add auth integration tests
chore: update dependencies
style: format code with prettier
```

### Rules

- Feature branches created from `develop`
- Pull requests to `develop` for review
- `develop` merged to `main` for releases
- No direct commits to `main`

---

## 7. Environment Setup

### Backend `.env.example`

```bash
# Server
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:4200

# Database
DATABASE_URL=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-min-64-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-min-64-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Portfolio" <your-email@gmail.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Frontend Environments

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.portfolio.example.com/api/v1',
};
```

### Environments Required

| Environment | Database | Purpose |
|-------------|----------|---------|
| `development` | Local MongoDB (Docker) | Local development |
| `test` | In-memory MongoDB (`mongodb-memory-server`) | Automated tests |
| `production` | MongoDB Atlas (M0 free) | Live deployment |

---

## 8. Development Phases

---

### Phase 0 — Project Planning & Repository Setup

#### Objective

Initialize the monorepo structure, set up tooling for both frontend and backend projects, and establish Docker Compose for local development.

#### Dependencies

None — this is the first phase.

#### Deliverables

- Git repository initialized
- Folder structure created (per PRD Section 32)
- Angular project scaffolded with Angular Material + Tailwind CSS
- Node.js/Express backend scaffolded with TypeScript
- ESLint + Prettier configured for both projects
- `docker-compose.dev.yml` with MongoDB
- `.env.example`, `.gitignore`, `.editorconfig`
- Basic `README.md`

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| SETUP-001 | Initialize Git repository and create `.gitignore` | P0 | — |
| SETUP-002 | Create root folder structure (`frontend/`, `backend/`, `docs/`, `.github/`) | P0 | SETUP-001 |
| SETUP-003 | Create `.editorconfig` with project conventions | P2 | SETUP-001 |
| SETUP-004 | Initialize Node.js/Express backend project with TypeScript | P0 | SETUP-002 |
| SETUP-005 | Configure backend `tsconfig.json` (strict mode enabled) | P0 | SETUP-004 |
| SETUP-006 | Install backend core dependencies (express, mongoose, cors, helmet, dotenv, etc.) | P0 | SETUP-004 |
| SETUP-007 | Install backend dev dependencies (typescript, ts-node-dev, eslint, prettier, jest) | P0 | SETUP-004 |
| SETUP-008 | Configure backend ESLint + Prettier | P1 | SETUP-007 |
| SETUP-009 | Create backend `package.json` scripts (`dev`, `build`, `start`, `lint`, `test`) | P0 | SETUP-004 |
| SETUP-010 | Create backend `.env.example` with all required variables | P0 | SETUP-004 |
| SETUP-011 | Create backend entry files (`src/server.ts`, `src/app.ts`) with health check endpoint | P0 | SETUP-006 |
| SETUP-012 | Initialize Angular project (standalone components, latest stable) | P0 | SETUP-002 |
| SETUP-013 | Add Angular Material to the project | P0 | SETUP-012 |
| SETUP-014 | Add and configure Tailwind CSS | P0 | SETUP-012 |
| SETUP-015 | Configure frontend ESLint + Prettier | P1 | SETUP-012 |
| SETUP-016 | Create frontend environment files (`environment.ts`, `environment.prod.ts`) | P0 | SETUP-012 |
| SETUP-017 | Create `docker-compose.dev.yml` (frontend, backend, MongoDB) | P1 | SETUP-011, SETUP-012 |
| SETUP-018 | Create backend `Dockerfile.dev` | P1 | SETUP-011 |
| SETUP-019 | Create frontend `Dockerfile.dev` | P1 | SETUP-012 |
| SETUP-020 | Create basic `README.md` with project overview and setup instructions | P1 | SETUP-017 |

#### Subtasks for SETUP-011

1. Create `src/app.ts` — Configure Express app with basic middleware (json parsing, cors placeholder)
2. Create `src/server.ts` — Start server, listen on `PORT`
3. Add `GET /api/v1/health` endpoint returning `{ status: "ok", timestamp: ... }`

#### Subtasks for SETUP-012

1. Run `ng new frontend --style=css --routing --ssr=false --standalone`
2. Verify the app compiles and serves on `localhost:4200`

#### Files / Modules

```
portfolio/
├── .gitignore
├── .editorconfig
├── README.md
├── docker-compose.dev.yml
├── frontend/
│   ├── Dockerfile.dev
│   ├── angular.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── environments/
│       │   ├── environment.ts
│       │   └── environment.prod.ts
│       └── ...
├── backend/
│   ├── Dockerfile.dev
│   ├── .env.example
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── app.ts
│       └── server.ts
└── docs/
```

#### Technical Notes

- Angular should use standalone components (default in Angular 17+)
- Backend TypeScript in strict mode (`strict: true`, `noImplicitAny: true`)
- Use `ts-node-dev` for backend hot reload in development
- Docker Compose ports: frontend=4200, backend=3000, MongoDB=27017

#### Testing

- `npm run build` compiles without errors in both projects
- Health check endpoint returns 200

#### Acceptance Criteria

- [ ] `docker-compose -f docker-compose.dev.yml up` starts all 3 services
- [ ] Angular app shows default page at `http://localhost:4200`
- [ ] Express API returns `{ status: "ok" }` at `GET http://localhost:3000/api/v1/health`
- [ ] TypeScript compiles without errors in both projects
- [ ] ESLint runs without errors in both projects

#### Definition of Done

- [x] Repository initialized with `.gitignore`
- [x] Folder structure matches PRD Section 32 (skeleton)
- [x] Backend compiles and starts
- [x] Frontend compiles and starts
- [x] Docker Compose starts all services
- [x] `.env.example` contains all required variables
- [x] `README.md` has basic setup instructions

---

### Phase 1 — Backend Foundation

#### Objective

Establish the backend architecture: configuration modules, middleware, error handling, logging, utilities, and type definitions. No database models or routes yet — just the infrastructure that everything else will build upon.

#### Dependencies

- Phase 0 (SETUP-* complete)

#### Deliverables

- Express app fully configured with production-ready middleware
- Centralized error handling with custom error classes
- Winston + Morgan logging
- Input validation middleware
- Pagination utility
- Slug generation utility
- API response helpers
- TypeScript type definitions

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| BACKEND-001 | Create environment config module (`src/config/environment.ts`) | P0 | SETUP-011 |
| BACKEND-002 | Create CORS configuration module (`src/config/cors.ts`) | P0 | BACKEND-001 |
| BACKEND-003 | Create custom error classes (`AppError`, `ValidationError`, `NotFoundError`, etc.) | P0 | SETUP-011 |
| BACKEND-004 | Create global error handler middleware (`src/middleware/errorHandler.middleware.ts`) | P0 | BACKEND-003 |
| BACKEND-005 | Create async handler wrapper (`src/utils/catchAsync.ts`) | P0 | SETUP-011 |
| BACKEND-006 | Create Winston logger (`src/utils/logger.ts`) | P0 | SETUP-011 |
| BACKEND-007 | Configure Morgan HTTP logging integrated with Winston | P1 | BACKEND-006 |
| BACKEND-008 | Create API response helper (`src/utils/apiResponse.ts`) — success, error, paginated formats | P0 | SETUP-011 |
| BACKEND-009 | Create validation middleware using express-validator (`src/middleware/validate.middleware.ts`) | P0 | SETUP-011 |
| BACKEND-010 | Create pagination utility (`src/utils/pagination.ts`) | P1 | SETUP-011 |
| BACKEND-011 | Create slug generation utility (`src/utils/slugify.ts`) | P1 | SETUP-011 |
| BACKEND-012 | Create reading time calculation utility (`src/utils/readingTime.ts`) | P2 | SETUP-011 |
| BACKEND-013 | Create TypeScript type definitions (`src/types/index.ts`, `src/types/express.d.ts`) | P0 | SETUP-011 |
| BACKEND-014 | Configure Helmet security headers in `app.ts` | P0 | BACKEND-001 |
| BACKEND-015 | Configure rate limiter middleware (`src/middleware/rateLimiter.middleware.ts`) | P1 | BACKEND-001 |
| BACKEND-016 | Create base route structure (`src/routes/index.ts`) with API versioning `/api/v1` | P0 | BACKEND-004 |
| BACKEND-017 | Update `app.ts` to wire all middleware and route structure | P0 | BACKEND-002, BACKEND-004, BACKEND-006, BACKEND-007, BACKEND-014, BACKEND-016 |

#### Files / Modules

```
backend/src/
├── config/
│   ├── environment.ts      # BACKEND-001
│   └── cors.ts             # BACKEND-002
├── middleware/
│   ├── errorHandler.middleware.ts   # BACKEND-004
│   ├── validate.middleware.ts       # BACKEND-009
│   └── rateLimiter.middleware.ts    # BACKEND-015
├── utils/
│   ├── AppError.ts         # BACKEND-003
│   ├── catchAsync.ts       # BACKEND-005
│   ├── logger.ts           # BACKEND-006
│   ├── apiResponse.ts      # BACKEND-008
│   ├── pagination.ts       # BACKEND-010
│   ├── slugify.ts          # BACKEND-011
│   └── readingTime.ts      # BACKEND-012
├── types/
│   ├── index.ts            # BACKEND-013
│   └── express.d.ts        # BACKEND-013
├── routes/
│   └── index.ts            # BACKEND-016
├── app.ts                  # BACKEND-017
└── server.ts
```

#### Technical Notes

- Error handler must transform Mongoose validation errors → 400, duplicate key → 409, JWT errors → 401
- Logger: JSON format in production, human-readable in development
- All environment variables loaded and validated at startup via `environment.ts`
- Pagination utility accepts `page`, `limit` query params and returns `{ page, limit, skip, total, totalPages, hasNextPage, hasPrevPage }`
- Rate limiter configurable via environment variables

#### Testing

- Error handler correctly formats different error types
- Slug utility generates URL-friendly slugs
- Pagination utility computes correct offsets
- API response helpers produce correct JSON format

#### Acceptance Criteria

- [ ] Express app starts with all middleware configured
- [ ] Unknown routes return 404 with correct JSON error format
- [ ] Unhandled errors return 500 with correct JSON error format (no stack in production)
- [ ] Logger outputs to console in correct format
- [ ] Health check still works at `GET /api/v1/health`

#### Definition of Done

- [x] All files listed above exist and compile
- [x] Error classes cover: 400, 401, 403, 404, 409, 429
- [x] Middleware stack: json parser, cors, helmet, morgan, rate limiter, routes, error handler
- [x] Utilities: catchAsync, slugify, pagination, readingTime, apiResponse

---

### Phase 2 — MongoDB Database & Models

#### Objective

Connect to MongoDB via Mongoose and create all 13 data models with schemas, validation, indexes, and pre-save hooks.

#### Dependencies

- Phase 1 (BACKEND-* complete)

#### Deliverables

- MongoDB connection module
- All 13 Mongoose models per PRD Section 11
- Indexes defined on all models
- Pre-save hooks (password hashing, slug generation, reading time)

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| DB-001 | Create MongoDB connection module (`src/config/database.ts`) | P0 | BACKEND-001 |
| DB-002 | Create User model (`src/models/User.ts`) | P0 | DB-001 |
| DB-003 | Create Profile model (`src/models/Profile.ts`) — singleton | P0 | DB-001 |
| DB-004 | Create Category model (`src/models/Category.ts`) | P0 | DB-001 |
| DB-005 | Create Project model (`src/models/Project.ts`) | P0 | DB-001, DB-004 |
| DB-006 | Create Skill model (`src/models/Skill.ts`) | P0 | DB-001 |
| DB-007 | Create Experience model (`src/models/Experience.ts`) | P0 | DB-001 |
| DB-008 | Create Education model (`src/models/Education.ts`) | P0 | DB-001 |
| DB-009 | Create Certification model (`src/models/Certification.ts`) | P1 | DB-001 |
| DB-010 | Create BlogPost model (`src/models/BlogPost.ts`) | P0 | DB-001, DB-004 |
| DB-011 | Create Message model (`src/models/Message.ts`) | P0 | DB-001 |
| DB-012 | Create Media model (`src/models/Media.ts`) | P1 | DB-001 |
| DB-013 | Create SocialLink model (`src/models/SocialLink.ts`) | P1 | DB-001 |
| DB-014 | Create Settings model (`src/models/Settings.ts`) — singleton | P1 | DB-001 |
| DB-015 | Update `server.ts` to connect to MongoDB on startup | P0 | DB-001 |
| DB-016 | Add graceful shutdown handling (close DB connection) | P1 | DB-015 |

#### Subtasks for Each Model

For each model (DB-002 through DB-014):

1. Define Mongoose schema with all fields per PRD Section 11.x
2. Add field types, required flags, defaults, and enums
3. Add bilingual field structure (`{ en: String, kh: String }`) where applicable
4. Define indexes per PRD specification
5. Add `timestamps: true` option
6. Add pre-save hooks where needed (password hashing for User, slug auto-gen for Project/BlogPost/Category)
7. Export model and TypeScript interface

#### Database Model Implementation Order

| Order | Model | Task ID | Dependencies | Notes |
|-------|-------|---------|--------------|-------|
| 1 | User | DB-002 | DB-001 | Required for auth; password hashing pre-save hook |
| 2 | Profile | DB-003 | DB-001 | Singleton; upsert pattern |
| 3 | Category | DB-004 | DB-001 | Referenced by Project and BlogPost |
| 4 | Project | DB-005 | DB-004 | References Category; slug index |
| 5 | Skill | DB-006 | DB-001 | Independent |
| 6 | Experience | DB-007 | DB-001 | Independent |
| 7 | Education | DB-008 | DB-001 | Independent |
| 8 | Certification | DB-009 | DB-001 | Independent |
| 9 | BlogPost | DB-010 | DB-004 | References Category + User; reading time pre-save |
| 10 | Message | DB-011 | DB-001 | Independent |
| 11 | Media | DB-012 | DB-001 | Independent |
| 12 | SocialLink | DB-013 | DB-001 | Independent |
| 13 | Settings | DB-014 | DB-001 | Singleton; upsert pattern |

#### Files / Modules

```
backend/src/
├── config/
│   └── database.ts         # DB-001
└── models/
    ├── User.ts             # DB-002
    ├── Profile.ts          # DB-003
    ├── Category.ts         # DB-004
    ├── Project.ts          # DB-005
    ├── Skill.ts            # DB-006
    ├── Experience.ts       # DB-007
    ├── Education.ts        # DB-008
    ├── Certification.ts    # DB-009
    ├── BlogPost.ts         # DB-010
    ├── Message.ts          # DB-011
    ├── Media.ts            # DB-012
    ├── SocialLink.ts       # DB-013
    └── Settings.ts         # DB-014
```

#### Technical Notes

- User model: Hash password with bcrypt (salt rounds = 12) in a pre-save hook; add `comparePassword` instance method
- Profile and Settings are singletons — the app upserts rather than creating multiple documents
- Project/BlogPost: Auto-generate slug from English title if not provided, ensure uniqueness
- BlogPost: Calculate `readingTime` from English content word count / 200, rounded up, in pre-save hook
- Bilingual fields use embedded `{ en: String, kh: String }` objects — NOT references

#### Testing

- Each model can be instantiated with valid data
- Required field validation fails appropriately
- Enum validation works (e.g., `status` must be `draft` or `published`)
- Password hashing works in User model
- Slug generation produces URL-friendly strings

#### Acceptance Criteria

- [ ] Database connects successfully on startup and logs confirmation
- [ ] All 13 models compile without TypeScript errors
- [ ] Indexes are created on startup (confirmed via logs or MongoDB shell)
- [ ] User password is hashed before save (never stored in plain text)
- [ ] Graceful shutdown closes the database connection

#### Definition of Done

- [x] `database.ts` connects to MongoDB using `DATABASE_URL` from env
- [x] All 13 models created with complete schemas per PRD Section 11
- [x] All indexes defined per PRD
- [x] TypeScript interfaces exported for each model
- [x] Pre-save hooks implemented (password hash, slug, reading time)

---

### Phase 3 — Authentication & Authorization

#### Objective

Implement secure JWT authentication with access tokens (in memory), refresh tokens (HTTP-only cookies), login/logout/refresh endpoints, and middleware for protecting admin routes.

#### Dependencies

- Phase 2 (DB-002 User model must exist)

#### Deliverables

- Auth service (login, logout, token generation, verification)
- Auth routes (`/api/v1/auth/*`)
- Auth middleware (authenticate, authorize)
- Rate limiting on login endpoint
- Admin user seed script

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| AUTH-001 | Create JWT token utility (`src/utils/jwt.ts`) — generate access/refresh tokens, verify | P0 | DB-002 |
| AUTH-002 | Create auth service (`src/services/auth.service.ts`) — login, logout, refresh logic | P0 | AUTH-001, DB-002 |
| AUTH-003 | Create auth validator (`src/validators/auth.validator.ts`) — login, change-password validation | P0 | BACKEND-009 |
| AUTH-004 | Create auth controller (`src/controllers/auth.controller.ts`) | P0 | AUTH-002, AUTH-003 |
| AUTH-005 | Create authenticate middleware (`src/middleware/auth.middleware.ts`) — verify access token | P0 | AUTH-001 |
| AUTH-006 | Create authorize middleware (role check) in same file | P0 | AUTH-005 |
| AUTH-007 | Create auth routes (`src/routes/auth.routes.ts`) | P0 | AUTH-004 |
| AUTH-008 | Wire auth routes into main router (`/api/v1/auth/*`) | P0 | AUTH-007, BACKEND-016 |
| AUTH-009 | Add login rate limiting (5 attempts per 15 minutes per IP) | P0 | BACKEND-015, AUTH-007 |
| AUTH-010 | Create seed script (`backend/seeds/seed.ts`) — admin account only (for now) | P0 | DB-002 |
| AUTH-011 | Add `npm run seed` script to `package.json` | P0 | AUTH-010 |
| AUTH-012 | Create change-password endpoint (`PATCH /api/v1/auth/change-password`) | P1 | AUTH-002, AUTH-005 |

#### Subtasks for AUTH-002

1. `login(email, password)` — Find user, compare password, generate tokens, set refresh cookie
2. `refresh(refreshToken)` — Verify refresh token, generate new access token
3. `logout(res)` — Clear refresh token cookie
4. `getCurrentUser(userId)` — Return user without password

#### Auth Endpoints (per PRD Section 12.1)

| Method | Endpoint | Auth Required | Task ID |
|--------|----------|---------------|---------|
| POST | `/api/v1/auth/login` | No | AUTH-007 |
| POST | `/api/v1/auth/logout` | Yes | AUTH-007 |
| POST | `/api/v1/auth/refresh` | Cookie | AUTH-007 |
| GET | `/api/v1/auth/me` | Yes | AUTH-007 |
| PATCH | `/api/v1/auth/change-password` | Yes | AUTH-012 |

#### Files / Modules

```
backend/src/
├── utils/
│   └── jwt.ts              # AUTH-001
├── services/
│   └── auth.service.ts     # AUTH-002
├── validators/
│   └── auth.validator.ts   # AUTH-003
├── controllers/
│   └── auth.controller.ts  # AUTH-004
├── middleware/
│   └── auth.middleware.ts   # AUTH-005, AUTH-006
├── routes/
│   └── auth.routes.ts      # AUTH-007
└── seeds/
    └── seed.ts             # AUTH-010
```

#### Technical Notes

- Access token: Signed with `JWT_SECRET`, payload `{ userId, role }`, expires in 15 min
- Refresh token: Signed with `JWT_REFRESH_SECRET`, payload `{ userId }`, expires in 7 days
- Refresh token cookie: `httpOnly: true, secure: NODE_ENV === 'production', sameSite: 'strict', path: '/api/v1/auth'`
- Login rate limiter: Separate from global rate limiter, 5 attempts per 15 min
- Seed script hashes the admin password before insertion

#### Testing

- Login with valid credentials returns access token + sets refresh cookie
- Login with invalid credentials returns 401
- Protected endpoint without token returns 401
- Protected endpoint with expired token returns 401
- Refresh endpoint issues new access token from valid refresh cookie
- Logout clears the refresh cookie
- Login rate limit returns 429 after 5 attempts

#### Acceptance Criteria

- [ ] `POST /api/v1/auth/login` with valid credentials returns 200 + access token + refresh cookie
- [ ] `POST /api/v1/auth/login` with invalid credentials returns 401
- [ ] `GET /api/v1/auth/me` with valid token returns user data (no password)
- [ ] `POST /api/v1/auth/refresh` with valid cookie returns new access token
- [ ] `POST /api/v1/auth/logout` clears refresh cookie
- [ ] Protected admin routes return 401 without token
- [ ] 6th login attempt within 15 min returns 429
- [ ] `npm run seed` creates admin user with hashed password

#### Definition of Done

- [x] All auth endpoints working per PRD Section 12.1
- [x] Tokens have correct expiration times
- [x] Refresh token stored in HTTP-only secure cookie
- [x] Auth middleware extracts and verifies token from Authorization header
- [x] Authorize middleware checks user role
- [x] Admin seed user can log in successfully

---

### Phase 4 — Core Admin API (CRUD)

#### Objective

Implement all admin CRUD API endpoints per PRD Section 12.3. Each resource follows the pattern: Validator → Service → Controller → Routes.

#### Dependencies

- Phase 3 (AUTH-005 authenticate middleware, AUTH-006 authorize middleware)

#### Deliverables

- All admin CRUD endpoints (Projects, Skills, Experiences, Education, Certifications, Categories, Social Links, Profile, Settings, Dashboard stats)
- Cloudinary configuration and upload service
- File upload middleware (Multer)
- Swagger/OpenAPI documentation

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| API-001 | Create Cloudinary config (`src/config/cloudinary.ts`) | P0 | BACKEND-001 |
| API-002 | Create Cloudinary service (`src/services/cloudinary.service.ts`) — upload, delete | P0 | API-001 |
| API-003 | Create upload middleware (`src/middleware/upload.middleware.ts`) — Multer config | P0 | API-002 |
| API-004 | Create admin route index (`src/routes/admin/index.ts`) — apply auth middleware | P0 | AUTH-005, AUTH-006 |
| API-005 | Create Category service, controller, validator, routes | P0 | DB-004, API-004 |
| API-006 | Create Project service, controller, validator, routes | P0 | DB-005, API-004, API-002 |
| API-007 | Create Skill service, controller, validator, routes | P0 | DB-006, API-004 |
| API-008 | Create Experience service, controller, validator, routes | P0 | DB-007, API-004 |
| API-009 | Create Education service, controller, validator, routes | P0 | DB-008, API-004 |
| API-010 | Create Certification service, controller, validator, routes | P1 | DB-009, API-004 |
| API-011 | Create BlogPost service, controller, validator, routes (admin CRUD) | P0 | DB-010, API-004, API-002 |
| API-012 | Create Message service, controller, routes (admin: list, read, archive, delete) | P0 | DB-011, API-004 |
| API-013 | Create Profile service, controller, validator, routes (GET + PUT upsert) | P0 | DB-003, API-004, API-002 |
| API-014 | Create Social Link service, controller, validator, routes | P1 | DB-013, API-004 |
| API-015 | Create Settings service, controller, validator, routes (GET + PUT upsert) | P1 | DB-014, API-004 |
| API-016 | Create Dashboard service, controller, routes (GET stats) | P0 | DB-005, DB-010, DB-011, API-004 |
| API-017 | Create CV upload/delete routes (uses Cloudinary + Settings model) | P1 | DB-014, API-002, API-003, API-004 |
| API-018 | Create Media service, controller, routes (list, upload, delete) | P1 | DB-012, API-002, API-003, API-004 |
| API-019 | Configure Swagger/OpenAPI (`src/config/swagger.ts`) | P1 | BACKEND-001 |
| API-020 | Add JSDoc Swagger annotations to all admin endpoints | P2 | API-019, API-005 through API-018 |
| API-021 | Wire Swagger UI at `GET /api/docs` | P1 | API-019 |

#### Subtasks per Resource (API-005 through API-018)

For each resource, create:

1. `src/validators/<resource>.validator.ts` — express-validator chains for create/update
2. `src/services/<resource>.service.ts` — business logic (CRUD operations via Mongoose)
3. `src/controllers/admin/<resource>.controller.ts` — request handling, response formatting
4. `src/routes/admin/<resource>.routes.ts` — route definitions with middleware

#### Files / Modules

```
backend/src/
├── config/
│   ├── cloudinary.ts       # API-001
│   └── swagger.ts          # API-019
├── middleware/
│   └── upload.middleware.ts # API-003
├── services/
│   ├── cloudinary.service.ts   # API-002
│   ├── category.service.ts     # API-005
│   ├── project.service.ts      # API-006
│   ├── skill.service.ts        # API-007
│   ├── experience.service.ts   # API-008
│   ├── education.service.ts    # API-009
│   ├── certification.service.ts # API-010
│   ├── blog.service.ts         # API-011
│   ├── message.service.ts      # API-012
│   ├── profile.service.ts      # API-013
│   ├── socialLink.service.ts   # API-014
│   ├── settings.service.ts     # API-015
│   └── dashboard.service.ts    # API-016
├── controllers/admin/
│   ├── category.controller.ts
│   ├── project.controller.ts
│   ├── skill.controller.ts
│   ├── experience.controller.ts
│   ├── education.controller.ts
│   ├── certification.controller.ts
│   ├── blog.controller.ts
│   ├── message.controller.ts
│   ├── profile.controller.ts
│   ├── socialLink.controller.ts
│   ├── settings.controller.ts
│   ├── cv.controller.ts
│   ├── media.controller.ts
│   └── dashboard.controller.ts
├── validators/
│   ├── category.validator.ts
│   ├── project.validator.ts
│   ├── skill.validator.ts
│   ├── experience.validator.ts
│   ├── education.validator.ts
│   ├── certification.validator.ts
│   ├── blog.validator.ts
│   ├── profile.validator.ts
│   ├── socialLink.validator.ts
│   └── settings.validator.ts
└── routes/admin/
    ├── index.ts
    ├── category.routes.ts
    ├── project.routes.ts
    ├── skill.routes.ts
    ├── experience.routes.ts
    ├── education.routes.ts
    ├── certification.routes.ts
    ├── blog.routes.ts
    ├── message.routes.ts
    ├── profile.routes.ts
    ├── socialLink.routes.ts
    ├── settings.routes.ts
    ├── cv.routes.ts
    ├── media.routes.ts
    └── dashboard.routes.ts
```

#### Technical Notes

- All admin routes require `authenticate` + `authorize('admin')` middleware
- Category delete should check for references in Projects/BlogPosts before allowing
- BlogPost publish/unpublish: Separate `PATCH /:id/publish` and `PATCH /:id/unpublish` endpoints
- Cloudinary upload: Use SDK, return URL and publicId; store metadata in Media collection
- Multer: Use memory storage (not disk); limit file size (5MB images, 10MB PDFs); filter MIME types
- Dashboard stats: Simple `countDocuments()` calls — no complex aggregations

#### Testing

- Each CRUD endpoint returns correct status codes (200, 201, 204, 400, 401, 404)
- Validation rejects invalid data with field-level errors
- File upload stores in Cloudinary and returns URL
- Dashboard stats returns correct counts
- All endpoints require authentication (return 401 without token)

#### Acceptance Criteria

- [ ] All admin endpoints per PRD Section 12.3 are functional
- [ ] CRUD operations persist to MongoDB correctly
- [ ] Validation errors return 400 with field-specific messages
- [ ] Image upload to Cloudinary works
- [ ] PDF upload (CV) works
- [ ] All admin endpoints return 401 without authentication
- [ ] Swagger UI accessible at `/api/docs`
- [ ] Dashboard stats endpoint returns correct counts

#### Definition of Done

- [x] All admin CRUD endpoints implemented and returning correct data
- [x] Cloudinary integration working for uploads and deletes
- [x] Swagger documentation accessible
- [x] All routes protected by auth middleware

---

### Phase 5 — Public API

#### Objective

Implement all public read-only API endpoints per PRD Section 12.2. These serve published content only and require no authentication.

#### Dependencies

- Phase 4 (API-* admin endpoints and services created)

#### Deliverables

- All public endpoints
- Server-side pagination with search/filter
- Contact form submission (with honeypot, rate limiting, email)
- CV download with counter
- View count increment

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| PUB-001 | Create public controller (`src/controllers/public.controller.ts`) | P0 | API-006 through API-015 |
| PUB-002 | Create contact validator (`src/validators/contact.validator.ts`) | P0 | BACKEND-009 |
| PUB-003 | Create email config (`src/config/email.ts`) | P1 | BACKEND-001 |
| PUB-004 | Create email service (`src/services/email.service.ts`) | P1 | PUB-003 |
| PUB-005 | Create public routes (`src/routes/public.routes.ts`) | P0 | PUB-001 |
| PUB-006 | Implement `GET /api/v1/profile` — return profile data | P0 | PUB-005 |
| PUB-007 | Implement `GET /api/v1/projects` — published only, pagination, filter, search | P0 | PUB-005 |
| PUB-008 | Implement `GET /api/v1/projects/:slug` — by slug, increment viewCount | P0 | PUB-005 |
| PUB-009 | Implement `GET /api/v1/skills` — visible only, grouped by category | P0 | PUB-005 |
| PUB-010 | Implement `GET /api/v1/experiences` — sorted, with type filter | P0 | PUB-005 |
| PUB-011 | Implement `GET /api/v1/education` — sorted | P0 | PUB-005 |
| PUB-012 | Implement `GET /api/v1/certifications` — visible, with type filter | P1 | PUB-005 |
| PUB-013 | Implement `GET /api/v1/blog` — published only, pagination, filter, search | P0 | PUB-005 |
| PUB-014 | Implement `GET /api/v1/blog/:slug` — by slug, increment viewCount | P0 | PUB-005 |
| PUB-015 | Implement `GET /api/v1/categories` — with type filter | P0 | PUB-005 |
| PUB-016 | Implement `GET /api/v1/social-links` — visible only | P1 | PUB-005 |
| PUB-017 | Implement `GET /api/v1/settings/public` — public settings subset | P1 | PUB-005 |
| PUB-018 | Implement `POST /api/v1/contact` — validate, honeypot check, store, send email | P0 | PUB-002, PUB-004, DB-011 |
| PUB-019 | Implement `GET /api/v1/cv/download` — serve CV file, increment counter | P1 | DB-014 |
| PUB-020 | Add contact-specific rate limiting (5 per IP per hour) | P0 | BACKEND-015, PUB-018 |

#### Files / Modules

```
backend/src/
├── config/
│   └── email.ts            # PUB-003
├── services/
│   └── email.service.ts    # PUB-004
├── controllers/
│   └── public.controller.ts # PUB-001
├── validators/
│   └── contact.validator.ts # PUB-002
└── routes/
    └── public.routes.ts     # PUB-005
```

#### Technical Notes

- Public endpoints filter by `status: 'published'` and `isVisible: true` where applicable
- Pagination format per PRD Section 13.2
- Search: Case-insensitive regex on title/description fields (sufficient for small dataset)
- Contact honeypot: If `honeypot` field is non-empty, return 201 (pretend success) but don't store
- Email notification: Send async, don't block the response; gracefully handle email failures
- View count: Use `$inc` atomic operation; don't require auth

#### Testing

- Public endpoints return only published/visible content
- Pagination returns correct `totalPages`, `hasNextPage`, `hasPrevPage`
- Contact form with valid data stores message and returns 201
- Contact form with honeypot filled silently rejects
- Contact rate limit returns 429 after 5 requests in 1 hour

#### Acceptance Criteria

- [ ] All public endpoints per PRD Section 12.2 are functional
- [ ] Public endpoints return ONLY published content
- [ ] Pagination works with correct totals
- [ ] Search and filtering work
- [ ] Contact form validates, stores in DB, and triggers email
- [ ] Honeypot rejects bot submissions silently
- [ ] CV download increments counter
- [ ] View counts increment on project/blog detail

#### Definition of Done

- [x] All public read-only endpoints return correct data
- [x] Contact form end-to-end flow working
- [x] Email notification sent on contact submission
- [x] Rate limiting applied to contact endpoint

---

### Phase 6 — Seed Data

#### Objective

Create a comprehensive seed script that populates all collections with realistic demo data.

#### Dependencies

- Phase 4 (all models and services available)

#### Deliverables

- Complete seed script
- `npm run seed` command
- Realistic bilingual demo data

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| SEED-001 | Extend seed script with profile data (bilingual) | P0 | AUTH-010, DB-003 |
| SEED-002 | Add skills seed data (all categories, 10+ skills) | P0 | DB-006 |
| SEED-003 | Add category seed data (project + blog categories) | P0 | DB-004 |
| SEED-004 | Add project seed data (3-5 published projects, bilingual) | P0 | DB-005, SEED-003 |
| SEED-005 | Add experience seed data (2-3 entries, bilingual) | P0 | DB-007 |
| SEED-006 | Add education seed data (1-2 entries, bilingual) | P0 | DB-008 |
| SEED-007 | Add certification seed data (1-2 entries) | P1 | DB-009 |
| SEED-008 | Add blog post seed data (2-3 posts with Markdown content) | P1 | DB-010, SEED-003 |
| SEED-009 | Add social link seed data (GitHub, LinkedIn, Email) | P1 | DB-013 |
| SEED-010 | Add settings seed data | P1 | DB-014 |
| SEED-011 | Add clear/reset functionality with safety check | P1 | SEED-001 |

#### Technical Notes

- Seed uses placeholder Cloudinary URLs or `https://via.placeholder.com/` for images
- Admin password is hashed via the User model's pre-save hook
- Seed script: connect → clear → insert → log → disconnect
- Add `--force` flag for production safety check
- Blog post content should be real Markdown with headers, code blocks, lists

#### Acceptance Criteria

- [ ] `npm run seed` populates all collections
- [ ] Admin can log in with seeded credentials (`admin@portfolio.dev` / `Admin@123456`)
- [ ] Public API returns seeded content
- [ ] Seed script is idempotent (can run multiple times)

---

### Phase 7 — Angular Frontend Foundation

#### Objective

Establish the Angular application architecture: routing, core services, shared components, HTTP configuration, and the design system.

#### Dependencies

- Phase 5 (Public API must be available for integration)

#### Deliverables

- Angular routing with lazy loading
- Core services (API, Auth, Theme, Language, Notification)
- HTTP interceptors (auth token, error handling)
- Route guards (auth, role)
- Shared components (header, footer, loading, empty state, pagination, etc.)
- Design system (CSS variables, typography, spacing)
- Angular Material theming
- Public layout component

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| FE-001 | Create global styles (`styles/_variables.css`, `_reset.css`, `_typography.css`) | P0 | SETUP-012 |
| FE-002 | Configure CSS custom properties for dark/light themes | P0 | FE-001 |
| FE-003 | Configure Angular Material custom theme | P0 | SETUP-013, FE-002 |
| FE-004 | Import Google Fonts (Inter, Noto Sans Khmer, JetBrains Mono) | P0 | FE-001 |
| FE-005 | Create TypeScript interfaces/models (`core/models/*.model.ts`) | P0 | SETUP-012 |
| FE-006 | Create API service (`core/services/api.service.ts`) — base HTTP methods | P0 | SETUP-016 |
| FE-007 | Create Auth service (`core/services/auth.service.ts`) — login, logout, token, user signal | P0 | FE-006 |
| FE-008 | Create Auth interceptor (`core/interceptors/auth.interceptor.ts`) — attach Bearer token | P0 | FE-007 |
| FE-009 | Create Error interceptor (`core/interceptors/error.interceptor.ts`) — handle 401 refresh, errors | P0 | FE-007 |
| FE-010 | Create Auth guard (`core/guards/auth.guard.ts`) — protect `/admin/*` routes | P0 | FE-007 |
| FE-011 | Create Role guard (`core/guards/role.guard.ts`) | P2 | FE-007 |
| FE-012 | Create Theme service (`core/services/theme.service.ts`) — signal-based, localStorage | P0 | FE-002 |
| FE-013 | Create Language service (`core/services/language.service.ts`) — signal-based, localStorage | P1 | SETUP-012 |
| FE-014 | Create Notification service (`core/services/notification.service.ts`) — Angular Material Snackbar | P0 | SETUP-013 |
| FE-015 | Create localize pipe (`shared/pipes/localize.pipe.ts`) — selects `en` or `kh` field | P1 | FE-013 |
| FE-016 | Create truncate pipe (`shared/pipes/truncate.pipe.ts`) | P2 | SETUP-012 |
| FE-017 | Create Header component (`shared/components/header/`) — nav, theme toggle, language switcher | P0 | FE-012, FE-013 |
| FE-018 | Create Footer component (`shared/components/footer/`) — social links, copyright | P0 | SETUP-012 |
| FE-019 | Create Theme Toggle component (`shared/components/theme-toggle/`) | P0 | FE-012 |
| FE-020 | Create Language Switcher component (`shared/components/language-switcher/`) | P1 | FE-013 |
| FE-021 | Create Loading Spinner component (`shared/components/loading-spinner/`) | P0 | SETUP-012 |
| FE-022 | Create Empty State component (`shared/components/empty-state/`) | P0 | SETUP-012 |
| FE-023 | Create Pagination component (`shared/components/pagination/`) | P0 | SETUP-012 |
| FE-024 | Create Confirm Dialog component (`shared/components/confirm-dialog/`) | P0 | SETUP-013 |
| FE-025 | Create Public Layout component (header + `<router-outlet>` + footer) | P0 | FE-017, FE-018 |
| FE-026 | Configure app routing (`app.routes.ts`) with lazy-loaded feature routes | P0 | SETUP-012 |
| FE-027 | Configure `app.config.ts` with providers (HttpClient, Router, Material, interceptors) | P0 | FE-008, FE-009 |
| FE-028 | Create Skeleton Loader component (`shared/components/skeleton-loader/`) | P1 | SETUP-012 |

#### Files / Modules

```
frontend/src/
├── styles/
│   ├── _variables.css      # FE-001, FE-002
│   ├── _reset.css          # FE-001
│   ├── _typography.css     # FE-001
│   └── styles.css          # FE-001
├── app/
│   ├── core/
│   │   ├── models/         # FE-005
│   │   ├── services/       # FE-006 through FE-014
│   │   ├── interceptors/   # FE-008, FE-009
│   │   └── guards/         # FE-010, FE-011
│   ├── shared/
│   │   ├── components/     # FE-017 through FE-028
│   │   └── pipes/          # FE-015, FE-016
│   ├── app.routes.ts       # FE-026
│   ├── app.config.ts       # FE-027
│   └── app.component.ts
```

#### Technical Notes

- Use Angular Signals for reactive state in services (auth user, theme, language)
- Interceptors use the new functional interceptor pattern (Angular 15+)
- Guards use the new functional guard pattern
- All routes lazy-loaded via `loadComponent` or `loadChildren`
- CSS custom properties defined in `_variables.css` — all components use `var(--color-*)` etc.
- Angular Material themed to match the CSS custom properties
- API service is a thin wrapper: `get<T>()`, `post<T>()`, `patch<T>()`, `put<T>()`, `delete()` — uses `environment.apiUrl` as base

#### Acceptance Criteria

- [ ] App compiles and runs without errors
- [ ] Theme toggle switches between dark and light mode
- [ ] Header renders with navigation links
- [ ] Footer renders with placeholder social links
- [ ] Routing navigates between placeholder pages
- [ ] CSS custom properties apply correct colors per theme

---

### Phase 8 — Public Portfolio Pages

#### Objective

Build all public-facing pages that consume the public API and display portfolio content.

#### Dependencies

- Phase 7 (FE-* foundation complete)
- Phase 5 (PUB-* public API available)
- Phase 6 (SEED-* data available for testing)

#### Deliverables

- All public pages per PRD Section 8
- Responsive design (360px to 1440px+)

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| PAGE-001 | Create Home page component with hero, featured projects, skills overview, CTAs | P0 | FE-025, PUB-006, PUB-007, PUB-009 |
| PAGE-002 | Create About page component | P0 | FE-025, PUB-006 |
| PAGE-003 | Create Skills page component — grouped by category, badge/chip layout | P0 | FE-025, PUB-009 |
| PAGE-004 | Create Experience page component — timeline layout | P0 | FE-025, PUB-010 |
| PAGE-005 | Create Education page component | P0 | FE-025, PUB-011 |
| PAGE-006 | Create Projects List page — card grid, category filter, search, pagination | P0 | FE-025, PUB-007, FE-023 |
| PAGE-007 | Create Project Detail page — case study layout, Markdown rendering | P0 | FE-025, PUB-008 |
| PAGE-008 | Create Blog List page — card layout, category/tag filter, search, pagination | P0 | FE-025, PUB-013, FE-023 |
| PAGE-009 | Create Blog Detail page — Markdown rendering with code highlighting | P0 | FE-025, PUB-014 |
| PAGE-010 | Create Achievements/Certifications page | P1 | FE-025, PUB-012 |
| PAGE-011 | Create Contact page with form validation and submission | P0 | FE-025, PUB-018 |
| PAGE-012 | Create 404 Not Found page | P0 | FE-025 |
| PAGE-013 | Install and configure `ngx-markdown` for Markdown rendering | P0 | SETUP-012 |
| PAGE-014 | Create project card component (reusable) | P0 | FE-005 |
| PAGE-015 | Create blog card component (reusable) | P0 | FE-005 |
| PAGE-016 | Make all pages responsive (mobile, tablet, desktop) | P0 | PAGE-001 through PAGE-012 |
| PAGE-017 | Add route transition animations (optional subtle fade) | P3 | FE-026 |

#### Technical Notes

- Home page sections: Hero → Featured Projects (3-4 cards) → Skills Overview → Experience Summary → Education Summary → Contact CTA → Social Links
- Project Detail: Use `ngx-markdown` to render `fullDescription`, `problem`, `solution` fields
- Blog Detail: Use `ngx-markdown` with syntax highlighting for code blocks
- Contact form: Angular Reactive Forms with client-side validation per PRD Section 8.11
- Responsive: Use Tailwind CSS breakpoints (`sm`, `md`, `lg`, `xl`)
- Skeleton loaders shown while data is loading

#### Acceptance Criteria

- [ ] All public pages render content from the API
- [ ] Project list supports category filter, search, and pagination
- [ ] Project detail renders Markdown correctly
- [ ] Blog detail renders Markdown with syntax-highlighted code blocks
- [ ] Contact form validates all fields client-side before submission
- [ ] Contact form shows success/error feedback
- [ ] All pages responsive at 360px, 768px, 1024px, 1440px
- [ ] 404 page displayed for unknown routes
- [ ] Navigation between all pages works without errors

---

### Phase 9 — Admin Dashboard — Layout & Auth

#### Objective

Build the admin dashboard shell: layout, sidebar, header, login page, and auth flow.

#### Dependencies

- Phase 7 (FE-007 auth service, FE-010 auth guard)

#### Deliverables

- Admin login page
- Admin layout (sidebar + header + content area)
- Admin sidebar navigation
- Auth flow (login → dashboard, logout → login)

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| ADMIN-001 | Create admin login page (`features/admin/login/`) | P0 | FE-007 |
| ADMIN-002 | Create admin layout component (`features/admin/layout/admin-layout/`) | P0 | FE-010 |
| ADMIN-003 | Create admin sidebar component (`features/admin/layout/admin-sidebar/`) | P0 | ADMIN-002 |
| ADMIN-004 | Create admin header component (`features/admin/layout/admin-header/`) | P0 | ADMIN-002 |
| ADMIN-005 | Configure admin routing (`features/admin/admin.routes.ts`) — lazy loaded | P0 | FE-026, ADMIN-002 |
| ADMIN-006 | Create admin dashboard overview page with stat cards | P0 | ADMIN-002, API-016 |
| ADMIN-007 | Implement login → redirect to dashboard flow | P0 | ADMIN-001, FE-007 |
| ADMIN-008 | Implement logout → redirect to login flow | P0 | FE-007, ADMIN-004 |
| ADMIN-009 | Make admin sidebar responsive (collapsible drawer on mobile) | P0 | ADMIN-003 |

#### Technical Notes

- Admin routes lazy-loaded under `/admin`
- Auth guard redirects unauthenticated users to `/admin/login`
- Login page: email + password form with validation
- Sidebar: All 15 sections per PRD Section 9.1 with icons (Angular Material icons)
- Dashboard: Stat cards with counts from `GET /api/v1/admin/dashboard/stats`
- Quick action buttons: "New Project", "New Blog Post"
- Recent unread messages list (last 5)

#### Acceptance Criteria

- [ ] Admin login page renders with email/password form
- [ ] Successful login redirects to `/admin/dashboard`
- [ ] Failed login shows error message
- [ ] Dashboard displays stat cards with real data
- [ ] Sidebar shows all navigation items with icons
- [ ] Logout clears session and redirects to login
- [ ] Unauthenticated access to `/admin/*` redirects to login
- [ ] Admin layout responsive on mobile

---

### Phase 10 — Admin Dashboard — CRUD Sections

#### Objective

Implement all admin CRUD UI sections following the reusable patterns established in Phase 9.

#### Dependencies

- Phase 9 (ADMIN-002 layout, ADMIN-005 routing)
- Phase 4 (all admin API endpoints)

#### Deliverables

- All CRUD sections per PRD Section 9
- Bilingual form fields (EN/KH tabs)
- Image upload with preview
- Form validation
- Toast notifications
- Confirm delete dialogs

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| ADMIN-010 | Create reusable admin data table component (search, filter, sort, pagination) | P0 | FE-023 |
| ADMIN-011 | Create reusable bilingual form field component (EN/KH tabs) | P0 | SETUP-013 |
| ADMIN-012 | Create reusable image upload component with preview | P0 | API-002 |
| ADMIN-013 | Create admin project list page | P0 | ADMIN-010, API-006 |
| ADMIN-014 | Create admin project form (create/edit) page | P0 | ADMIN-011, ADMIN-012, API-006 |
| ADMIN-015 | Create admin skill list and form pages | P0 | ADMIN-010, API-007 |
| ADMIN-016 | Create admin experience list and form pages | P0 | ADMIN-010, ADMIN-011, API-008 |
| ADMIN-017 | Create admin education list and form pages | P0 | ADMIN-010, ADMIN-011, API-009 |
| ADMIN-018 | Create admin certification list and form pages | P1 | ADMIN-010, ADMIN-011, API-010 |
| ADMIN-019 | Create admin blog list and form pages | P0 | ADMIN-010, ADMIN-011, API-011 |
| ADMIN-020 | Create Markdown editor component (textarea + preview side-by-side) | P0 | PAGE-013 |
| ADMIN-021 | Create admin category list (inline create/edit) | P0 | ADMIN-010, API-005 |
| ADMIN-022 | Create admin message list and detail pages | P0 | ADMIN-010, API-012 |
| ADMIN-023 | Create admin media library page (grid, upload, delete, copy URL) | P1 | ADMIN-012, API-018 |
| ADMIN-024 | Create admin CV management page (upload PDF, view current, delete) | P1 | ADMIN-012, API-017 |
| ADMIN-025 | Create admin social links page (list, create/edit, reorder) | P1 | API-014 |
| ADMIN-026 | Create admin profile page (form with bilingual fields + image upload) | P0 | ADMIN-011, ADMIN-012, API-013 |
| ADMIN-027 | Create admin settings page | P1 | API-015 |
| ADMIN-028 | Add unsaved changes warning (canDeactivate guard) | P2 | FE-026 |
| ADMIN-029 | Wire unread message count badge in sidebar | P1 | ADMIN-003, API-012 |

#### Technical Notes

- Data table component: Accepts column configuration, data source, and action callbacks
- Bilingual tabs: Angular Material Tabs with "English" and "ខ្មែរ" labels
- Image upload: Show preview, validate MIME and size client-side, upload via FormData
- All forms use Angular Reactive Forms with real-time validation
- Delete: Confirm dialog shows item name; on confirm, calls DELETE endpoint
- Success/error: Use notification service (Angular Material Snackbar)
- Blog form: Side-by-side textarea + `ngx-markdown` preview
- Category list: Inline add/edit (dialog or inline form) since categories are simple

#### Acceptance Criteria

- [ ] All CRUD sections listed in PRD Section 9 are implemented
- [ ] Create, edit, and delete operations work end-to-end
- [ ] Forms validate required fields with inline error messages
- [ ] Image upload shows preview and stores in Cloudinary
- [ ] Bilingual fields have EN/KH tab interface
- [ ] Delete shows confirmation dialog with item name
- [ ] Toast notifications on success/error
- [ ] Admin data tables support search, filter, sort, and pagination

---

### Phase 11 — Blog System (Full Stack)

#### Objective

Polish the blog system: Markdown editor in admin, Markdown rendering on public pages with code syntax highlighting, reading time, related posts.

#### Dependencies

- Phase 10 (ADMIN-019 blog list/form, ADMIN-020 Markdown editor)
- Phase 8 (PAGE-008, PAGE-009 blog pages)

#### Deliverables

- Blog admin with Markdown editing and preview
- Blog public with rendered Markdown and code highlighting
- Reading time display
- Related posts section

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| BLOG-001 | Ensure blog Markdown editor has syntax highlighting in the textarea | P2 | ADMIN-020 |
| BLOG-002 | Add reading time display to blog cards and detail page | P1 | PAGE-008, PAGE-009 |
| BLOG-003 | Add related posts section to blog detail (2-3 from same category) | P1 | PAGE-009, PUB-013 |
| BLOG-004 | Add related projects section to project detail (2-3 from same category) | P1 | PAGE-007, PUB-007 |
| BLOG-005 | Add publish/unpublish quick action on blog list | P1 | ADMIN-019, API-011 |

#### Acceptance Criteria

- [ ] Blog Markdown preview renders correctly alongside editor
- [ ] Code blocks in blog posts have syntax highlighting
- [ ] Reading time shown on blog cards and detail page
- [ ] Related posts section shows 2-3 relevant posts

---

### Phase 12 — Media & CV Management

#### Objective

Polish the media library and CV management features.

#### Dependencies

- Phase 10 (ADMIN-023 media library, ADMIN-024 CV management)

#### Deliverables

- Fully functional media library with grid view, upload, delete, copy URL
- CV upload and download system

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| MEDIA-001 | Implement media library grid view with file metadata display | P1 | ADMIN-023 |
| MEDIA-002 | Implement multi-file upload in media library | P1 | ADMIN-023 |
| MEDIA-003 | Add copy-to-clipboard for media URLs | P1 | ADMIN-023 |
| MEDIA-004 | Implement CV download button on public pages (home, nav) | P1 | PUB-019 |
| MEDIA-005 | Add file type filtering in media library | P2 | MEDIA-001 |

#### Acceptance Criteria

- [ ] Media library displays uploaded images in a grid
- [ ] Upload new images to media library
- [ ] Delete images (removes from Cloudinary + DB)
- [ ] Copy media URL to clipboard
- [ ] CV download works from public pages

---

### Phase 13 — Contact System

#### Objective

Complete the contact system end-to-end: form, API, email notification, admin message management.

#### Dependencies

- Phase 8 (PAGE-011 contact page)
- Phase 10 (ADMIN-022 message management)

#### Deliverables

- Contact form with honeypot spam protection
- Email notification to admin
- Message management in admin dashboard

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| CONTACT-001 | Verify contact form honeypot field is hidden and works | P0 | PAGE-011, PUB-018 |
| CONTACT-002 | Verify email notification sends on contact submission | P1 | PUB-004 |
| CONTACT-003 | Add contact info display alongside form (email, social links, location) | P0 | PAGE-011, PUB-006, PUB-016 |
| CONTACT-004 | Verify mark as read/unread works in admin message list | P0 | ADMIN-022 |
| CONTACT-005 | Add unread count to admin sidebar badge | P0 | ADMIN-029 |

#### Acceptance Criteria

- [ ] Contact form submission stores message and shows success
- [ ] Honeypot rejects bot submissions silently
- [ ] Email notification sent to admin on new message
- [ ] Admin can view, read/unread, and delete messages
- [ ] Unread count badge visible in admin sidebar

---

### Phase 14 — Multilingual Support (i18n)

#### Objective

Implement full English/Khmer language switching for both static UI labels and dynamic content.

#### Dependencies

- Phase 8 (public pages using dynamic content)
- Phase 10 (admin using bilingual forms)
- Phase 7 (FE-013 language service, FE-020 language switcher)

#### Deliverables

- `ngx-translate` setup with EN/KH translation files
- Language switcher in header
- All static UI labels translated
- Dynamic content displays correct language field

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| I18N-001 | Install and configure `ngx-translate` | P1 | SETUP-012 |
| I18N-002 | Create `assets/i18n/en.json` with all static UI labels | P1 | I18N-001 |
| I18N-003 | Create `assets/i18n/kh.json` with all Khmer translations | P1 | I18N-002 |
| I18N-004 | Apply `translate` pipe to all navigation labels | P1 | I18N-001, FE-017 |
| I18N-005 | Apply `translate` pipe to all button text | P1 | I18N-001 |
| I18N-006 | Apply `translate` pipe to all form labels and placeholders | P1 | I18N-001 |
| I18N-007 | Apply `translate` pipe to all error/empty/loading messages | P1 | I18N-001 |
| I18N-008 | Apply localize pipe to all dynamic bilingual content | P1 | FE-015 |
| I18N-009 | Verify language switcher persists preference in localStorage | P1 | FE-020 |
| I18N-010 | Set default language to English, with fallback from `kh` to `en` | P1 | I18N-001 |

#### Technical Notes

- `ngx-translate` for static UI text (runtime switching, no rebuild needed)
- Localize pipe for dynamic API content: reads current language, returns `field.en` or `field.kh`
- Fallback: If Khmer text is empty, show English text
- Language preference stored in `localStorage` key `language`
- Apply `lang` attribute on `<html>` when switching for proper font rendering

#### Acceptance Criteria

- [ ] Language switcher toggles between EN and KH
- [ ] All navigation, buttons, and system messages change language
- [ ] Dynamic content (projects, skills, etc.) shows correct language
- [ ] Language preference persists across page reloads
- [ ] Khmer text renders with Noto Sans Khmer font

---

### Phase 15 — Theme & Accessibility

#### Objective

Polish the dark/light theme system and implement accessibility requirements.

#### Dependencies

- Phase 8 (public pages complete for a11y audit)
- Phase 10 (admin pages complete for a11y audit)

#### Deliverables

- Polished dark/light theme with smooth transitions
- WCAG 2.2 AA compliance where practical
- Keyboard navigation
- Screen reader support

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| THEME-001 | Verify CSS custom properties apply correctly in both themes | P0 | FE-002 |
| THEME-002 | Verify system preference detection (`prefers-color-scheme`) | P0 | FE-012 |
| THEME-003 | Add smooth theme transition (CSS `transition` on background/color) | P1 | THEME-001 |
| THEME-004 | Verify color contrast ratios meet WCAG AA (4.5:1 text, 3:1 large) | P0 | FE-002 |
| A11Y-001 | Add semantic HTML elements to all pages (`header`, `nav`, `main`, `article`, `section`, `footer`) | P0 | PAGE-001 through PAGE-012 |
| A11Y-002 | Add `aria-label` to all icon-only buttons | P0 | FE-017, FE-019, FE-020 |
| A11Y-003 | Ensure all form fields have associated `<label>` elements | P0 | PAGE-011, ADMIN-014 |
| A11Y-004 | Add `aria-describedby` linking error messages to form fields | P0 | PAGE-011 |
| A11Y-005 | Add visible focus indicators on all interactive elements | P0 | FE-001 |
| A11Y-006 | Add skip-to-content link | P1 | FE-025 |
| A11Y-007 | Add `alt` text to all informational images | P0 | PAGE-001 through PAGE-012 |
| A11Y-008 | Respect `prefers-reduced-motion` | P1 | FE-001 |
| A11Y-009 | Test keyboard navigation through all pages | P0 | PAGE-001 through PAGE-012 |

#### Acceptance Criteria

- [ ] Theme toggle works and persists
- [ ] System dark mode preference detected on first visit
- [ ] Smooth transition between themes
- [ ] Color contrast meets WCAG AA
- [ ] All pages navigable by keyboard
- [ ] Screen reader announces page content correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] `alt` text on all images

---

### Phase 16 — SEO & Performance

#### Objective

Optimize for search engines and page load performance.

#### Dependencies

- Phase 8 (public pages complete)
- Phase 15 (a11y complete)

#### Deliverables

- Dynamic page titles and meta descriptions
- Open Graph metadata
- robots.txt and sitemap
- Performance optimizations
- Angular production build optimization

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| SEO-001 | Create SEO service to dynamically set `<title>` and `<meta>` per route | P0 | FE-026 |
| SEO-002 | Add unique title + meta description to each public page | P0 | SEO-001, PAGE-001 through PAGE-012 |
| SEO-003 | Add Open Graph metadata to project detail pages | P0 | SEO-001, PAGE-007 |
| SEO-004 | Add Open Graph metadata to blog detail pages | P0 | SEO-001, PAGE-009 |
| SEO-005 | Create `robots.txt` (allow public, disallow `/admin` and `/api`) | P0 | SETUP-012 |
| SEO-006 | Create static `sitemap.xml` | P1 | SETUP-012 |
| SEO-007 | Verify all routes are lazy-loaded (check bundle analysis) | P0 | FE-026 |
| SEO-008 | Add `loading="lazy"` to below-fold images | P0 | PAGE-001 through PAGE-012 |
| SEO-009 | Add compression middleware (gzip/brotli) to backend | P1 | BACKEND-017 |
| SEO-010 | Verify Cloudinary image URLs use `f_auto,q_auto` transformations | P1 | PAGE-001 through PAGE-012 |
| SEO-011 | Run Lighthouse audit and fix issues above score 70 | P1 | SEO-001 through SEO-010 |
| SEO-012 | Add Twitter Card metadata | P2 | SEO-001 |

#### Acceptance Criteria

- [ ] Each page has unique `<title>` and `<meta description>`
- [ ] Open Graph tags present on project and blog pages
- [ ] `robots.txt` accessible and blocks `/admin` and `/api`
- [ ] All routes are lazy-loaded
- [ ] Lighthouse performance score >= 70

---

### Phase 17 — Testing & Quality

#### Objective

Implement test suites for backend and frontend with meaningful coverage.

#### Dependencies

- Phase 5 (backend API complete)
- Phase 10 (frontend CRUD complete)

#### Deliverables

- Backend unit tests
- Backend integration tests
- Frontend component tests
- Frontend service tests

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| TEST-001 | Configure backend Jest with `mongodb-memory-server` | P0 | SETUP-004 |
| TEST-002 | Create test setup/teardown helpers (`tests/setup.ts`, `tests/helpers/testDb.ts`) | P0 | TEST-001 |
| TEST-003 | Write unit tests for utility functions (slugify, pagination, readingTime, apiResponse) | P0 | TEST-001, BACKEND-010, BACKEND-011, BACKEND-012 |
| TEST-004 | Write unit tests for auth service (login, token generation) | P0 | TEST-002, AUTH-002 |
| TEST-005 | Write integration tests for auth endpoints (login, refresh, logout, me) | P0 | TEST-002, AUTH-007 |
| TEST-006 | Write integration tests for admin project CRUD endpoints | P0 | TEST-002, API-006 |
| TEST-007 | Write integration tests for admin skill CRUD endpoints | P1 | TEST-002, API-007 |
| TEST-008 | Write integration tests for public project endpoints | P0 | TEST-002, PUB-007, PUB-008 |
| TEST-009 | Write integration tests for contact form endpoint | P0 | TEST-002, PUB-018 |
| TEST-010 | Write integration tests for admin blog CRUD endpoints | P1 | TEST-002, API-011 |
| TEST-011 | Configure frontend Jest (or match Angular CLI test runner) | P0 | SETUP-012 |
| TEST-012 | Write component tests for Header, Footer | P1 | TEST-011, FE-017, FE-018 |
| TEST-013 | Write service tests for AuthService (login, logout, token storage) | P0 | TEST-011, FE-007 |
| TEST-014 | Write service tests for ThemeService | P1 | TEST-011, FE-012 |
| TEST-015 | Write guard tests for AuthGuard | P0 | TEST-011, FE-010 |
| TEST-016 | Write component tests for Login page | P0 | TEST-011, ADMIN-001 |
| TEST-017 | Write component tests for Contact form | P1 | TEST-011, PAGE-011 |
| TEST-018 | Verify all tests pass and coverage meets targets | P0 | TEST-003 through TEST-017 |

#### Technical Notes

- Backend: Use `mongodb-memory-server` for isolated test database
- Backend: Supertest for HTTP request testing
- Frontend: Match Angular CLI's test runner (Jest via `@angular/jest` or Karma)
- Coverage targets: Backend >= 60%, Frontend >= 50%
- Tests should run in CI pipeline

#### Acceptance Criteria

- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] Backend coverage >= 60%
- [ ] Frontend coverage >= 50%
- [ ] Auth flow fully tested (valid login, invalid login, expired token, refresh)
- [ ] CRUD operations have integration tests

---

### Phase 18 — Security Hardening

#### Objective

Apply all security measures specified in PRD Section 18.

#### Dependencies

- Phase 3 (auth implemented)
- Phase 4 (admin API implemented)
- Phase 5 (public API implemented)

#### Deliverables

- All security measures applied and verified
- No known vulnerabilities

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| SEC-001 | Verify Helmet is configured with all recommended headers | P0 | BACKEND-014 |
| SEC-002 | Verify CORS only allows configured origin(s) | P0 | BACKEND-002 |
| SEC-003 | Verify rate limiting on auth and contact endpoints | P0 | AUTH-009, PUB-020 |
| SEC-004 | Verify all user inputs sanitized (prevent XSS) | P0 | BACKEND-009 |
| SEC-005 | Verify MongoDB injection prevention (Mongoose schema types + query sanitization) | P0 | DB-002 through DB-014 |
| SEC-006 | Verify file upload restrictions (MIME type, extension, size) | P0 | API-003 |
| SEC-007 | Verify JWT secrets are different for access and refresh tokens | P0 | AUTH-001 |
| SEC-008 | Verify refresh token cookie settings (httpOnly, secure, sameSite) | P0 | AUTH-002 |
| SEC-009 | Verify error responses don't expose stack traces in production | P0 | BACKEND-004 |
| SEC-010 | Verify `.env` is in `.gitignore` and secrets never committed | P0 | SETUP-001 |
| SEC-011 | Run `npm audit` and fix critical/high vulnerabilities | P1 | SETUP-006 |
| SEC-012 | Verify password minimum length enforcement (8 chars) | P0 | DB-002 |
| SEC-013 | Add request body size limit in Express | P1 | BACKEND-017 |
| SEC-014 | Verify no sensitive data in logs (passwords, tokens, secrets) | P0 | BACKEND-006 |

#### Acceptance Criteria

- [ ] All 14 security measures verified
- [ ] No critical npm audit vulnerabilities
- [ ] Penetration test on auth endpoints passes
- [ ] Error messages generic in production mode

---

### Phase 19 — Docker & CI/CD

#### Objective

Containerize the application and set up CI/CD pipelines.

#### Dependencies

- Phase 17 (tests must pass for CI)
- Phase 18 (security applied)

#### Deliverables

- Production Dockerfiles
- Docker Compose for local dev
- GitHub Actions CI workflow (PR)
- GitHub Actions deploy workflow (main)

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| DEVOPS-001 | Create backend production Dockerfile (multi-stage build) | P1 | SETUP-011 |
| DEVOPS-002 | Create frontend production Dockerfile (build + nginx) | P1 | SETUP-012 |
| DEVOPS-003 | Create `nginx.conf` for frontend static serving | P1 | DEVOPS-002 |
| DEVOPS-004 | Create `docker-compose.yml` for production (no local MongoDB) | P1 | DEVOPS-001, DEVOPS-002 |
| DEVOPS-005 | Verify `docker-compose -f docker-compose.dev.yml up` works end-to-end | P0 | SETUP-017 |
| DEVOPS-006 | Add health check endpoint verification in Docker | P1 | DEVOPS-001 |
| DEVOPS-007 | Create GitHub Actions CI workflow (`.github/workflows/ci.yml`) | P1 | TEST-018 |
| DEVOPS-008 | Create GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) | P2 | DEVOPS-007 |
| DEVOPS-009 | Document required GitHub secrets | P1 | DEVOPS-008 |

#### Files / Modules

```
portfolio/
├── .github/workflows/
│   ├── ci.yml              # DEVOPS-007
│   └── deploy.yml          # DEVOPS-008
├── frontend/
│   ├── Dockerfile          # DEVOPS-002
│   └── nginx.conf          # DEVOPS-003
├── backend/
│   └── Dockerfile          # DEVOPS-001
├── docker-compose.yml      # DEVOPS-004
└── docker-compose.dev.yml  # SETUP-017
```

#### Technical Notes

- Backend Dockerfile: Multi-stage (build + production); uses `node:20-alpine`
- Frontend Dockerfile: Multi-stage (build + nginx:alpine)
- Production compose uses MongoDB Atlas (no local MongoDB container)
- CI workflow: Install → Lint → Test → Build (both projects)
- Deploy workflow: Install → Lint → Test → Build → Deploy hooks
- Health checks: Backend `GET /api/v1/health`, Frontend `GET /`

#### Acceptance Criteria

- [ ] `docker-compose -f docker-compose.dev.yml up` runs full stack locally
- [ ] Production Docker build succeeds for both projects
- [ ] GitHub Actions CI passes on PR
- [ ] GitHub Actions deploy triggers on push to main

---

### Phase 20 — Production Deployment & Final QA

#### Objective

Deploy the application to production and perform final quality assurance.

#### Dependencies

- Phase 19 (Docker + CI/CD ready)

#### Deliverables

- Live portfolio at production URL
- Complete documentation
- Final QA checklist passed

#### Tasks

| ID | Task | Priority | Dependencies |
|----|------|----------|--------------|
| DEPLOY-001 | Set up MongoDB Atlas cluster (free M0 tier) | P0 | DB-001 |
| DEPLOY-002 | Set up Cloudinary account and configure upload presets | P0 | API-001 |
| DEPLOY-003 | Deploy backend to Render/Railway | P0 | DEVOPS-001 |
| DEPLOY-004 | Deploy frontend to Vercel/Netlify | P0 | DEVOPS-002 |
| DEPLOY-005 | Configure environment variables in hosting platforms | P0 | DEPLOY-003, DEPLOY-004 |
| DEPLOY-006 | Configure CORS for production domain | P0 | DEPLOY-004 |
| DEPLOY-007 | Run seed script on production database | P0 | SEED-001, DEPLOY-001 |
| DEPLOY-008 | Configure email service for production (Resend/SendGrid) | P1 | PUB-003 |
| DEPLOY-009 | Configure custom domain (if available) | P2 | DEPLOY-003, DEPLOY-004 |
| DEPLOY-010 | Verify HTTPS is enabled | P0 | DEPLOY-003, DEPLOY-004 |
| DOC-001 | Complete `README.md` with full setup, usage, and architecture docs | P0 | DEPLOY-004 |
| DOC-002 | Create `docs/SETUP.md` — local development setup guide | P1 | DEPLOY-004 |
| DOC-003 | Create `docs/DEPLOYMENT.md` — production deployment guide | P1 | DEPLOY-004 |
| DOC-004 | Create `docs/API.md` — API reference (or point to Swagger) | P1 | API-021 |
| DOC-005 | Move `PRD.md` to `docs/PRD.md` | P2 | DOC-001 |
| QA-001 | Smoke test: all public pages load without errors | P0 | DEPLOY-004 |
| QA-002 | Smoke test: admin login and CRUD operations | P0 | DEPLOY-003 |
| QA-003 | Smoke test: contact form sends email | P0 | DEPLOY-008 |
| QA-004 | Smoke test: CV download works | P0 | DEPLOY-003 |
| QA-005 | Smoke test: responsive design on mobile | P0 | DEPLOY-004 |
| QA-006 | Verify no console errors in production | P0 | DEPLOY-004 |
| QA-007 | Run Lighthouse audit on production URL | P1 | DEPLOY-004 |

#### Acceptance Criteria

- [ ] Portfolio accessible at production URL
- [ ] HTTPS enabled
- [ ] Admin can log in and manage content
- [ ] Contact form sends emails
- [ ] CV download works
- [ ] No console errors in production
- [ ] Lighthouse score >= 70
- [ ] All documentation complete

---

## 9. Database Implementation Plan

### Implementation Order

| # | Collection | Task ID | Dependencies | Schema Complexity | Priority |
|---|-----------|---------|--------------|-------------------|----------|
| 1 | `users` | DB-002 | DB-001 | Low (no bilingual) | P0 |
| 2 | `profile` | DB-003 | DB-001 | Medium (bilingual, singleton) | P0 |
| 3 | `categories` | DB-004 | DB-001 | Low (bilingual) | P0 |
| 4 | `projects` | DB-005 | DB-001, DB-004 | High (bilingual, refs, many fields) | P0 |
| 5 | `skills` | DB-006 | DB-001 | Low (partial bilingual) | P0 |
| 6 | `experiences` | DB-007 | DB-001 | Medium (bilingual) | P0 |
| 7 | `education` | DB-008 | DB-001 | Medium (bilingual) | P0 |
| 8 | `certifications` | DB-009 | DB-001 | Medium (bilingual) | P1 |
| 9 | `blogPosts` | DB-010 | DB-001, DB-004 | High (bilingual, refs, Markdown) | P0 |
| 10 | `messages` | DB-011 | DB-001 | Low (no bilingual) | P0 |
| 11 | `media` | DB-012 | DB-001 | Low (partial bilingual) | P1 |
| 12 | `socialLinks` | DB-013 | DB-001 | Low (no bilingual) | P1 |
| 13 | `settings` | DB-014 | DB-001 | Medium (bilingual, singleton) | P1 |

### Schema Notes

- **Bilingual pattern:** `{ en: { type: String, required: true }, kh: { type: String, default: '' } }`
- **Singleton pattern:** Use `findOneAndUpdate({}, updateData, { upsert: true, new: true })` for Profile and Settings
- **Slug generation:** Auto-generate from English title using a pre-validate hook; append random suffix on collision
- **Timestamps:** All models use `{ timestamps: true }` option

### Indexes Summary

| Collection | Indexes |
|-----------|---------|
| `users` | `{ email: 1 }` unique |
| `projects` | `{ slug: 1 }` unique, `{ status: 1, featured: -1, order: 1 }`, `{ category: 1 }`, `{ technologies: 1 }` |
| `skills` | `{ category: 1, order: 1 }` |
| `experiences` | `{ order: 1, startDate: -1 }` |
| `education` | `{ order: 1, startYear: -1 }` |
| `certifications` | `{ type: 1, order: 1 }` |
| `blogPosts` | `{ slug: 1 }` unique, `{ status: 1, publishedAt: -1 }`, `{ category: 1 }`, `{ tags: 1 }` |
| `categories` | `{ slug: 1 }` unique, `{ type: 1 }` |
| `messages` | `{ isRead: 1, createdAt: -1 }`, `{ isArchived: 1 }` |
| `media` | `{ publicId: 1 }` unique, `{ mimeType: 1 }`, `{ createdAt: -1 }` |
| `socialLinks` | `{ order: 1 }` |

---

## 10. Backend Implementation Plan

### Detailed Sequence

| # | Area | Description | Task IDs |
|---|------|-------------|----------|
| 1 | Node.js project init | `npm init`, `package.json`, scripts | SETUP-004, SETUP-009 |
| 2 | TypeScript config | `tsconfig.json`, strict mode | SETUP-005 |
| 3 | Dependencies | Core + dev dependencies | SETUP-006, SETUP-007 |
| 4 | Linting | ESLint + Prettier | SETUP-008 |
| 5 | Environment config | `.env` loading, validation | BACKEND-001, SETUP-010 |
| 6 | Express setup | App creation, basic middleware | SETUP-011, BACKEND-017 |
| 7 | CORS | Origin whitelist | BACKEND-002 |
| 8 | Security headers | Helmet configuration | BACKEND-014 |
| 9 | Logging | Winston + Morgan | BACKEND-006, BACKEND-007 |
| 10 | Error handling | Custom errors + global handler | BACKEND-003, BACKEND-004 |
| 11 | Utilities | catchAsync, slugify, pagination, readingTime, apiResponse | BACKEND-005, BACKEND-008, BACKEND-010, BACKEND-011, BACKEND-012 |
| 12 | Types | TypeScript definitions | BACKEND-013 |
| 13 | Validation middleware | express-validator wrapper | BACKEND-009 |
| 14 | Rate limiting | Global + endpoint-specific | BACKEND-015 |
| 15 | Route structure | Base `/api/v1` router | BACKEND-016 |
| 16 | MongoDB connection | Mongoose connect, graceful shutdown | DB-001, DB-015, DB-016 |
| 17 | Models | All 13 Mongoose models | DB-002 through DB-014 |
| 18 | JWT utilities | Token generation, verification | AUTH-001 |
| 19 | Auth service | Login, logout, refresh | AUTH-002 |
| 20 | Auth middleware | Authenticate, authorize | AUTH-005, AUTH-006 |
| 21 | Auth routes | Login, logout, refresh, me | AUTH-007, AUTH-008 |
| 22 | Cloudinary | Config, upload service | API-001, API-002 |
| 23 | Upload middleware | Multer config | API-003 |
| 24 | Admin routes | All CRUD endpoints | API-004 through API-018 |
| 25 | Public routes | All read-only endpoints | PUB-001 through PUB-020 |
| 26 | Email service | Nodemailer config | PUB-003, PUB-004 |
| 27 | Swagger | Config, JSDoc, UI | API-019, API-020, API-021 |
| 28 | Seed script | All collections | SEED-001 through SEED-011 |
| 29 | Tests | Unit + integration | TEST-001 through TEST-010 |

### Architecture

```
Request → Express Middleware Stack → Router → Controller → Service → Model → MongoDB
                                                                          ↗ Cloudinary
                                                                          ↗ Email Service
```

**Controller responsibility:** Parse request, call service, format response
**Service responsibility:** Business logic, database operations
**Model responsibility:** Schema definition, validation, hooks

---

## 11. API Implementation Order

```
Authentication (auth.routes.ts)
       ↓
Categories (admin/category.routes.ts)       ← Required by Projects + Blog
       ↓
Projects (admin/project.routes.ts)          ← Core MVP entity
       ↓
Skills (admin/skill.routes.ts)              ← Core MVP entity
       ↓
Profile (admin/profile.routes.ts)           ← Core MVP entity
       ↓
Experiences (admin/experience.routes.ts)
       ↓
Education (admin/education.routes.ts)
       ↓
Certifications (admin/certification.routes.ts)
       ↓
Blog Posts (admin/blog.routes.ts)
       ↓
Messages (admin/message.routes.ts)
       ↓
Media (admin/media.routes.ts)
       ↓
Social Links (admin/socialLink.routes.ts)
       ↓
Settings (admin/settings.routes.ts)
       ↓
CV (admin/cv.routes.ts)
       ↓
Dashboard Stats (admin/dashboard.routes.ts)
       ↓
Public Endpoints (public.routes.ts)
```

---

## 12. Frontend Implementation Plan

### Angular Foundation (Phase 7)

| # | Area | Tasks |
|---|------|-------|
| 1 | Design system | CSS variables, reset, typography, fonts | 
| 2 | Models | TypeScript interfaces for all API entities |
| 3 | Core services | API, Auth, Theme, Language, Notification |
| 4 | Interceptors | Auth token attachment, error handling + token refresh |
| 5 | Guards | Auth, Role |
| 6 | Shared components | Header, Footer, ThemeToggle, LanguageSwitcher, Loading, EmptyState, Pagination, ConfirmDialog, Skeleton |
| 7 | Pipes | Localize, Truncate |
| 8 | Layout | Public layout (header + outlet + footer) |
| 9 | Routing | App routes with lazy loading |
| 10 | App config | Providers, interceptors, Material |

### Public Pages (Phase 8)

| # | Page | Route | Priority |
|---|------|-------|----------|
| 1 | Home | `/` | P0 |
| 2 | About | `/about` | P0 |
| 3 | Skills | `/skills` | P0 |
| 4 | Experience | `/experience` | P0 |
| 5 | Education | `/education` | P0 |
| 6 | Projects List | `/projects` | P0 |
| 7 | Project Detail | `/projects/:slug` | P0 |
| 8 | Blog List | `/blog` | P0 |
| 9 | Blog Detail | `/blog/:slug` | P0 |
| 10 | Achievements | `/achievements` | P1 |
| 11 | Contact | `/contact` | P0 |
| 12 | 404 | `**` | P0 |

### Admin Pages (Phases 9-10)

| # | Page | Route | Priority |
|---|------|-------|----------|
| 1 | Login | `/admin/login` | P0 |
| 2 | Dashboard | `/admin/dashboard` | P0 |
| 3 | Projects List | `/admin/projects` | P0 |
| 4 | Project Form | `/admin/projects/create`, `/admin/projects/:id/edit` | P0 |
| 5 | Skills | `/admin/skills` | P0 |
| 6 | Experience | `/admin/experience` | P0 |
| 7 | Education | `/admin/education` | P0 |
| 8 | Certifications | `/admin/certifications` | P1 |
| 9 | Achievements | `/admin/achievements` | P1 |
| 10 | Blog List | `/admin/blog` | P0 |
| 11 | Blog Form | `/admin/blog/create`, `/admin/blog/:id/edit` | P0 |
| 12 | Categories | `/admin/categories` | P0 |
| 13 | Media Library | `/admin/media` | P1 |
| 14 | Messages | `/admin/messages` | P0 |
| 15 | CV Management | `/admin/cv` | P1 |
| 16 | Social Links | `/admin/social-links` | P1 |
| 17 | Profile | `/admin/profile` | P0 |
| 18 | Settings | `/admin/settings` | P1 |

---

## 13. Angular Architecture

```
frontend/src/app/
├── core/                    ← Singleton services, guards, interceptors, models
│   ├── guards/              ← Route guards (AuthGuard, RoleGuard)
│   ├── interceptors/        ← HTTP interceptors (Auth, Error)
│   ├── services/            ← Application-wide services (Auth, API, Theme, Language, Notification)
│   └── models/              ← TypeScript interfaces matching API entities
│
├── shared/                  ← Reusable components, pipes, directives
│   ├── components/          ← UI components used across features
│   ├── pipes/               ← Localize, Truncate, ReadingTime
│   └── directives/          ← Custom attribute directives
│
├── features/                ← Feature modules organized by domain
│   ├── public/              ← Public-facing pages (lazy-loaded)
│   │   ├── home/
│   │   ├── about/
│   │   ├── skills/
│   │   ├── experience/
│   │   ├── education/
│   │   ├── projects/
│   │   │   ├── project-list/
│   │   │   └── project-detail/
│   │   ├── blog/
│   │   │   ├── blog-list/
│   │   │   └── blog-detail/
│   │   ├── achievements/
│   │   ├── contact/
│   │   └── not-found/
│   │
│   └── admin/               ← Admin dashboard (lazy-loaded, guarded)
│       ├── layout/          ← Admin shell (sidebar, header)
│       ├── login/
│       ├── dashboard/
│       ├── projects/        ← List + Form components
│       ├── skills/
│       ├── experience/
│       ├── education/
│       ├── certifications/
│       ├── blog/            ← List + Form + Markdown Editor
│       ├── categories/
│       ├── media/
│       ├── messages/
│       ├── cv/
│       ├── social-links/
│       ├── profile/
│       └── settings/
│
├── app.component.ts         ← Root component
├── app.config.ts            ← Application config with providers
└── app.routes.ts            ← Top-level route definitions
```

### Responsibility Boundaries

| Area | Responsibility |
|------|---------------|
| `core/services/` | Business logic, API communication, auth state, app-wide state |
| `core/guards/` | Route protection (auth check, role check) |
| `core/interceptors/` | HTTP request/response transformation |
| `core/models/` | TypeScript type definitions — NO business logic |
| `shared/components/` | Stateless/presentational reusable UI elements |
| `shared/pipes/` | Data transformation for templates |
| `features/` | Smart/container components — use services, handle routing |

### State Management

- **Angular Signals** for reactive state in services (NO NgRx)
- `AuthService` → `currentUser: Signal<User | null>`, `isAuthenticated: Signal<boolean>`
- `ThemeService` → `theme: Signal<'light' | 'dark'>`
- `LanguageService` → `currentLang: Signal<'en' | 'kh'>`

---

## 14. UI Implementation Order

### Design System (Phase 7, FE-001 through FE-004)

Build the design system **before** implementing pages:

| # | Component | Task |
|---|-----------|------|
| 1 | CSS Variables | Colors, spacing, typography, border-radius, shadows |
| 2 | Reset | Normalize browser defaults |
| 3 | Typography | Heading styles, body text, code text, Khmer text |
| 4 | Fonts | Google Fonts import (Inter, Noto Sans Khmer, JetBrains Mono) |
| 5 | Buttons | Primary, secondary, ghost, danger variants |
| 6 | Cards | Base card style with hover effect |
| 7 | Forms | Input, textarea, select, label, error message styles |
| 8 | Tables | Admin data table styles |
| 9 | Badges | Status (published/draft), category, technology chips |
| 10 | Navigation | Desktop + mobile patterns |
| 11 | Loading | Spinner + skeleton placeholder |
| 12 | Empty State | Icon + text + optional action button |
| 13 | Error State | Error message + retry button |
| 14 | Toasts | Success, error, warning, info |
| 15 | Modals | Confirmation dialog |

---

## 15. Admin CRUD Implementation Strategy

### Reusable CRUD Pattern

Every admin CRUD section follows this flow:

```
List Page → (Search/Filter) → Data Table with Actions
                                  ├── Create → Form → Validate → Submit → API → Toast → Refresh List
                                  ├── Edit → Fetch → Form → Validate → Submit → API → Toast → Refresh List
                                  └── Delete → Confirm Dialog → API → Toast → Refresh List
```

### Reusable Components (built in Phase 10)

| Component | Purpose | Used By |
|-----------|---------|---------|
| `AdminDataTableComponent` | Configurable table with search, filter, sort, pagination | All list pages |
| `BilingualFieldComponent` | EN/KH tabs wrapping form inputs | All forms with bilingual fields |
| `ImageUploadComponent` | File select + preview + upload | Projects, Blog, Profile, Media |
| `MarkdownEditorComponent` | Side-by-side textarea + preview | Projects, Blog |
| `ConfirmDialogComponent` | "Are you sure?" modal | All delete actions |

### Implementation Order for CRUD Sections

Build in this order (each subsequent section reuses patterns from the previous):

1. **Categories** (simplest — inline create/edit, no images, few fields)
2. **Skills** (simple form, no images)
3. **Projects** (complex form — bilingual, images, multiple fields — establishes the full pattern)
4. **Experience** (medium form — bilingual, no images)
5. **Education** (medium form — bilingual, no images)
6. **Certifications** (medium form — bilingual, optional image)
7. **Blog** (complex — bilingual, Markdown editor, images)
8. **Messages** (read-only list + detail, mark as read)
9. **Profile** (single form — bilingual, images)
10. **Social Links** (list + form, reorder)
11. **Media Library** (grid view, upload, delete)
12. **CV Management** (upload PDF, view current)
13. **Settings** (single form)

---

## 16. Authentication Implementation Plan

### Backend

| Step | Task | Task ID |
|------|------|---------|
| 1 | User model with bcrypt pre-save hook | DB-002 |
| 2 | JWT utility (sign, verify) | AUTH-001 |
| 3 | Auth service (login, logout, refresh) | AUTH-002 |
| 4 | Auth validators | AUTH-003 |
| 5 | Auth controller | AUTH-004 |
| 6 | Authenticate middleware (verify access token) | AUTH-005 |
| 7 | Authorize middleware (check role) | AUTH-006 |
| 8 | Auth routes | AUTH-007 |
| 9 | Login rate limiting | AUTH-009 |
| 10 | Admin seed script | AUTH-010 |
| 11 | Change password endpoint | AUTH-012 |

### Frontend

| Step | Task | Task ID |
|------|------|---------|
| 1 | Auth service (login, logout, token storage, user signal) | FE-007 |
| 2 | Auth interceptor (attach Bearer token) | FE-008 |
| 3 | Error interceptor (catch 401, attempt refresh, retry) | FE-009 |
| 4 | Auth guard (protect admin routes) | FE-010 |
| 5 | Login page component | ADMIN-001 |
| 6 | Login → dashboard redirect | ADMIN-007 |
| 7 | Logout → login redirect | ADMIN-008 |

### Test Coverage

| Scenario | Type | Task ID |
|----------|------|---------|
| Valid login → tokens returned | Integration | TEST-005 |
| Invalid password → 401 | Integration | TEST-005 |
| Invalid email → 401 | Integration | TEST-005 |
| No token → 401 on protected route | Integration | TEST-005 |
| Expired token → 401 | Integration | TEST-005 |
| Valid refresh → new access token | Integration | TEST-005 |
| Invalid refresh → 401 | Integration | TEST-005 |
| Rate limit → 429 after 5 attempts | Integration | TEST-005 |
| Logout → cookie cleared | Integration | TEST-005 |
| AuthService login/logout | Unit (FE) | TEST-013 |
| AuthGuard blocks unauthenticated | Unit (FE) | TEST-015 |

---

## 17. Security Implementation Plan

| # | Measure | PRD Ref | Task ID | Priority |
|---|---------|---------|---------|----------|
| 1 | Password hashing (bcrypt, 12 rounds) | 18.1 | DB-002 | P0 |
| 2 | Short-lived access tokens (15 min) | 18.1 | AUTH-001 | P0 |
| 3 | HTTP-only secure refresh cookie | 18.1 | AUTH-002 | P0 |
| 4 | CORS origin whitelist | 18.1 | BACKEND-002 | P0 |
| 5 | Helmet security headers | 18.1 | BACKEND-014 | P0 |
| 6 | Rate limiting (auth + contact) | 18.1 | AUTH-009, PUB-020 | P0 |
| 7 | Input validation (express-validator) | 18.1 | BACKEND-009 | P0 |
| 8 | HTML sanitization (XSS prevention) | 18.1 | SEC-004 | P0 |
| 9 | MongoDB injection prevention | 18.1 | SEC-005 | P0 |
| 10 | File upload MIME/size/extension validation | 18.1 | API-003, SEC-006 | P0 |
| 11 | Secrets in `.env`, never in code | 18.1 | SETUP-010, SEC-010 | P0 |
| 12 | Generic errors in production | 18.1 | BACKEND-004, SEC-009 | P0 |
| 13 | SameSite cookie for CSRF mitigation | 18.1 | AUTH-002 | P0 |
| 14 | Login brute force protection (rate limit) | 18.1 | AUTH-009 | P0 |
| 15 | Dependency audit | 18.1 | SEC-011 | P1 |
| 16 | Request body size limit | 18.1 | SEC-013 | P1 |
| 17 | No sensitive data in logs | 18.1 | SEC-014 | P0 |

---

## 18. Testing Plan

### Backend Testing Strategy

| Type | Framework | Scope | When |
|------|-----------|-------|------|
| Unit | Jest | Utility functions, services | Phase 17 |
| Integration | Jest + Supertest | API endpoints | Phase 17 |
| Auth tests | Jest + Supertest | Full auth flow | Phase 17 |

### Frontend Testing Strategy

| Type | Framework | Scope | When |
|------|-----------|-------|------|
| Component | Jest + Angular Testing | Key components | Phase 17 |
| Service | Jest | Auth, Theme, Language services | Phase 17 |
| Guard | Jest | AuthGuard, RoleGuard | Phase 17 |

### Coverage Targets

| Layer | Target |
|-------|--------|
| Backend API routes | >= 80% |
| Backend services | >= 70% |
| Backend middleware | >= 70% |
| Backend overall | >= 60% |
| Frontend services | >= 70% |
| Frontend key components | >= 50% |
| Frontend guards/interceptors | >= 80% |
| Frontend overall | >= 50% |

### Testing Timeline

- Tests written during Phase 17, but each phase should produce testable code
- Test infrastructure (Jest config, test helpers) set up early in Phase 17
- Final QA in Phase 20 includes manual smoke testing

---

## 19. Docker Plan

### Development

| Component | Image | Port | Volume |
|-----------|-------|------|--------|
| Frontend | Custom (Dockerfile.dev) | 4200 | `./frontend:/app` (hot reload) |
| Backend | Custom (Dockerfile.dev) | 3000 | `./backend:/app` (hot reload) |
| MongoDB | `mongo:7` | 27017 | Named volume `mongodb_data` |

### Production

| Component | Image | Notes |
|-----------|-------|-------|
| Frontend | Multi-stage (node build → nginx serve) | Static files served by nginx |
| Backend | Multi-stage (node build → node run) | Only `dist/` and production deps |
| MongoDB | **NOT containerized** — use MongoDB Atlas | — |

### Health Checks

| Service | Endpoint | Interval |
|---------|----------|----------|
| Backend | `GET /api/v1/health` | 30s |
| Frontend | `GET /` | 30s |

---

## 20. CI/CD Plan

### Pull Request Workflow (`.github/workflows/ci.yml`)

```
Trigger: Pull request to main or develop
         ↓
┌─────────────────────┐    ┌──────────────────────┐
│ Backend Job         │    │ Frontend Job          │
│ 1. Checkout         │    │ 1. Checkout           │
│ 2. Setup Node 20    │    │ 2. Setup Node 20      │
│ 3. npm ci           │    │ 3. npm ci             │
│ 4. npm run lint     │    │ 4. npm run lint       │
│ 5. npm test         │    │ 5. npm test           │
│ 6. npm run build    │    │ 6. npm run build      │
└─────────────────────┘    └──────────────────────┘
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

```
Trigger: Push to main
         ↓
1. Run CI checks (lint, test, build)
         ↓
2. Deploy backend (Render deploy hook or CLI)
         ↓
3. Deploy frontend (Vercel/Netlify auto-deploys from main)
```

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `MONGODB_URI` | Production database connection string |
| `JWT_SECRET` | Production JWT signing secret |
| `JWT_REFRESH_SECRET` | Production refresh token secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` | Production SMTP host |
| `EMAIL_USER` | Production SMTP username |
| `EMAIL_PASS` | Production SMTP password |
| `RENDER_DEPLOY_HOOK` | Backend deploy webhook URL |

---

## 21. Documentation Plan

| Document | Location | Created In | Updated In | Priority |
|----------|----------|-----------|-----------|----------|
| `README.md` | Root | Phase 0 (basic) | Phase 20 (complete) | P0 |
| `PRD.md` | `docs/PRD.md` | Already exists | — | P0 |
| `Plan.md` | Root → `docs/Plan.md` | This document | Ongoing | P0 |
| `SETUP.md` | `docs/SETUP.md` | Phase 20 | — | P1 |
| `DEPLOYMENT.md` | `docs/DEPLOYMENT.md` | Phase 20 | — | P1 |
| `API.md` | `docs/API.md` | Phase 4 (Swagger) | Phase 5 | P1 |
| `.env.example` | `backend/.env.example` | Phase 0 | Phase 5 | P0 |
| Swagger UI | `/api/docs` | Phase 4 | Ongoing | P1 |

---

## 22. Feature Matrix

| Feature | Priority | Phase | Backend | Frontend | Database | Tests | Status |
|---------|----------|-------|---------|----------|----------|-------|--------|
| Repository setup | P0 | 0 | ✅ | ✅ | — | — | Not Started |
| Backend foundation | P0 | 1 | ✅ | — | — | — | Not Started |
| MongoDB connection | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| User model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Profile model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Project model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Skill model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Experience model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Education model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| BlogPost model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Category model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Message model | P0 | 2 | ✅ | — | ✅ | — | Not Started |
| Certification model | P1 | 2 | ✅ | — | ✅ | — | Not Started |
| Media model | P1 | 2 | ✅ | — | ✅ | — | Not Started |
| SocialLink model | P1 | 2 | ✅ | — | ✅ | — | Not Started |
| Settings model | P1 | 2 | ✅ | — | ✅ | — | Not Started |
| JWT authentication | P0 | 3 | ✅ | — | ✅ | ✅ | Not Started |
| Login endpoint | P0 | 3 | ✅ | — | — | ✅ | Not Started |
| Token refresh | P0 | 3 | ✅ | — | — | ✅ | Not Started |
| Auth middleware | P0 | 3 | ✅ | — | — | ✅ | Not Started |
| Admin project CRUD API | P0 | 4 | ✅ | — | ✅ | ✅ | Not Started |
| Admin skill CRUD API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin experience CRUD API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin education CRUD API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin blog CRUD API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin category CRUD API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin message API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin profile API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin certification CRUD API | P1 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin media API | P1 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin social link API | P1 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin settings API | P1 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin CV API | P1 | 4 | ✅ | — | ✅ | — | Not Started |
| Admin dashboard stats API | P0 | 4 | ✅ | — | ✅ | — | Not Started |
| Cloudinary integration | P0 | 4 | ✅ | — | — | — | Not Started |
| Swagger documentation | P1 | 4 | ✅ | — | — | — | Not Started |
| Public project API | P0 | 5 | ✅ | — | ✅ | ✅ | Not Started |
| Public skill API | P0 | 5 | ✅ | — | ✅ | — | Not Started |
| Public profile API | P0 | 5 | ✅ | — | ✅ | — | Not Started |
| Public experience API | P0 | 5 | ✅ | — | ✅ | — | Not Started |
| Public education API | P0 | 5 | ✅ | — | ✅ | — | Not Started |
| Public blog API | P0 | 5 | ✅ | — | ✅ | — | Not Started |
| Public contact API | P0 | 5 | ✅ | — | ✅ | ✅ | Not Started |
| CV download API | P1 | 5 | ✅ | — | ✅ | — | Not Started |
| Email notifications | P1 | 5 | ✅ | — | — | — | Not Started |
| Seed data | P0 | 6 | ✅ | — | ✅ | — | Not Started |
| Angular foundation | P0 | 7 | — | ✅ | — | — | Not Started |
| Design system (CSS) | P0 | 7 | — | ✅ | — | — | Not Started |
| Core services | P0 | 7 | — | ✅ | — | — | Not Started |
| Shared components | P0 | 7 | — | ✅ | — | — | Not Started |
| Home page | P0 | 8 | — | ✅ | — | — | Not Started |
| About page | P0 | 8 | — | ✅ | — | — | Not Started |
| Skills page | P0 | 8 | — | ✅ | — | — | Not Started |
| Experience page | P0 | 8 | — | ✅ | — | — | Not Started |
| Education page | P0 | 8 | — | ✅ | — | — | Not Started |
| Projects page | P0 | 8 | — | ✅ | — | — | Not Started |
| Project detail page | P0 | 8 | — | ✅ | — | — | Not Started |
| Blog page | P0 | 8 | — | ✅ | — | — | Not Started |
| Blog detail page | P0 | 8 | — | ✅ | — | — | Not Started |
| Achievements page | P1 | 8 | — | ✅ | — | — | Not Started |
| Contact page | P0 | 8 | — | ✅ | — | — | Not Started |
| 404 page | P0 | 8 | — | ✅ | — | — | Not Started |
| Responsive design | P0 | 8 | — | ✅ | — | — | Not Started |
| Admin login | P0 | 9 | — | ✅ | — | — | Not Started |
| Admin layout | P0 | 9 | — | ✅ | — | — | Not Started |
| Admin dashboard | P0 | 9 | — | ✅ | — | — | Not Started |
| Admin project CRUD UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin skill CRUD UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin experience CRUD UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin education CRUD UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin blog CRUD UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin category UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin message UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin profile UI | P0 | 10 | — | ✅ | — | — | Not Started |
| Admin certification UI | P1 | 10 | — | ✅ | — | — | Not Started |
| Admin media library UI | P1 | 10 | — | ✅ | — | — | Not Started |
| Admin social links UI | P1 | 10 | — | ✅ | — | — | Not Started |
| Admin CV management UI | P1 | 10 | — | ✅ | — | — | Not Started |
| Admin settings UI | P1 | 10 | — | ✅ | — | — | Not Started |
| Blog Markdown rendering | P0 | 11 | — | ✅ | — | — | Not Started |
| Media library | P1 | 12 | ✅ | ✅ | ✅ | — | Not Started |
| CV management | P1 | 12 | ✅ | ✅ | ✅ | — | Not Started |
| Contact system | P0 | 13 | ✅ | ✅ | ✅ | — | Not Started |
| Multilingual (EN/KH) | P1 | 14 | — | ✅ | — | — | Not Started |
| Dark/Light theme | P0 | 15 | — | ✅ | — | — | Not Started |
| Accessibility (WCAG AA) | P0 | 15 | — | ✅ | — | — | Not Started |
| SEO meta tags | P0 | 16 | — | ✅ | — | — | Not Started |
| Performance optimization | P1 | 16 | ✅ | ✅ | — | — | Not Started |
| Backend tests | P0 | 17 | ✅ | — | — | ✅ | Not Started |
| Frontend tests | P0 | 17 | — | ✅ | — | ✅ | Not Started |
| Security hardening | P0 | 18 | ✅ | — | — | — | Not Started |
| Docker setup | P1 | 19 | ✅ | ✅ | — | — | Not Started |
| CI/CD pipelines | P1 | 19 | — | — | — | — | Not Started |
| Production deployment | P0 | 20 | ✅ | ✅ | ✅ | — | Not Started |
| Documentation | P0 | 20 | — | — | — | — | Not Started |

---

## 23. Risk Register

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|-------------|------------|
| R1 | Authentication complexity causing delays | High | Medium | Follow PRD auth architecture closely; use well-tested JWT libraries; test auth flow early |
| R2 | File upload issues (Cloudinary integration) | Medium | Medium | Test upload in Phase 4 before building UI; handle errors gracefully; use SDK not raw API |
| R3 | MongoDB schema changes mid-development | Medium | Low | Models defined in Phase 2 from PRD; avoid ad-hoc changes; migrations via seed script if needed |
| R4 | Angular/backend API mismatch | Medium | Medium | Define TypeScript interfaces in both projects; test integration early in Phase 8 |
| R5 | CORS configuration issues | Medium | High | Configure CORS early in Phase 1; test with actual frontend origin; document settings |
| R6 | Environment configuration errors | Medium | Medium | Use `.env.example` with all variables; validate env vars at startup; fail fast on missing vars |
| R7 | Email provider problems (Gmail rate limits) | Low | Medium | Use Gmail for dev; plan migration to Resend/SendGrid for production; make email failures non-blocking |
| R8 | Cloudinary free tier limits | Medium | Low | Monitor usage; optimize image sizes; keep uploads minimal during dev |
| R9 | AI-generated code inconsistencies across phases | Medium | High | Enforce strict PRD adherence; use stable task IDs; review code between phases |
| R10 | Scope creep (adding features not in PRD) | High | High | Strictly follow PRD non-goals; reject features not in the PRD; defer to FUTURE |
| R11 | Khmer font rendering issues | Low | Medium | Use Noto Sans Khmer from Google Fonts; test on multiple browsers; set `lang` attribute |
| R12 | Angular SSR complexity | Medium | Medium | SSR is SHOULD HAVE; implement only if time permits; client-side SEO is acceptable baseline |
| R13 | Deployment configuration complexity | Medium | Medium | Use platform defaults (Vercel, Render); document all env vars; test deployment early |
| R14 | Docker build failures | Low | Low | Test Docker builds in Phase 19; use official base images; keep Dockerfiles simple |

---

## 24. Assumptions

| # | Assumption | Rationale |
|---|-----------|-----------|
| A1 | Single admin user — no registration system needed | PRD Section 4 explicitly excludes user registration |
| A2 | Low traffic (< 1000 visits/day) — free-tier hosting sufficient | PRD Section 40, Assumption #3 |
| A3 | Angular SSR deferred to post-V1 unless implementation is trivial | PRD Section 23.2 marks SSR as SHOULD HAVE; complexity may not justify V1 inclusion |
| A4 | `ngx-translate` used instead of `@angular/localize` for i18n | PRD Section 15.3 decided on `ngx-translate` for runtime switching |
| A5 | Blog Markdown editor is a plain textarea with preview, not a WYSIWYG | PRD Section 9.9 and UD7 decided this |
| A6 | Tailwind CSS version to be determined at implementation time (v3 or v4) | PRD UD6 — use whichever is stable |
| A7 | E2E tests (Cypress/Playwright) are FUTURE scope, not V1 | PRD Section 28.3 |
| A8 | Frontend hosting decided at deploy time (Vercel or Netlify) | PRD UD4 — both are acceptable |
| A9 | Backend hosting decided at deploy time (Render or Railway) | PRD UD5 — both are acceptable |
| A10 | The seed script uses placeholder image URLs (e.g., `via.placeholder.com`) instead of requiring actual Cloudinary uploads | Avoids requiring Cloudinary credentials for seed data |
| A11 | The Achievements and Certifications pages share the same data model (`certifications` collection with `type` field) | PRD Section 11.9 uses a single collection with enum types |
| A12 | Angular standalone components used throughout (no NgModules) | Angular 17+ best practice; PRD specifies Angular 19+ |
| A13 | Contact form email is sent asynchronously and failures don't block the API response | Better UX; email delivery is not guaranteed; message is stored in DB regardless |

---

## 25. Open Questions

| # | Question | Impact | Default Decision |
|---|----------|--------|-----------------|
| Q1 | Should Angular SSR be implemented in V1? | SEO quality vs. complexity | **Defer to post-V1** unless implementation is trivial with Angular 19+ |
| Q2 | Vercel or Netlify for frontend hosting? | Minimal — both support Angular static builds | **Decide at deployment time** (Phase 20) |
| Q3 | Render or Railway for backend hosting? | Minimal — both support Node.js Docker | **Decide at deployment time** (Phase 20) |
| Q4 | Tailwind CSS v3 or v4? | Configuration differences | **Use whichever is stable** at implementation time |
| Q5 | Should the audit log collection be implemented in V1? | SHOULD HAVE per PRD Section 26.2 | **Defer** — implement only if time permits |

---

## 26. PRD-to-Plan Traceability

| PRD Section | PRD Requirement | Plan Phase | Task IDs |
|-------------|----------------|------------|----------|
| 6 | Technology Stack | 0 | SETUP-004 through SETUP-016 |
| 7 | System Architecture | 0-1 | SETUP-011, BACKEND-016, BACKEND-017 |
| 8.1 | Home Page | 8 | PAGE-001 |
| 8.2 | About Page | 8 | PAGE-002 |
| 8.3 | Skills Page | 8 | PAGE-003 |
| 8.4 | Experience Page | 8 | PAGE-004 |
| 8.5 | Education Page | 8 | PAGE-005 |
| 8.6 | Projects Page | 8 | PAGE-006 |
| 8.7 | Project Detail | 8 | PAGE-007 |
| 8.8 | Blog Page | 8 | PAGE-008 |
| 8.9 | Blog Detail | 8 | PAGE-009 |
| 8.10 | Achievements | 8 | PAGE-010 |
| 8.11 | Contact Page | 8, 13 | PAGE-011, CONTACT-001 through CONTACT-005 |
| 8.12 | CV Download | 12 | MEDIA-004 |
| 9.1 | Admin Layout | 9 | ADMIN-002 through ADMIN-004 |
| 9.2 | Dashboard Overview | 9 | ADMIN-006 |
| 9.3 | CRUD Standards | 10 | ADMIN-010 through ADMIN-012 |
| 9.4 | Admin Projects | 10 | ADMIN-013, ADMIN-014 |
| 9.5 | Admin Skills | 10 | ADMIN-015 |
| 9.6 | Admin Experience | 10 | ADMIN-016 |
| 9.7 | Admin Education | 10 | ADMIN-017 |
| 9.8 | Admin Certifications | 10 | ADMIN-018 |
| 9.9 | Admin Blog | 10, 11 | ADMIN-019, ADMIN-020, BLOG-001 through BLOG-005 |
| 9.10 | Admin Categories | 10 | ADMIN-021 |
| 9.11 | Admin Media | 10, 12 | ADMIN-023, MEDIA-001 through MEDIA-005 |
| 9.12 | Admin Messages | 10, 13 | ADMIN-022, CONTACT-004, CONTACT-005 |
| 9.13 | Admin CV | 10, 12 | ADMIN-024 |
| 9.14 | Admin Social Links | 10 | ADMIN-025 |
| 9.15 | Admin Profile | 10 | ADMIN-026 |
| 9.16 | Admin Settings | 10 | ADMIN-027 |
| 10 | Authentication | 3, 9 | AUTH-001 through AUTH-012, FE-007 through FE-010, ADMIN-001 |
| 11 | Database Design | 2 | DB-001 through DB-016 |
| 12 | REST API | 4, 5 | API-001 through API-021, PUB-001 through PUB-020 |
| 13 | API Response Format | 1 | BACKEND-008 |
| 14 | Error Handling | 1 | BACKEND-003, BACKEND-004 |
| 15 | Multilingual (i18n) | 14 | I18N-001 through I18N-010 |
| 16 | Dark/Light Mode | 15 | THEME-001 through THEME-004, FE-002, FE-012, FE-019 |
| 17 | File & Media Management | 4, 12 | API-001 through API-003, API-018, MEDIA-001 through MEDIA-005 |
| 18 | Security | 1, 3, 18 | BACKEND-014, BACKEND-015, AUTH-009, SEC-001 through SEC-014 |
| 19 | UX/UI | 7, 8 | FE-001 through FE-004, PAGE-001 through PAGE-016 |
| 20 | Design System | 7 | FE-001 through FE-004 |
| 21 | Responsive Design | 8 | PAGE-016 |
| 22 | Accessibility | 15 | A11Y-001 through A11Y-009 |
| 23 | SEO | 16 | SEO-001 through SEO-012 |
| 24 | Performance | 16 | SEO-007 through SEO-011 |
| 25 | Analytics (counters) | 5 | PUB-008 (viewCount), PUB-014 (viewCount), PUB-019 (cvDownloadCount) |
| 26 | Logging | 1 | BACKEND-006, BACKEND-007 |
| 28 | Testing | 17 | TEST-001 through TEST-018 |
| 29 | Docker | 0, 19 | SETUP-017 through SETUP-019, DEVOPS-001 through DEVOPS-006 |
| 30 | CI/CD | 19 | DEVOPS-007 through DEVOPS-009 |
| 31 | Environment Config | 0, 1 | SETUP-010, SETUP-016, BACKEND-001 |
| 32 | Folder Structure | 0 | SETUP-002 |
| 38 | Seed Data | 6 | SEED-001 through SEED-011 |
| 42 | Documentation | 20 | DOC-001 through DOC-005 |

---

## 27. Master Task Checklist

### Phase 0 — Project Planning & Repository Setup

- [ ] SETUP-001 Initialize Git repository and create `.gitignore`
- [ ] SETUP-002 Create root folder structure
- [ ] SETUP-003 Create `.editorconfig`
- [ ] SETUP-004 Initialize Node.js/Express backend with TypeScript
- [ ] SETUP-005 Configure backend `tsconfig.json`
- [ ] SETUP-006 Install backend core dependencies
- [ ] SETUP-007 Install backend dev dependencies
- [ ] SETUP-008 Configure backend ESLint + Prettier
- [ ] SETUP-009 Create backend `package.json` scripts
- [ ] SETUP-010 Create backend `.env.example`
- [ ] SETUP-011 Create backend entry files with health check
- [ ] SETUP-012 Initialize Angular project
- [ ] SETUP-013 Add Angular Material
- [ ] SETUP-014 Add and configure Tailwind CSS
- [ ] SETUP-015 Configure frontend ESLint + Prettier
- [ ] SETUP-016 Create frontend environment files
- [ ] SETUP-017 Create `docker-compose.dev.yml`
- [ ] SETUP-018 Create backend `Dockerfile.dev`
- [ ] SETUP-019 Create frontend `Dockerfile.dev`
- [ ] SETUP-020 Create basic `README.md`

### Phase 1 — Backend Foundation

- [ ] BACKEND-001 Create environment config module
- [ ] BACKEND-002 Create CORS configuration module
- [ ] BACKEND-003 Create custom error classes
- [ ] BACKEND-004 Create global error handler middleware
- [ ] BACKEND-005 Create async handler wrapper (catchAsync)
- [ ] BACKEND-006 Create Winston logger
- [ ] BACKEND-007 Configure Morgan HTTP logging
- [ ] BACKEND-008 Create API response helpers
- [ ] BACKEND-009 Create validation middleware
- [ ] BACKEND-010 Create pagination utility
- [ ] BACKEND-011 Create slug generation utility
- [ ] BACKEND-012 Create reading time utility
- [ ] BACKEND-013 Create TypeScript type definitions
- [ ] BACKEND-014 Configure Helmet security headers
- [ ] BACKEND-015 Configure rate limiter middleware
- [ ] BACKEND-016 Create base route structure with API versioning
- [ ] BACKEND-017 Update app.ts to wire all middleware

### Phase 2 — MongoDB Database & Models

- [ ] DB-001 Create MongoDB connection module
- [ ] DB-002 Create User model
- [ ] DB-003 Create Profile model (singleton)
- [ ] DB-004 Create Category model
- [ ] DB-005 Create Project model
- [ ] DB-006 Create Skill model
- [ ] DB-007 Create Experience model
- [ ] DB-008 Create Education model
- [ ] DB-009 Create Certification model
- [ ] DB-010 Create BlogPost model
- [ ] DB-011 Create Message model
- [ ] DB-012 Create Media model
- [ ] DB-013 Create SocialLink model
- [ ] DB-014 Create Settings model (singleton)
- [ ] DB-015 Update server.ts to connect to MongoDB
- [ ] DB-016 Add graceful shutdown handling

### Phase 3 — Authentication & Authorization

- [ ] AUTH-001 Create JWT token utility
- [ ] AUTH-002 Create auth service
- [ ] AUTH-003 Create auth validators
- [ ] AUTH-004 Create auth controller
- [ ] AUTH-005 Create authenticate middleware
- [ ] AUTH-006 Create authorize middleware (role check)
- [ ] AUTH-007 Create auth routes
- [ ] AUTH-008 Wire auth routes into main router
- [ ] AUTH-009 Add login rate limiting
- [ ] AUTH-010 Create seed script (admin user)
- [ ] AUTH-011 Add `npm run seed` script
- [ ] AUTH-012 Create change-password endpoint

### Phase 4 — Core Admin API (CRUD)

- [ ] API-001 Create Cloudinary config
- [ ] API-002 Create Cloudinary service
- [ ] API-003 Create upload middleware (Multer)
- [ ] API-004 Create admin route index with auth middleware
- [ ] API-005 Create Category CRUD (service, controller, validator, routes)
- [ ] API-006 Create Project CRUD
- [ ] API-007 Create Skill CRUD
- [ ] API-008 Create Experience CRUD
- [ ] API-009 Create Education CRUD
- [ ] API-010 Create Certification CRUD
- [ ] API-011 Create BlogPost CRUD (admin)
- [ ] API-012 Create Message management (list, read, archive, delete)
- [ ] API-013 Create Profile (GET + PUT upsert)
- [ ] API-014 Create Social Link CRUD
- [ ] API-015 Create Settings (GET + PUT upsert)
- [ ] API-016 Create Dashboard stats endpoint
- [ ] API-017 Create CV upload/delete routes
- [ ] API-018 Create Media (list, upload, delete)
- [ ] API-019 Configure Swagger/OpenAPI
- [ ] API-020 Add JSDoc Swagger annotations
- [ ] API-021 Wire Swagger UI at `/api/docs`

### Phase 5 — Public API

- [ ] PUB-001 Create public controller
- [ ] PUB-002 Create contact validator
- [ ] PUB-003 Create email config
- [ ] PUB-004 Create email service
- [ ] PUB-005 Create public routes
- [ ] PUB-006 Implement GET /api/v1/profile
- [ ] PUB-007 Implement GET /api/v1/projects (pagination, filter, search)
- [ ] PUB-008 Implement GET /api/v1/projects/:slug (viewCount)
- [ ] PUB-009 Implement GET /api/v1/skills
- [ ] PUB-010 Implement GET /api/v1/experiences
- [ ] PUB-011 Implement GET /api/v1/education
- [ ] PUB-012 Implement GET /api/v1/certifications
- [ ] PUB-013 Implement GET /api/v1/blog (pagination, filter, search)
- [ ] PUB-014 Implement GET /api/v1/blog/:slug (viewCount)
- [ ] PUB-015 Implement GET /api/v1/categories
- [ ] PUB-016 Implement GET /api/v1/social-links
- [ ] PUB-017 Implement GET /api/v1/settings/public
- [ ] PUB-018 Implement POST /api/v1/contact
- [ ] PUB-019 Implement GET /api/v1/cv/download
- [ ] PUB-020 Add contact rate limiting (5/IP/hour)

### Phase 6 — Seed Data

- [ ] SEED-001 Extend seed script with profile data
- [ ] SEED-002 Add skills seed data
- [ ] SEED-003 Add category seed data
- [ ] SEED-004 Add project seed data (3-5 projects)
- [ ] SEED-005 Add experience seed data
- [ ] SEED-006 Add education seed data
- [ ] SEED-007 Add certification seed data
- [ ] SEED-008 Add blog post seed data (2-3 posts)
- [ ] SEED-009 Add social link seed data
- [ ] SEED-010 Add settings seed data
- [ ] SEED-011 Add clear/reset functionality

### Phase 7 — Angular Frontend Foundation

- [ ] FE-001 Create global styles (variables, reset, typography)
- [ ] FE-002 Configure CSS custom properties for themes
- [ ] FE-003 Configure Angular Material theme
- [ ] FE-004 Import Google Fonts
- [ ] FE-005 Create TypeScript models/interfaces
- [ ] FE-006 Create API service
- [ ] FE-007 Create Auth service
- [ ] FE-008 Create Auth interceptor
- [ ] FE-009 Create Error interceptor
- [ ] FE-010 Create Auth guard
- [ ] FE-011 Create Role guard
- [ ] FE-012 Create Theme service
- [ ] FE-013 Create Language service
- [ ] FE-014 Create Notification service
- [ ] FE-015 Create localize pipe
- [ ] FE-016 Create truncate pipe
- [ ] FE-017 Create Header component
- [ ] FE-018 Create Footer component
- [ ] FE-019 Create Theme Toggle component
- [ ] FE-020 Create Language Switcher component
- [ ] FE-021 Create Loading Spinner component
- [ ] FE-022 Create Empty State component
- [ ] FE-023 Create Pagination component
- [ ] FE-024 Create Confirm Dialog component
- [ ] FE-025 Create Public Layout component
- [ ] FE-026 Configure app routing (lazy-loaded)
- [ ] FE-027 Configure app.config.ts with providers
- [ ] FE-028 Create Skeleton Loader component

### Phase 8 — Public Portfolio Pages

- [ ] PAGE-001 Create Home page
- [ ] PAGE-002 Create About page
- [ ] PAGE-003 Create Skills page
- [ ] PAGE-004 Create Experience page
- [ ] PAGE-005 Create Education page
- [ ] PAGE-006 Create Projects List page
- [ ] PAGE-007 Create Project Detail page
- [ ] PAGE-008 Create Blog List page
- [ ] PAGE-009 Create Blog Detail page
- [ ] PAGE-010 Create Achievements page
- [ ] PAGE-011 Create Contact page
- [ ] PAGE-012 Create 404 page
- [ ] PAGE-013 Install and configure ngx-markdown
- [ ] PAGE-014 Create project card component
- [ ] PAGE-015 Create blog card component
- [ ] PAGE-016 Make all pages responsive
- [ ] PAGE-017 Add route transition animations

### Phase 9 — Admin Dashboard — Layout & Auth

- [ ] ADMIN-001 Create admin login page
- [ ] ADMIN-002 Create admin layout component
- [ ] ADMIN-003 Create admin sidebar component
- [ ] ADMIN-004 Create admin header component
- [ ] ADMIN-005 Configure admin routing (lazy-loaded)
- [ ] ADMIN-006 Create dashboard overview page
- [ ] ADMIN-007 Implement login → dashboard redirect
- [ ] ADMIN-008 Implement logout → login redirect
- [ ] ADMIN-009 Make admin sidebar responsive

### Phase 10 — Admin Dashboard — CRUD Sections

- [ ] ADMIN-010 Create reusable admin data table component
- [ ] ADMIN-011 Create reusable bilingual field component
- [ ] ADMIN-012 Create reusable image upload component
- [ ] ADMIN-013 Create admin project list page
- [ ] ADMIN-014 Create admin project form page
- [ ] ADMIN-015 Create admin skill list and form
- [ ] ADMIN-016 Create admin experience list and form
- [ ] ADMIN-017 Create admin education list and form
- [ ] ADMIN-018 Create admin certification list and form
- [ ] ADMIN-019 Create admin blog list and form
- [ ] ADMIN-020 Create Markdown editor component
- [ ] ADMIN-021 Create admin category list (inline)
- [ ] ADMIN-022 Create admin message list and detail
- [ ] ADMIN-023 Create admin media library page
- [ ] ADMIN-024 Create admin CV management page
- [ ] ADMIN-025 Create admin social links page
- [ ] ADMIN-026 Create admin profile page
- [ ] ADMIN-027 Create admin settings page
- [ ] ADMIN-028 Add unsaved changes warning
- [ ] ADMIN-029 Wire unread message count badge

### Phase 11 — Blog System

- [ ] BLOG-001 Add syntax highlighting in Markdown editor
- [ ] BLOG-002 Add reading time display
- [ ] BLOG-003 Add related posts to blog detail
- [ ] BLOG-004 Add related projects to project detail
- [ ] BLOG-005 Add publish/unpublish quick action

### Phase 12 — Media & CV Management

- [ ] MEDIA-001 Implement media library grid view
- [ ] MEDIA-002 Implement multi-file upload
- [ ] MEDIA-003 Add copy-to-clipboard for URLs
- [ ] MEDIA-004 Implement CV download button on public pages
- [ ] MEDIA-005 Add file type filtering

### Phase 13 — Contact System

- [ ] CONTACT-001 Verify honeypot spam protection
- [ ] CONTACT-002 Verify email notification
- [ ] CONTACT-003 Add contact info display
- [ ] CONTACT-004 Verify mark as read/unread
- [ ] CONTACT-005 Add unread count to sidebar badge

### Phase 14 — Multilingual Support

- [ ] I18N-001 Install and configure ngx-translate
- [ ] I18N-002 Create en.json translation file
- [ ] I18N-003 Create kh.json translation file
- [ ] I18N-004 Apply translate pipe to navigation
- [ ] I18N-005 Apply translate pipe to buttons
- [ ] I18N-006 Apply translate pipe to form labels
- [ ] I18N-007 Apply translate pipe to messages
- [ ] I18N-008 Apply localize pipe to dynamic content
- [ ] I18N-009 Verify language persistence
- [ ] I18N-010 Set default language and fallback

### Phase 15 — Theme & Accessibility

- [ ] THEME-001 Verify CSS custom properties in both themes
- [ ] THEME-002 Verify system preference detection
- [ ] THEME-003 Add smooth theme transition
- [ ] THEME-004 Verify color contrast (WCAG AA)
- [ ] A11Y-001 Add semantic HTML elements
- [ ] A11Y-002 Add aria-label to icon-only buttons
- [ ] A11Y-003 Ensure form fields have labels
- [ ] A11Y-004 Add aria-describedby for form errors
- [ ] A11Y-005 Add visible focus indicators
- [ ] A11Y-006 Add skip-to-content link
- [ ] A11Y-007 Add alt text to all images
- [ ] A11Y-008 Respect prefers-reduced-motion
- [ ] A11Y-009 Test keyboard navigation

### Phase 16 — SEO & Performance

- [ ] SEO-001 Create SEO service for dynamic meta
- [ ] SEO-002 Add unique title + meta to each page
- [ ] SEO-003 Add Open Graph to project pages
- [ ] SEO-004 Add Open Graph to blog pages
- [ ] SEO-005 Create robots.txt
- [ ] SEO-006 Create static sitemap.xml
- [ ] SEO-007 Verify lazy-loaded routes
- [ ] SEO-008 Add loading="lazy" to images
- [ ] SEO-009 Add compression middleware
- [ ] SEO-010 Verify Cloudinary URL optimizations
- [ ] SEO-011 Run Lighthouse audit (target >= 70)
- [ ] SEO-012 Add Twitter Card metadata

### Phase 17 — Testing & Quality

- [ ] TEST-001 Configure backend Jest with mongodb-memory-server
- [ ] TEST-002 Create test setup/teardown helpers
- [ ] TEST-003 Write utility function tests
- [ ] TEST-004 Write auth service unit tests
- [ ] TEST-005 Write auth endpoint integration tests
- [ ] TEST-006 Write project CRUD integration tests
- [ ] TEST-007 Write skill CRUD integration tests
- [ ] TEST-008 Write public project endpoint tests
- [ ] TEST-009 Write contact form endpoint tests
- [ ] TEST-010 Write blog CRUD integration tests
- [ ] TEST-011 Configure frontend test runner
- [ ] TEST-012 Write Header/Footer component tests
- [ ] TEST-013 Write AuthService tests
- [ ] TEST-014 Write ThemeService tests
- [ ] TEST-015 Write AuthGuard tests
- [ ] TEST-016 Write Login page component tests
- [ ] TEST-017 Write Contact form component tests
- [ ] TEST-018 Verify coverage targets met

### Phase 18 — Security Hardening

- [ ] SEC-001 Verify Helmet configuration
- [ ] SEC-002 Verify CORS whitelist
- [ ] SEC-003 Verify rate limiting
- [ ] SEC-004 Verify input sanitization (XSS)
- [ ] SEC-005 Verify MongoDB injection prevention
- [ ] SEC-006 Verify file upload restrictions
- [ ] SEC-007 Verify separate JWT secrets
- [ ] SEC-008 Verify refresh token cookie settings
- [ ] SEC-009 Verify production error messages
- [ ] SEC-010 Verify .env in .gitignore
- [ ] SEC-011 Run npm audit
- [ ] SEC-012 Verify password length enforcement
- [ ] SEC-013 Add request body size limit
- [ ] SEC-014 Verify no sensitive data in logs

### Phase 19 — Docker & CI/CD

- [ ] DEVOPS-001 Create backend production Dockerfile
- [ ] DEVOPS-002 Create frontend production Dockerfile
- [ ] DEVOPS-003 Create nginx.conf
- [ ] DEVOPS-004 Create production docker-compose.yml
- [ ] DEVOPS-005 Verify docker-compose.dev works end-to-end
- [ ] DEVOPS-006 Add Docker health checks
- [ ] DEVOPS-007 Create GitHub Actions CI workflow
- [ ] DEVOPS-008 Create GitHub Actions deploy workflow
- [ ] DEVOPS-009 Document required GitHub secrets

### Phase 20 — Production Deployment & Final QA

- [ ] DEPLOY-001 Set up MongoDB Atlas
- [ ] DEPLOY-002 Set up Cloudinary account
- [ ] DEPLOY-003 Deploy backend
- [ ] DEPLOY-004 Deploy frontend
- [ ] DEPLOY-005 Configure production env vars
- [ ] DEPLOY-006 Configure production CORS
- [ ] DEPLOY-007 Run seed script on production
- [ ] DEPLOY-008 Configure production email
- [ ] DEPLOY-009 Configure custom domain
- [ ] DEPLOY-010 Verify HTTPS
- [ ] DOC-001 Complete README.md
- [ ] DOC-002 Create SETUP.md
- [ ] DOC-003 Create DEPLOYMENT.md
- [ ] DOC-004 Create API.md
- [ ] DOC-005 Move PRD.md to docs/
- [ ] QA-001 Smoke test: public pages
- [ ] QA-002 Smoke test: admin CRUD
- [ ] QA-003 Smoke test: contact form
- [ ] QA-004 Smoke test: CV download
- [ ] QA-005 Smoke test: mobile responsive
- [ ] QA-006 Verify no console errors
- [ ] QA-007 Run Lighthouse audit

---

## 28. AI Coding Agent Execution Rules

### How to Use This Plan

1. **Read** `PRD.md` for product requirements
2. **Read** `Plan.md` (this document) for implementation tasks
3. **Find** the next incomplete task (first unchecked `[ ]` in the Master Checklist)
4. **Check** its dependencies (all listed dependency tasks must be complete)
5. **Implement** only the required task — do NOT implement multiple tasks at once
6. **Test** the implementation (compile, run, verify acceptance criteria)
7. **Fix** any failures before proceeding
8. **Mark** the task as complete: `[ ]` → `[x]`
9. **Continue** to the next task

### Rules

- **Never** skip a dependency — if a task depends on another, the dependency MUST be complete first
- **Never** implement features not defined in `PRD.md`
- **Never** change the technology stack
- **Never** add unnecessary abstractions or over-engineer
- **Always** follow the existing code patterns established in earlier phases
- **Always** use TypeScript strict mode
- **Always** handle errors gracefully
- **Always** write code that matches the PRD's API response format
- **Always** use the file/folder structure defined in PRD Section 32
- **When in doubt**, refer to `PRD.md` — it is the source of truth for product requirements

### Task Size

Each task should be completable in one focused coding session. If a task feels too large, break it into subtasks within the same phase.

### Status Updates

After completing each phase, update the Feature Matrix status column from `Not Started` to `Complete`.

---

*End of Plan.md*

*This document is derived from and subordinate to `PRD.md`. In case of conflict, `PRD.md` takes precedence for product requirements.*
