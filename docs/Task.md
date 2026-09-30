# Task.md — Implementation Tasks

## Developer Portfolio & Content Management Platform

**Version:** 1.0.0
**Derived From:** [PRD.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/PRD.md) · [Plan.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Plan.md)
**Created:** 2026-09-29
**Status:** Ready for Execution

---

## Document Hierarchy

```text
PRD.md       → Defines WHAT the product must do
    ↓
Plan.md      → Defines HOW and IN WHAT ORDER to implement
    ↓
Task.md      → Defines the EXACT actionable development tasks (this document)
```

---

## Table of Contents

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
- [Dependency Map](#dependency-map)
- [MVP Task Set](#mvp-task-set)
- [Traceability Matrix](#traceability-matrix)
- [Master Task Checklist](#master-task-checklist)
- [AI Coding Agent Execution Rules](#ai-coding-agent-execution-rules)

---

# Phase 0 — Project Planning & Repository Setup

---

## SETUP-001 Initialize Git Repository and Root Configuration

- Status: DONE
- Priority: P0
- Phase: Phase 0
- Dependencies:
  - None

### Objective

Initialize the Git repository for the portfolio monorepo project. Create the root-level configuration files: `.gitignore`, `.editorconfig`, and the skeleton folder structure.

### Requirements

- Git repository initialized at the project root
- `.gitignore` covering Node.js, Angular, TypeScript, IDE files, `.env`, `dist/`, `node_modules/`, OS files
- `.editorconfig` with consistent settings (UTF-8, LF line endings, 2-space indent for TS/JS/JSON/HTML/CSS, trim trailing whitespace)
- Root folder structure created per PRD Section 32

### Files / Modules

```
portfolio/
├── .gitignore
├── .editorconfig
├── frontend/           (empty directory)
├── backend/            (empty directory)
├── docs/               (empty directory)
└── .github/
    └── workflows/      (empty directory)
```

### Implementation Steps

1. Run `git init` in the project root directory.
2. Create `.gitignore` with entries for: `node_modules/`, `dist/`, `.env`, `.env.local`, `*.log`, `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/` (except settings), `coverage/`, `*.tgz`, `.angular/cache/`.
3. Create `.editorconfig` with `root = true`, `charset = utf-8`, `end_of_line = lf`, `indent_style = space`, `indent_size = 2`, `insert_final_newline = true`, `trim_trailing_whitespace = true`.
4. Create empty directories: `frontend/`, `backend/`, `docs/`, `.github/workflows/`.
5. Make an initial commit: `git add . && git commit -m "chore: initialize repository structure"`.

### Technical Notes

- Use `.gitkeep` files inside empty directories so Git tracks them.
- The `.gitignore` must include `.env` — secrets must never be committed.

### Testing

- Verify `git status` shows a clean working tree after initial commit.
- Verify directory structure exists.

### Acceptance Criteria

- [ ] Git repository initialized
- [ ] `.gitignore` covers all required patterns
- [ ] `.editorconfig` created with correct settings
- [ ] Folder structure `frontend/`, `backend/`, `docs/`, `.github/workflows/` exists
- [ ] Initial commit made

### Definition of Done

- [ ] Implementation completed
- [ ] Repository structure verified
- [ ] Initial commit exists in Git history

---

## SETUP-002 Initialize Node.js/Express Backend with TypeScript

- Status: DONE
- Priority: P0
- Phase: Phase 0
- Dependencies:
  - SETUP-001

### Objective

Set up the Node.js/Express backend project inside `backend/` with TypeScript. Install all core and dev dependencies per PRD Section 6.2. Configure `tsconfig.json` with strict mode. Create `package.json` scripts.

### Requirements

- Node.js backend project initialized in `backend/`
- TypeScript configured with strict mode
- All core dependencies installed per PRD Section 6.2: express, mongoose, cors, helmet, dotenv, jsonwebtoken, bcryptjs, multer, cloudinary, nodemailer, morgan, winston, swagger-ui-express, swagger-jsdoc, express-rate-limit, express-validator
- All dev dependencies installed: typescript, ts-node-dev, @types/express, @types/node, @types/cors, @types/morgan, @types/multer, @types/jsonwebtoken, @types/bcryptjs, @types/nodemailer, @types/swagger-ui-express, eslint, prettier, jest, ts-jest, @types/jest, supertest, @types/supertest
- Package.json scripts: `dev`, `build`, `start`, `lint`, `lint:fix`, `test`, `seed`
- `.env.example` with all required variables per PRD Section 31.1

### Files / Modules

```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.json (or eslint.config.js)
├── .prettierrc
└── src/
    ├── app.ts
    └── server.ts
```

### Implementation Steps

1. `cd backend && npm init -y`
2. Install core dependencies: `npm install express mongoose cors helmet dotenv jsonwebtoken bcryptjs multer cloudinary nodemailer morgan winston swagger-ui-express swagger-jsdoc express-rate-limit express-validator`
3. Install dev dependencies: `npm install -D typescript ts-node-dev @types/express @types/node @types/cors @types/morgan @types/multer @types/jsonwebtoken @types/bcryptjs @types/nodemailer @types/swagger-ui-express eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser jest ts-jest @types/jest supertest @types/supertest`
4. Create `tsconfig.json` with: `target: "ES2020"`, `module: "commonjs"`, `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`, `forceConsistentCasingInFileNames: true`, `outDir: "./dist"`, `rootDir: "./src"`, `resolveJsonModule: true`, `declaration: true`
5. Create `.env.example` with all variables from PRD Section 31.1 (NODE_ENV, PORT, CORS_ORIGIN, DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS, LOG_LEVEL)
6. Configure ESLint with TypeScript support and Prettier integration.
7. Create `.prettierrc` with: `singleQuote: true`, `trailingComma: "all"`, `semi: true`, `printWidth: 100`, `tabWidth: 2`
8. Add scripts to `package.json`:
   - `"dev": "ts-node-dev --respawn --transpile-only src/server.ts"`
   - `"build": "tsc"`
   - `"start": "node dist/server.js"`
   - `"lint": "eslint src/ --ext .ts"`
   - `"lint:fix": "eslint src/ --ext .ts --fix"`
   - `"test": "jest --passWithNoTests"`
   - `"seed": "ts-node-dev src/../seeds/seed.ts"`
9. Create minimal `src/app.ts` — import Express, create app, add `express.json()` middleware, export app.
10. Create minimal `src/server.ts` — import app, read PORT from env (default 3000), start listening, log startup message.

### Technical Notes

- Use `ts-node-dev` for hot-reload during development (not `nodemon` + `ts-node`)
- TypeScript strict mode must be enabled: `strict: true` in `tsconfig.json`
- Port defaults to `3000` if `PORT` env var is not set
- Do NOT add route handlers yet — just the Express app skeleton

### Testing

- Run `npm run build` — should compile without TypeScript errors
- Run `npm run dev` — server should start and log "Server running on port 3000"
- Verify `.env.example` contains all required variables

### Acceptance Criteria

- [x] `npm run build` compiles without errors
- [x] `npm run dev` starts the server on port 3000
- [x] `tsconfig.json` has `strict: true`
- [x] `.env.example` contains all 19+ required environment variables
- [x] ESLint and Prettier are configured
- [x] All package.json scripts exist

### Definition of Done

- [x] Backend project initialized with all dependencies
- [x] TypeScript compilation succeeds
- [x] Server starts and logs to console
- [x] No lint errors

---

## SETUP-003 Create Health Check Endpoint

- Status: DONE
- Priority: P0
- Phase: Phase 0
- Dependencies:
  - SETUP-002

### Objective

Add a health check endpoint `GET /api/v1/health` to the Express app that returns a JSON response confirming the server is running.

### Requirements

- `GET /api/v1/health` returns `{ status: "ok", timestamp: "<ISO string>" }`
- Response status code 200
- No authentication required

### Files / Modules

```
backend/src/app.ts (modify)
```

### Implementation Steps

1. In `app.ts`, add a route handler for `GET /api/v1/health`.
2. Return JSON: `{ status: "ok", timestamp: new Date().toISOString() }` with status 200.
3. Start the server with `npm run dev` and test the endpoint.

### Technical Notes

- This endpoint will later be used for Docker health checks per PRD Section 29.5.
- Keep it simple — no database dependency.

### Testing

- `curl http://localhost:3000/api/v1/health` returns `{ "status": "ok", "timestamp": "..." }` with HTTP 200.

### Acceptance Criteria

- [x] `GET /api/v1/health` returns 200 with JSON `{ status: "ok", timestamp: "..." }`
- [x] No authentication required
- [x] Server continues to start normally

### Definition of Done

- [x] Health check endpoint working
- [x] Verified via curl or HTTP client

---

## SETUP-004 Initialize Angular Frontend Project

- Status: DONE
- Priority: P0
- Phase: Phase 0
- Dependencies:
  - SETUP-001

### Objective

Scaffold the Angular frontend project inside `frontend/` using the Angular CLI. Configure Angular Material and Tailwind CSS.

### Requirements

- Angular project created with standalone components (Angular 19+)
- Angular Router enabled
- SSR disabled for V1 (can be added later)
- CSS (not SCSS) as default style format, per PRD specifying CSS custom properties
- Angular Material installed and configured
- Tailwind CSS installed and configured
- Frontend environment files created per PRD Section 31.2

### Files / Modules

```
frontend/
├── angular.json
├── package.json
├── tsconfig.json
├── tailwind.config.js (or tailwind.config.ts)
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
```

### Implementation Steps

1. From the project root, run: `npx -y @angular/cli@latest new frontend --style=css --routing --ssr=false --standalone --skip-git`
   - Note: `--skip-git` because the root repo is already initialized.
2. `cd frontend`
3. Add Angular Material: `ng add @angular/material` — choose a prebuilt theme (e.g., Indigo/Pink or custom), set up global typography, set up animations.
4. Install Tailwind CSS:
   - `npm install -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init`
5. Configure `tailwind.config.js`:
   - `content: ["./src/**/*.{html,ts}"]`
6. Add Tailwind directives to `src/styles.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
7. Create `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api/v1',
   };
   ```
8. Create `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://api.portfolio.example.com/api/v1',
   };
   ```
9. Configure ESLint for Angular: `ng add @angular-eslint/schematics`
10. Verify: `ng serve` starts on `localhost:4200` and the default page renders.

### Technical Notes

- Angular 19+ uses standalone components by default — no NgModules
- The Angular CLI version should be the latest stable
- Tailwind CSS version: Use whichever is stable (v3 or v4) per PRD UD6
- Do NOT add `@angular/ssr` yet — PRD marks SSR as SHOULD HAVE/FUTURE

### Testing

- `ng serve` compiles without errors and serves on `http://localhost:4200`
- Tailwind utility classes work (test by adding `class="text-red-500"` to a template)
- Angular Material components can be imported

### Acceptance Criteria

- [x] Angular project created with standalone components
- [x] Angular Material installed
- [x] Tailwind CSS configured and utility classes work
- [x] Environment files created with correct `apiUrl`
- [x] `ng serve` starts without errors
- [x] ESLint configured for Angular

### Definition of Done

- [x] Frontend compiles and serves
- [x] Angular Material and Tailwind CSS are both functional
- [x] Environment files exist

---

## SETUP-005 Create Docker Compose for Local Development

- Status: DONE
- Priority: P1
- Phase: Phase 0
- Dependencies:
  - SETUP-002
  - SETUP-004

### Objective

Create `docker-compose.dev.yml` and development Dockerfiles for the frontend, backend, and MongoDB per PRD Section 29.2.

### Requirements

- `docker-compose.dev.yml` with 3 services: frontend (4200), backend (3000), MongoDB (27017)
- Backend `Dockerfile.dev` with hot-reload
- Frontend `Dockerfile.dev` with hot-reload
- MongoDB with named volume for data persistence
- Hot-reload via volume mounts (source code mounted into containers)

### Files / Modules

```
portfolio/
├── docker-compose.dev.yml
├── frontend/
│   └── Dockerfile.dev
└── backend/
    └── Dockerfile.dev
```

### Implementation Steps

1. Create `backend/Dockerfile.dev`:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   EXPOSE 3000
   CMD ["npm", "run", "dev"]
   ```
2. Create `frontend/Dockerfile.dev`:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   EXPOSE 4200
   CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
   ```
3. Create `docker-compose.dev.yml` per PRD Section 29.2 with services: frontend, backend, mongo.
4. Add volume mounts for source code (`./frontend:/app`, `./backend:/app`) with `/app/node_modules` excluded.
5. Add `env_file: ./backend/.env` for the backend service.
6. Add named volume `mongodb_data` for MongoDB persistence.
7. Set `MONGO_INITDB_DATABASE=portfolio` on the MongoDB service.

### Technical Notes

- Backend depends on MongoDB (use `depends_on`)
- Frontend depends on backend (use `depends_on`)
- Volume mounts enable hot-reload without rebuilding containers
- Exclude `node_modules` from volume mounts to use container-installed versions

### Testing

- `docker-compose -f docker-compose.dev.yml up --build` starts all 3 services
- Frontend accessible at `http://localhost:4200`
- Backend health check at `http://localhost:3000/api/v1/health`
- MongoDB accessible at `localhost:27017`

### Acceptance Criteria

- [x] `docker-compose -f docker-compose.dev.yml up` starts all 3 services
- [x] Frontend accessible at port 4200
- [x] Backend health check returns 200 at port 3000
- [x] MongoDB runs on port 27017
- [x] Source code changes trigger hot-reload in containers

### Definition of Done

- [x] Docker Compose runs successfully
- [x] All 3 services start and are accessible
- [x] Hot-reload works for both frontend and backend

---

## SETUP-006 Create Basic README.md

- Status: DONE
- Priority: P1
- Phase: Phase 0
- Dependencies:
  - SETUP-002
  - SETUP-004

### Objective

Create a basic `README.md` at the project root with project overview, tech stack, and local development instructions.

### Requirements

- Project name and description
- Technology stack summary
- Prerequisites (Node.js, Docker, MongoDB)
- Quick start instructions (with and without Docker)
- Environment setup reference (point to `.env.example`)
- Project structure overview

### Files / Modules

```
portfolio/
└── README.md
```

### Implementation Steps

1. Create `README.md` with sections: Project Overview, Tech Stack, Prerequisites, Quick Start (Docker), Quick Start (Manual), Environment Variables, Project Structure, License.
2. Reference `PRD.md` and `Plan.md` in a Documentation section.
3. Include both Docker-based and manual setup instructions.

### Technical Notes

- This is a basic version — it will be completed in Phase 20 (DOC-001).
- Keep it practical and focused on getting started.

### Testing

- README renders correctly as Markdown.

### Acceptance Criteria

- [x] README.md exists at project root
- [x] Contains project description, tech stack, and setup instructions
- [x] References `.env.example` for environment configuration

### Definition of Done

- [x] README created and committed

---

# Phase 1 — Backend Foundation

---

## BACKEND-001 Create Environment Configuration Module

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - SETUP-002

### Objective

Create a centralized environment configuration module that loads and validates all required environment variables at startup. The app should fail fast if critical variables are missing.

### Requirements

- Load all env vars from `.env` using `dotenv`
- Validate that required variables exist at startup
- Export a typed configuration object
- Fail with a clear error message if critical vars are missing

### Files / Modules

```
backend/src/config/environment.ts
```

### Implementation Steps

1. Create `src/config/environment.ts`.
2. Call `dotenv.config()` at the top.
3. Define a typed `Config` interface with all environment variable fields.
4. Read each variable from `process.env` with sensible defaults where appropriate:
   - `NODE_ENV` default: `'development'`
   - `PORT` default: `3000`
   - `CORS_ORIGIN` default: `'http://localhost:4200'`
   - `JWT_ACCESS_EXPIRATION` default: `'15m'`
   - `JWT_REFRESH_EXPIRATION` default: `'7d'`
   - `LOG_LEVEL` default: `'debug'`
   - `RATE_LIMIT_WINDOW_MS` default: `900000`
   - `RATE_LIMIT_MAX_REQUESTS` default: `100`
5. Validate required variables at startup: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`. If missing, throw a descriptive error.
6. Export the config object as a typed constant.

### Technical Notes

- Never log secret values during startup
- Cloudinary and email vars are optional in development (features gracefully degrade)
- This module will be imported by all other config modules

### Testing

- Module loads without error when `.env` has required variables
- Module throws descriptive error when `DATABASE_URL` is missing
- Module throws descriptive error when `JWT_SECRET` is missing

### Acceptance Criteria

- [x] Config module exports typed configuration
- [x] Missing critical vars cause clear startup error
- [x] Defaults applied for non-critical vars
- [x] No secrets logged to console

### Definition of Done

- [x] `environment.ts` created and compiles
- [x] Required variable validation works
- [x] Imported by `server.ts` / `app.ts`

---

## BACKEND-002 Create Custom Error Classes

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - SETUP-002

### Objective

Create custom error classes for consistent error handling across the application per PRD Section 14.1.

### Requirements

- Base `AppError` class extending `Error` with `statusCode`, `isOperational`, `status`
- `ValidationError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `RateLimitError` (429)

### Files / Modules

```
backend/src/utils/AppError.ts
```

### Implementation Steps

1. Create `src/utils/AppError.ts`.
2. Define base `AppError` class:
   ```typescript
   class AppError extends Error {
     statusCode: number;
     status: string;
     isOperational: boolean;
     constructor(message: string, statusCode: number) { ... }
   }
   ```
3. Define subclasses: `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `RateLimitError` — each with a preset `statusCode` and sensible default message.
4. Export all classes.

### Technical Notes

- `isOperational: true` — these are expected errors, not bugs
- `status`: `'fail'` for 4xx, `'error'` for 5xx
- These classes will be caught by the global error handler middleware

### Testing

- Each error class has the correct `statusCode`
- Each error class extends `AppError`
- `isOperational` is `true` for all custom errors

### Acceptance Criteria

- [x] All 7 error classes created
- [x] Each has correct statusCode
- [x] All extend AppError → Error

### Definition of Done

- [x] Error classes compile and export correctly
- [x] Can be instantiated with custom messages

---

## BACKEND-003 Create Global Error Handler Middleware

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - BACKEND-002

### Objective

Create centralized error handling middleware that catches all errors thrown in route handlers and returns consistent JSON error responses per PRD Sections 13.3 and 14.1.

### Requirements

- Catches all errors and returns consistent JSON format: `{ success: false, message: "...", errors: [...] }`
- Transforms Mongoose validation errors to 400 with field details
- Transforms Mongoose duplicate key errors to 409
- Transforms JWT errors (JsonWebTokenError, TokenExpiredError) to 401
- Does NOT expose stack traces in production
- Logs full error details in development

### Files / Modules

```
backend/src/middleware/errorHandler.middleware.ts
```

### Implementation Steps

1. Create `src/middleware/errorHandler.middleware.ts`.
2. Implement Express error-handling middleware `(err, req, res, next)`.
3. Check `err` type:
   - If `AppError` (operational): use its `statusCode` and `message`.
   - If Mongoose `ValidationError`: map to 400 with `errors` array of `{ field, message }`.
   - If Mongoose error code `11000` (duplicate key): map to 409 `ConflictError`.
   - If `JsonWebTokenError` or `TokenExpiredError`: map to 401.
   - Otherwise: 500 Internal Server Error.
4. In development: include stack trace in response.
5. In production: return generic message for non-operational errors.
6. Log the error using the logger (to be created in BACKEND-004).

### Technical Notes

- This must be the LAST middleware registered in `app.ts`
- Use 4-parameter signature `(err, req, res, next)` for Express to recognize it as error middleware
- PRD Section 14.1: "Does NOT expose stack traces in production"

### Testing

- `AppError` returns correct status code and message
- Mongoose validation error returns 400 with field details
- Unknown error returns 500 with generic message in production mode

### Acceptance Criteria

- [x] Returns correct JSON format per PRD Section 13.3
- [x] Mongoose validation errors → 400 with field details
- [x] Mongoose duplicate key → 409
- [x] JWT errors → 401
- [x] No stack traces in production
- [x] Generic message for non-operational errors in production

### Definition of Done

- [x] Error handler middleware created
- [x] Handles all specified error types
- [x] Registered in `app.ts`

---

## BACKEND-004 Create Logger and HTTP Request Logging

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - BACKEND-001

### Objective

Create a Winston logger for application logging and configure Morgan for HTTP request logging per PRD Section 26.1.

### Requirements

- Winston logger with configurable log level from environment
- JSON format in production, human-readable (colorized) in development
- Log to console (stdout) — suitable for containerized deployments
- Morgan HTTP logging integrated with Winston
- Never log: passwords, JWT secrets, refresh tokens, full request bodies with sensitive data

### Files / Modules

```
backend/src/utils/logger.ts
```

### Implementation Steps

1. Create `src/utils/logger.ts`.
2. Configure Winston with:
   - Level from `config.logLevel` (default: `'debug'` in dev, `'info'` in production)
   - Format: `json` in production, `combine(colorize(), simple())` in development
   - Transport: `Console`
3. Export the logger instance.
4. Create a Morgan middleware configuration that streams to Winston's `info` level.
5. Export the Morgan middleware for use in `app.ts`.

### Technical Notes

- PRD Section 26.1: "JSON in production, human-readable in development"
- PRD Section 26.1: "Console (stdout) — suitable for containerized deployments"
- Morgan format: use `'combined'` in production, `'dev'` in development

### Testing

- Logger outputs to console in correct format per environment
- HTTP requests are logged with method, URL, status, response time

### Acceptance Criteria

- [x] Winston logger created with environment-based configuration
- [x] Morgan integrated with Winston
- [x] JSON format in production, colorized in development
- [x] Log level configurable via environment

### Definition of Done

- [x] Logger module created and exported
- [x] Morgan middleware exported
- [x] Both registered in `app.ts`

---

## BACKEND-005 Create Utility Functions

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - SETUP-002

### Objective

Create the core utility functions required across the backend: `catchAsync` (async error wrapper), `apiResponse` (consistent response helper), `slugify` (URL-friendly slug generator), `pagination` (query param parser), and `readingTime` (word-count-based time estimate).

### Requirements

- `catchAsync`: Wraps async route handlers to forward errors to the error handler
- `apiResponse`: Helpers for success, error, and paginated responses per PRD Section 13
- `slugify`: Generates URL-friendly slugs from strings
- `pagination`: Parses `page` and `limit` query params, returns `{ page, limit, skip }`
- `readingTime`: Calculates reading time from text content (~200 words/min)

### Files / Modules

```
backend/src/utils/catchAsync.ts
backend/src/utils/apiResponse.ts
backend/src/utils/slugify.ts
backend/src/utils/pagination.ts
backend/src/utils/readingTime.ts
```

### Implementation Steps

1. **`catchAsync.ts`**: Higher-order function that takes an async `(req, res, next)` handler and returns a wrapper that catches rejected promises and calls `next(err)`.
2. **`apiResponse.ts`**: Export functions:
   - `sendSuccess(res, data, message, statusCode = 200)` → `{ success: true, data, message }`
   - `sendCreated(res, data, message)` → status 201
   - `sendPaginated(res, items, pagination, message)` → per PRD Section 13.2
   - `sendNoContent(res)` → status 204
3. **`slugify.ts`**: Convert string to lowercase, replace spaces/special chars with hyphens, remove non-alphanumeric chars, trim hyphens. Handle edge cases (empty string, unicode).
4. **`pagination.ts`**: Parse `page` (default 1, min 1) and `limit` (default 10, min 1, max 20) from query params. Return `{ page, limit, skip: (page - 1) * limit }`.
5. **`readingTime.ts`**: Split text by whitespace, count words, divide by 200, round up. Return minutes as a number.

### Technical Notes

- Pagination `limit` max is 20 per PRD Section 12.2 (projects endpoint specifies max 20)
- Slugify should handle Khmer characters gracefully (transliterate or remove)
- `apiResponse` format must match PRD Section 13 exactly

### Testing

- `slugify("Hello World")` → `"hello-world"`
- `slugify("CamTraffic AI!")` → `"camtraffic-ai"`
- `pagination({ page: "2", limit: "6" })` → `{ page: 2, limit: 6, skip: 6 }`
- `pagination({})` → `{ page: 1, limit: 10, skip: 0 }`
- `readingTime("word ".repeat(400))` → `2`

### Acceptance Criteria

- [x] All 5 utilities created and exported
- [x] `catchAsync` forwards errors to next()
- [x] `apiResponse` matches PRD Section 13 format
- [x] `slugify` produces URL-friendly strings
- [x] `pagination` enforces min/max limits
- [x] `readingTime` calculates correct minutes

### Definition of Done

- [x] All utility files compile
- [x] Functions produce correct output for test cases

---

## BACKEND-006 Create Validation and Rate Limiting Middleware

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - BACKEND-002

### Objective

Create a reusable validation middleware wrapper for `express-validator` and configure rate limiting middleware per PRD Section 18.1.

### Requirements

- Validation middleware that runs `express-validator` chains and returns 400 with field-level errors if validation fails
- Global rate limiter with configurable window and max requests
- Separate rate limiter presets for login (5/15min) and contact (5/hour)

### Files / Modules

```
backend/src/middleware/validate.middleware.ts
backend/src/middleware/rateLimiter.middleware.ts
```

### Implementation Steps

1. **`validate.middleware.ts`**: Create middleware that:
   - Accepts an array of `express-validator` `ValidationChain`
   - Runs all validations
   - Checks `validationResult(req)`
   - If errors: returns 400 with `{ success: false, message: "Validation failed", errors: [{ field, message }] }`
   - If valid: calls `next()`
2. **`rateLimiter.middleware.ts`**: Create and export:
   - `globalLimiter`: `windowMs` and `max` from env config (default: 100 req / 15 min)
   - `loginLimiter`: 5 requests per 15 minutes per IP
   - `contactLimiter`: 5 requests per hour per IP
   - Standard JSON error response on limit: `{ success: false, message: "Too many requests..." }`

### Technical Notes

- Validation middleware pattern: `validate(validationChains)` returns an Express middleware
- Rate limiter uses `express-rate-limit` library
- Rate limit response format must match PRD Section 13.3

### Testing

- Validation middleware returns 400 with field errors on invalid input
- Validation middleware calls next() on valid input
- Rate limiter returns 429 after exceeding limit

### Acceptance Criteria

- [x] Validation middleware returns 400 with field-level error details
- [x] Global rate limiter configured
- [x] Login rate limiter: 5 attempts / 15 min
- [x] Contact rate limiter: 5 requests / hour
- [x] Rate limit response is JSON format

### Definition of Done

- [x] Both middleware files created
- [x] Exported and ready for route use

---

## BACKEND-007 Create TypeScript Type Definitions

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - SETUP-002

### Objective

Create TypeScript type definitions and interfaces for the Express request extensions and shared types used across the backend.

### Requirements

- Extend Express `Request` type to include `user` property (set by auth middleware)
- Define shared types/interfaces for API responses, pagination, and bilingual fields

### Files / Modules

```
backend/src/types/index.ts
backend/src/types/express.d.ts
```

### Implementation Steps

1. **`express.d.ts`**: Extend Express `Request`:
   ```typescript
   declare namespace Express {
     interface Request {
       user?: { userId: string; role: string };
     }
   }
   ```
2. **`index.ts`**: Define shared types:
   - `BilingualField`: `{ en: string; kh: string }`
   - `BilingualArrayField`: `{ en: string[]; kh: string[] }`
   - `PaginationQuery`: `{ page?: string; limit?: string; sort?: string }`
   - `PaginationResult`: `{ page, limit, total, totalPages, hasNextPage, hasPrevPage }`
   - `ApiResponse<T>`: `{ success: boolean; data: T; message: string }`
   - Export all types

### Technical Notes

- The `express.d.ts` file uses declaration merging to extend Express types
- Ensure `tsconfig.json` includes the types directory

### Testing

- TypeScript compilation succeeds with the custom types
- Types can be imported in other files

### Acceptance Criteria

- [x] Express Request type extended with `user` property
- [x] Shared types defined and exportable
- [x] TypeScript compilation succeeds

### Definition of Done

- [x] Type definition files created
- [x] Compilation passes with custom types

---

## BACKEND-008 Configure CORS and Security Headers in App

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - BACKEND-001
  - BACKEND-004

### Objective

Create the CORS configuration module per PRD Section 18.3 and configure Helmet security headers. Wire all middleware into `app.ts` to create the final Express middleware stack.

### Requirements

- CORS configured to allow only the frontend origin from environment
- `credentials: true` for cookie support (refresh tokens)
- Helmet security headers enabled
- All middleware wired in correct order in `app.ts`

### Files / Modules

```
backend/src/config/cors.ts (create)
backend/src/app.ts (modify — wire all middleware)
```

### Implementation Steps

1. Create `src/config/cors.ts`:
   - Read `CORS_ORIGIN` from config
   - Export cors options: `{ origin, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }`
2. Update `src/app.ts` to apply middleware in order:
   1. `helmet()`
   2. `cors(corsOptions)`
   3. `express.json({ limit: '10mb' })`
   4. `express.urlencoded({ extended: true })`
   5. Morgan HTTP logging middleware
   6. Global rate limiter
   7. API routes (`/api/v1/*`)
   8. 404 handler for unknown routes
   9. Global error handler (LAST)
3. Add a 404 handler that returns `{ success: false, message: "Route not found" }` with status 404.

### Technical Notes

- Middleware order matters: Helmet and CORS first, error handler last
- The body size limit (`10mb`) accommodates large request bodies with base64 images, but Cloudinary uploads use multipart/form-data
- Request body size limit per SEC-013 in Plan.md

### Testing

- CORS headers present in responses
- Unknown routes return 404 JSON
- Helmet security headers present (check via curl -I)

### Acceptance Criteria

- [x] CORS allows only configured origin
- [x] Helmet headers present
- [x] Request body parsing works
- [x] Unknown routes → 404 JSON response
- [x] Error handler catches and formats errors
- [x] Middleware applied in correct order

### Definition of Done

- [x] `app.ts` fully configured with all middleware
- [x] Server starts without errors
- [x] CORS and security verified

---

## BACKEND-009 Create Route Structure with API Versioning

- Status: DONE
- Priority: P0
- Phase: Phase 1
- Dependencies:
  - BACKEND-008

### Objective

Create the base route structure with `/api/v1` versioning prefix. Set up route mounting points for auth, public, and admin routes (route files to be created in later phases).

### Requirements

- Base router at `/api/v1`
- Health check route at `/api/v1/health`
- Mounting points for: auth routes, public routes, admin routes
- Clean route organization

### Files / Modules

```
backend/src/routes/index.ts (create)
backend/src/app.ts (modify — mount routes)
```

### Implementation Steps

1. Create `src/routes/index.ts`:
   - Create an Express Router
   - Mount health check at `/health`
   - Export placeholders for where auth, public, and admin routes will be mounted
   - Add comments for future route mounting:
     ```typescript
     // router.use('/auth', authRoutes);      // Phase 3
     // router.use('/', publicRoutes);         // Phase 5
     // router.use('/admin', adminRoutes);     // Phase 4
     ```
2. Update `app.ts` to mount the router at `/api/v1`.

### Technical Notes

- API versioning prefix: `/api/v1` per PRD Section 12
- Keep the route file clean — actual route handlers will be added in later phases
- The comments serve as documentation for future phase implementations

### Testing

- `GET /api/v1/health` still returns 200
- Other routes under `/api/v1/` return 404

### Acceptance Criteria

- [x] Route structure created with `/api/v1` prefix
- [x] Health check accessible at `/api/v1/health`
- [x] Route file organized for future expansion

### Definition of Done

- [x] Routes file created and mounted
- [x] API versioning working

---

# Phase 2 — MongoDB Database & Models

---

## DB-001 Create MongoDB Connection Module

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - BACKEND-001

### Objective

Create the MongoDB connection module using Mongoose. Connect to the database on server startup and handle connection errors and graceful shutdown.

### Requirements

- Connect to MongoDB using `DATABASE_URL` from environment config
- Log successful connection
- Log and handle connection errors
- Graceful shutdown: close connection on `SIGINT` and `SIGTERM`
- Mongoose connection options for stability

### Files / Modules

```
backend/src/config/database.ts (create)
backend/src/server.ts (modify — connect before starting server)
```

### Implementation Steps

1. Create `src/config/database.ts`:
   - Export an async `connectDatabase()` function
   - Call `mongoose.connect(config.databaseUrl)` with appropriate options
   - Log: `"MongoDB connected: <host>"`
   - Add event listeners for `error` and `disconnected`
2. Update `src/server.ts`:
   - Call `connectDatabase()` before `app.listen()`
   - If connection fails, log error and exit process
3. Add graceful shutdown handlers:
   - `process.on('SIGINT', ...)` → close Mongoose connection → exit
   - `process.on('SIGTERM', ...)` → close Mongoose connection → exit

### Technical Notes

- Use `mongoose.set('strictQuery', true)` to suppress deprecation warnings
- Do not hardcode the database URL — always use environment config
- In development, Mongoose debug mode can be enabled via config

### Testing

- Server starts and logs "MongoDB connected" when database is available
- Server logs clear error when database is unavailable
- Ctrl+C triggers graceful shutdown with connection closure

### Acceptance Criteria

- [x] MongoDB connects on server startup
- [x] Connection success logged
- [x] Connection errors handled gracefully
- [x] Graceful shutdown closes connection
- [x] No hardcoded connection strings

### Definition of Done

- [x] Database module created
- [x] Server connects to MongoDB on startup
- [x] Graceful shutdown implemented

---

## DB-002 Create User Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the User Mongoose model per PRD Section 11.3. This model stores admin account(s) with hashed passwords.

### Requirements

- Fields per PRD Section 11.3: `email` (unique, indexed), `password` (bcrypt hash), `fullName`, `role` (enum: `admin`, default: `admin`), `avatar` (optional), `lastLogin` (optional), `isActive` (default: true)
- Timestamps: `createdAt`, `updatedAt`
- Index: `{ email: 1 }` unique
- Pre-save hook: hash password with bcrypt (salt rounds = 12) when password is modified
- Instance method: `comparePassword(candidatePassword)` → returns boolean
- TypeScript interface exported

### Files / Modules

```
backend/src/models/User.ts
```

### Implementation Steps

1. Create `src/models/User.ts`.
2. Define `IUser` interface extending `mongoose.Document`:
   ```typescript
   interface IUser extends Document {
     email: string;
     password: string;
     fullName: string;
     role: 'admin';
     avatar?: string;
     lastLogin?: Date;
     isActive: boolean;
     comparePassword(candidatePassword: string): Promise<boolean>;
   }
   ```
3. Define Mongoose schema with all fields, types, required flags, defaults, enums.
4. Add `{ timestamps: true }` option.
5. Add index: `{ email: 1 }` unique.
6. Add pre-save hook: If `this.isModified('password')`, hash with `bcrypt.hash(password, 12)`.
7. Add instance method: `comparePassword` using `bcrypt.compare()`.
8. Create and export model: `mongoose.model<IUser>('User', userSchema)`.

### Technical Notes

- Password validation (min 8 chars) at schema level: `minlength: 8`
- Email validation at schema level: use `match` with email regex
- Never return password in queries — use `.select('-password')` in services
- PRD Section 18.1: bcrypt salt rounds = 12

### Testing

- Model validates required fields
- Password is hashed on save (not stored in plain text)
- `comparePassword` returns true for correct password, false for wrong
- Duplicate email causes unique constraint error

### Acceptance Criteria

- [x] User model created with all PRD Section 11.3 fields
- [x] Password hashed with bcrypt (12 salt rounds) on save
- [x] `comparePassword` method works
- [x] Email unique index defined
- [x] TypeScript interface exported

### Definition of Done

- [x] Model compiles and exports correctly
- [x] Pre-save hook hashes passwords
- [x] Instance method verifies passwords

---

## DB-003 Create Profile Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Profile Mongoose model per PRD Section 11.4. This is a singleton collection storing the portfolio owner's profile.

### Requirements

- All fields per PRD Section 11.4 with bilingual `{ en, kh }` structure
- Singleton pattern (only one document)
- Timestamps

### Files / Modules

```
backend/src/models/Profile.ts
```

### Implementation Steps

1. Create `src/models/Profile.ts`.
2. Define `IProfile` interface with all fields from PRD Section 11.4:
   - `fullName`: `{ en: string, kh: string }`
   - `title`: `{ en: string, kh: string }`
   - `introduction`: `{ en: string, kh: string }`
   - `about`: `{ en: string, kh: string }`
   - `professionalSummary`: `{ en: string, kh: string }` (optional)
   - `careerInterests`: `{ en: string, kh: string }` (optional)
   - `background`: `{ en: string, kh: string }` (optional)
   - `strengths`: `{ en: string[], kh: string[] }` (optional)
   - `goals`: `{ en: string, kh: string }` (optional)
   - `profileImage`: string (optional, Cloudinary URL)
   - `aboutImage`: string (optional, Cloudinary URL)
   - `email`: string (optional)
   - `phone`: string (optional)
   - `location`: `{ en: string, kh: string }` (optional)
3. Define bilingual sub-schema for reuse.
4. Add `{ timestamps: true }`.
5. Export model and interface.

### Technical Notes

- Singleton: Application uses `findOneAndUpdate({}, data, { upsert: true, new: true })`
- Bilingual fields: Create a reusable sub-schema `bilingualString` and `bilingualArray`
- `about` field stores Markdown content

### Testing

- Model creates a document with required bilingual fields
- Bilingual fields accept both `en` and `kh` values

### Acceptance Criteria

- [x] Profile model created with all PRD Section 11.4 fields
- [x] Bilingual field structure works
- [x] Model compiles without errors

### Definition of Done

- [x] Model file created and exported
- [x] All fields match PRD specification

---

## DB-004 Create Category Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Category Mongoose model per PRD Section 11.11. Categories are referenced by Projects and BlogPosts.

### Requirements

- Fields: `name` (bilingual), `slug` (unique), `description` (bilingual, optional), `type` (enum: `project`, `blog`, `both`), `order` (optional)
- Indexes: `{ slug: 1 }` unique, `{ type: 1 }`
- Timestamps

### Files / Modules

```
backend/src/models/Category.ts
```

### Implementation Steps

1. Create model with all fields per PRD Section 11.11.
2. Add slug uniqueness index.
3. Add pre-save hook for slug auto-generation from English name if not provided.
4. Export model and interface.

### Testing

- Category creates with valid data
- Slug is unique
- Type enum validation works

### Acceptance Criteria

- [x] Category model created per PRD Section 11.11
- [x] Slug unique index defined
- [x] Type enum validated

### Definition of Done

- [x] Model file created and compiled

---

## DB-005 Create Project Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001
  - DB-004

### Objective

Create the Project Mongoose model per PRD Section 11.5. This is one of the most complex models with bilingual fields, references, and multiple indexes.

### Requirements

- All fields per PRD Section 11.5 including bilingual fields for title, descriptions, problem, solution, features, challenges, lessonsLearned
- References: `category` → ObjectId ref to `Category`
- Slug: auto-generated, unique, indexed
- Indexes per PRD: `{ slug: 1 }` unique, `{ status: 1, featured: -1, order: 1 }`, `{ category: 1 }`, `{ technologies: 1 }`
- Pre-save hook for slug generation from English title

### Files / Modules

```
backend/src/models/Project.ts
```

### Implementation Steps

1. Define `IProject` interface with all fields from PRD Section 11.5.
2. Create schema with correct types, required flags, defaults, enums.
3. Add reference: `category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }`
4. Add all 4 indexes.
5. Add pre-save hook: auto-generate slug from `title.en` if slug is not set or title changed. Ensure uniqueness by appending random suffix on collision.
6. Export model and interface.

### Technical Notes

- `technologies`: Array of strings, not references
- `screenshots`: Array of Cloudinary URL strings
- `status` enum: `draft`, `published` — default `draft`
- `featured` default: `false`
- `viewCount` default: `0`
- `order` is optional — for manual sorting

### Testing

- Model validates all required fields
- Slug auto-generated from English title
- Category reference validates as ObjectId
- Status enum validates

### Acceptance Criteria

- [x] All PRD Section 11.5 fields present
- [x] 4 indexes defined
- [x] Slug auto-generated and unique
- [x] Category reference works

### Definition of Done

- [x] Model created with complete schema

---

## DB-006 Create Skill Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Skill Mongoose model per PRD Section 11.6.

### Requirements

- Fields: `name` (string, required), `category` (bilingual), `icon` (optional), `order` (optional), `isVisible` (boolean, default true)
- Index: `{ category: 1, order: 1 }`
- Timestamps

### Files / Modules

```
backend/src/models/Skill.ts
```

### Implementation Steps

1. Create model with fields per PRD Section 11.6.
2. Add index.
3. Export model and interface.

### Acceptance Criteria

- [x] Model matches PRD Section 11.6
- [x] Index defined

### Definition of Done

- [x] Model file created and compiled

---

## DB-007 Create Experience Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Experience Mongoose model per PRD Section 11.7.

### Requirements

- All bilingual fields: `title`, `organization`, `location`, `description`, `responsibilities`
- `type` enum: `work`, `volunteer`, `internship`, `freelance`
- `startDate`, `endDate` (optional), `isCurrent` boolean
- `technologies` array of strings
- Index: `{ order: 1, startDate: -1 }`

### Files / Modules

```
backend/src/models/Experience.ts
```

### Implementation Steps

1. Create model with all fields per PRD Section 11.7.
2. Add index.
3. Export model and interface.

### Acceptance Criteria

- [x] Model matches PRD Section 11.7
- [x] Type enum validated

### Definition of Done

- [x] Model file created

---

## DB-008 Create Education Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Education Mongoose model per PRD Section 11.8.

### Requirements

- Bilingual fields: `institution`, `degree`, `field`, `description`, `activities`
- `startYear` (number), `endYear` (optional number), `gpa` (optional string)
- Index: `{ order: 1, startYear: -1 }`

### Files / Modules

```
backend/src/models/Education.ts
```

### Acceptance Criteria

- [x] Model matches PRD Section 11.8

### Definition of Done

- [x] Model file created

---

## DB-009 Create Certification Model

- Status: DONE
- Priority: P1
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Certification Mongoose model per PRD Section 11.9. This model also serves achievements (via `type` enum).

### Requirements

- Bilingual fields: `name`, `organization`, `description`
- `type` enum: `certification`, `award`, `achievement`
- Date fields: `issueDate`, `expirationDate` (optional)
- `credentialId`, `credentialUrl`, `image` (optional)
- `isVisible` default true, `order`
- Index: `{ type: 1, order: 1 }`

### Files / Modules

```
backend/src/models/Certification.ts
```

### Acceptance Criteria

- [x] Model matches PRD Section 11.9
- [x] Type enum validated

### Definition of Done

- [x] Model file created

---

## DB-010 Create BlogPost Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001
  - DB-004

### Objective

Create the BlogPost Mongoose model per PRD Section 11.10.

### Requirements

- Bilingual fields: `title`, `excerpt`, `content` (Markdown)
- References: `category` → Category, `author` → User
- `slug` unique indexed, `tags` array, `status` enum, `featured`, `publishedAt`, `readingTime`, `viewCount`
- Indexes: `{ slug: 1 }` unique, `{ status: 1, publishedAt: -1 }`, `{ category: 1 }`, `{ tags: 1 }`
- Pre-save: Calculate `readingTime` from English content word count / 200

### Files / Modules

```
backend/src/models/BlogPost.ts
```

### Implementation Steps

1. Create model with all fields.
2. Add all 4 indexes.
3. Add pre-save hook: auto-generate slug from English title.
4. Add pre-save hook: calculate `readingTime` from `content.en` word count / 200, rounded up.
5. Export model and interface.

### Acceptance Criteria

- [x] Model matches PRD Section 11.10
- [x] Reading time calculated on save
- [x] Slug auto-generated

### Definition of Done

- [x] Model file created with hooks

---

## DB-011 Create Message Model

- Status: DONE
- Priority: P0
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Message Mongoose model per PRD Section 11.12 for storing contact form submissions.

### Requirements

- Fields: `name`, `email`, `subject`, `message` (all required strings)
- `isRead` (boolean, default false), `isArchived` (boolean, default false), `readAt` (optional Date)
- `ipAddress` (optional string for rate limiting context)
- Indexes: `{ isRead: 1, createdAt: -1 }`, `{ isArchived: 1 }`

### Files / Modules

```
backend/src/models/Message.ts
```

### Acceptance Criteria

- [x] Model matches PRD Section 11.12

### Definition of Done

- [x] Model file created

---

## DB-012 Create Media Model

- Status: DONE
- Priority: P1
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Media Mongoose model per PRD Section 11.13 for tracking uploaded files.

### Requirements

- Fields: `fileName`, `url`, `publicId` (Cloudinary), `mimeType`, `size`, `width`, `height` (optional), `altText` (bilingual, optional), `folder` (optional)
- Indexes: `{ publicId: 1 }` unique, `{ mimeType: 1 }`, `{ createdAt: -1 }`

### Files / Modules

```
backend/src/models/Media.ts
```

### Acceptance Criteria

- [x] Model matches PRD Section 11.13

### Definition of Done

- [x] Model file created

---

## DB-013 Create SocialLink Model

- Status: DONE
- Priority: P1
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the SocialLink Mongoose model per PRD Section 11.14.

### Requirements

- Fields: `platform` (enum: github, linkedin, facebook, email, twitter, youtube, other), `label`, `url`, `icon` (optional), `order`, `isVisible` (default true)
- Index: `{ order: 1 }`

### Files / Modules

```
backend/src/models/SocialLink.ts
```

### Acceptance Criteria

- [x] Model matches PRD Section 11.14

### Definition of Done

- [x] Model file created

---

## DB-014 Create Settings Model

- Status: DONE
- Priority: P1
- Phase: Phase 2
- Dependencies:
  - DB-001

### Objective

Create the Settings Mongoose model per PRD Section 11.15. Singleton collection for application settings.

### Requirements

- Fields: `siteTitle` (bilingual), `siteDescription` (bilingual), `enableCvDownload` (boolean, default true), `cvFile` (object: url, publicId, fileName), `cvDownloadCount` (number, default 0), `enableContactForm` (boolean, default true), `emailNotifications` (boolean, default true), `notificationEmail`, `maintenanceMode` (boolean, default false)

### Files / Modules

```
backend/src/models/Settings.ts
```

### Acceptance Criteria

- [x] Model matches PRD Section 11.15

### Definition of Done

- [x] Model file created

---

# Phase 3 — Authentication & Authorization

---

## AUTH-001 Create JWT Token Utility

- Status: DONE
- Priority: P0
- Phase: Phase 3
- Dependencies:
  - BACKEND-001
  - DB-002

### Objective

Create a JWT utility module for generating and verifying access and refresh tokens per PRD Section 10.2.

### Requirements

- `generateAccessToken(userId, role)` → JWT signed with `JWT_SECRET`, expiry from config (default 15m)
- `generateRefreshToken(userId)` → JWT signed with `JWT_REFRESH_SECRET`, expiry from config (default 7d)
- `verifyAccessToken(token)` → decoded payload or throws
- `verifyRefreshToken(token)` → decoded payload or throws
- Access token payload: `{ userId, role, iat, exp }`
- Refresh token payload: `{ userId, iat, exp }`

### Files / Modules

```
backend/src/utils/jwt.ts
```

### Implementation Steps

1. Create `src/utils/jwt.ts`.
2. Import `jsonwebtoken` and config.
3. Implement `generateAccessToken(userId: string, role: string): string`.
4. Implement `generateRefreshToken(userId: string): string`.
5. Implement `verifyAccessToken(token: string): JwtPayload`.
6. Implement `verifyRefreshToken(token: string): JwtPayload`.
7. Define and export `JwtPayload` interface.

### Technical Notes

- Access and refresh tokens use DIFFERENT secrets per PRD Section 10.2
- Token expiration configured via environment (default: `15m` access, `7d` refresh)
- `jsonwebtoken` throws `JsonWebTokenError` and `TokenExpiredError` — these are caught by the error handler

### Testing

- Generated access token can be verified
- Generated refresh token can be verified
- Expired token throws appropriate error
- Invalid token throws appropriate error
- Access token cannot be verified with refresh secret (and vice versa)

### Acceptance Criteria

- [x] Access token generation and verification work
- [x] Refresh token generation and verification work
- [x] Different secrets used for access and refresh
- [x] Expired tokens throw errors

### Definition of Done

- [x] JWT utility created and exported
- [x] Functions tested with valid and invalid inputs

---

## AUTH-002 Create Auth Service

- Status: DONE
- Priority: P0
- Phase: Phase 3
- Dependencies:
  - AUTH-001
  - DB-002

### Objective

Create the authentication service with business logic for login, logout, token refresh, and current user retrieval per PRD Sections 10.1–10.3.

### Requirements

- `login(email, password)` → validate credentials, generate tokens, update lastLogin
- `refreshToken(token)` → verify refresh token, generate new access token
- `logout()` → clear refresh token cookie (handled in controller)
- `getCurrentUser(userId)` → return user without password
- `changePassword(userId, currentPassword, newPassword)` → validate and update

### Files / Modules

```
backend/src/services/auth.service.ts
```

### Implementation Steps

1. Create `src/services/auth.service.ts`.
2. **`login(email, password)`**:
   - Find user by email (include password in select)
   - If not found or inactive: throw `UnauthorizedError("Invalid email or password")`
   - Compare password using `user.comparePassword()`
   - If mismatch: throw `UnauthorizedError("Invalid email or password")`
   - Generate access token and refresh token
   - Update `user.lastLogin = new Date()`
   - Return `{ user: (without password), accessToken, refreshToken }`
3. **`refreshAccessToken(refreshToken)`**:
   - Verify refresh token using `verifyRefreshToken()`
   - Find user by `userId` from payload
   - If not found or inactive: throw `UnauthorizedError`
   - Generate new access token
   - Return `{ accessToken }`
4. **`getCurrentUser(userId)`**:
   - Find user by ID, exclude password
   - If not found: throw `NotFoundError`
   - Return user
5. **`changePassword(userId, currentPassword, newPassword)`**:
   - Find user by ID (include password)
   - Compare current password
   - If mismatch: throw `UnauthorizedError("Current password is incorrect")`
   - Set new password, save (pre-save hook will hash)

### Technical Notes

- Never return password field in any response
- The refresh token cookie is set in the controller, not the service
- Login should return the same error for invalid email OR invalid password (security: don't reveal which is wrong)

### Testing

- Login with valid credentials returns tokens
- Login with invalid email throws Unauthorized
- Login with invalid password throws Unauthorized
- Refresh with valid token returns new access token
- Refresh with invalid token throws Unauthorized

### Acceptance Criteria

- [x] Login returns access token and refresh token
- [x] Invalid credentials throw UnauthorizedError
- [x] Token refresh generates new access token
- [x] Password not included in user data

### Definition of Done

- [x] Auth service created with all methods
- [x] Service compiles and methods are callable

---

## AUTH-003 Create Auth Validators

- Status: DONE
- Priority: P0
- Phase: Phase 3
- Dependencies:
  - BACKEND-006

### Objective

Create express-validator validation chains for auth endpoints.

### Requirements

- Login validation: `email` (required, valid email), `password` (required, min 1 char)
- Change password validation: `currentPassword` (required), `newPassword` (required, min 8 chars)

### Files / Modules

```
backend/src/validators/auth.validator.ts
```

### Implementation Steps

1. Create `src/validators/auth.validator.ts`.
2. Export `loginValidator` — array of `body()` validation chains for email and password.
3. Export `changePasswordValidator` — array of validation chains for currentPassword and newPassword.

### Acceptance Criteria

- [x] Login validator checks email format and password presence
- [x] Change password validator enforces min 8 chars for new password

### Definition of Done

- [x] Validator file created and exported

---

## AUTH-004 Create Auth Controller and Routes

- Status: DONE
- Priority: P0
- Phase: Phase 3
- Dependencies:
  - AUTH-002
  - AUTH-003

### Objective

Create the auth controller and routes for all authentication endpoints per PRD Section 12.1.

### Requirements

- `POST /api/v1/auth/login` — login, set refresh token cookie, return access token
- `POST /api/v1/auth/logout` — clear refresh token cookie
- `POST /api/v1/auth/refresh` — read refresh token from cookie, return new access token
- `GET /api/v1/auth/me` — return current user (requires auth)
- `PATCH /api/v1/auth/change-password` — change password (requires auth)

### Files / Modules

```
backend/src/controllers/auth.controller.ts
backend/src/routes/auth.routes.ts
backend/src/routes/index.ts (modify — mount auth routes)
```

### Implementation Steps

1. Create `src/controllers/auth.controller.ts` with handlers for each endpoint.
2. **Login handler**:
   - Call `authService.login(email, password)`
   - Set refresh token as HTTP-only cookie: `httpOnly: true, secure: NODE_ENV === 'production', sameSite: 'strict', path: '/api/v1/auth', maxAge: 7 * 24 * 60 * 60 * 1000`
   - Return: `{ success: true, data: { user, accessToken }, message: "Login successful" }`
3. **Logout handler**:
   - Clear refresh token cookie
   - Return: `{ success: true, data: null, message: "Logged out successfully" }`
4. **Refresh handler**:
   - Read `refreshToken` from `req.cookies`
   - Call `authService.refreshAccessToken(refreshToken)`
   - Return: `{ success: true, data: { accessToken }, message: "Token refreshed" }`
5. **Me handler**:
   - Call `authService.getCurrentUser(req.user.userId)`
   - Return user data
6. **Change password handler**: Call service method, return success.
7. Create `src/routes/auth.routes.ts` — define routes with validators and middleware.
8. Mount auth routes in `src/routes/index.ts` at `/auth`.

### Technical Notes

- Refresh token cookie path restricted to `/api/v1/auth` so it's only sent with auth requests
- Need `cookie-parser` middleware — install and add to `app.ts`
- Login and refresh endpoints do NOT require authentication
- Me and change-password endpoints require authentication

### Testing

- POST /api/v1/auth/login with valid creds → 200 + token + cookie
- POST /api/v1/auth/login with invalid creds → 401
- POST /api/v1/auth/refresh with valid cookie → 200 + new token
- GET /api/v1/auth/me with valid token → 200 + user
- GET /api/v1/auth/me without token → 401

### Acceptance Criteria

- [x] All 5 auth endpoints working per PRD Section 12.1
- [x] Refresh token set as HTTP-only cookie
- [x] Login rate limiting applied (5 per 15 min)
- [x] Me and change-password require authentication
- [x] cookie-parser added to Express

### Definition of Done

- [x] Controller and routes created
- [x] Auth routes mounted and accessible
- [x] Cookie handling works

---

## AUTH-005 Create Authentication and Authorization Middleware

- Status: DONE
- Priority: P0
- Phase: Phase 3
- Dependencies:
  - AUTH-001

### Objective

Create middleware for verifying JWT access tokens and checking user roles per PRD Section 10.4.

### Requirements

- `authenticate`: Verify access token from `Authorization: Bearer <token>` header, attach user to `req.user`
- `authorize(...roles)`: Check `req.user.role` against allowed roles, return 403 if unauthorized

### Files / Modules

```
backend/src/middleware/auth.middleware.ts
```

### Implementation Steps

1. Create `src/middleware/auth.middleware.ts`.
2. **`authenticate` middleware**:
   - Extract token from `Authorization` header (Bearer scheme)
   - If missing: throw `UnauthorizedError("Access token required")`
   - Verify token using `verifyAccessToken()`
   - If invalid/expired: throw `UnauthorizedError("Invalid or expired token")`
   - Set `req.user = { userId: payload.userId, role: payload.role }`
   - Call `next()`
3. **`authorize(...roles)` middleware factory**:
   - Return middleware that checks `req.user.role` against allowed roles
   - If not in roles: throw `ForbiddenError("Insufficient permissions")`
   - If in roles: call `next()`

### Technical Notes

- `authenticate` must be applied BEFORE `authorize` in the middleware chain
- Token format: `Authorization: Bearer eyJhbGci...`
- For V1, only `admin` role exists, but the middleware should support multiple roles for future extensibility

### Acceptance Criteria

- [x] `authenticate` extracts and verifies token
- [x] `authenticate` sets `req.user`
- [x] `authorize('admin')` allows admin users
- [x] Missing token → 401
- [x] Wrong role → 403

### Definition of Done

- [x] Auth middleware created and exported

---

## AUTH-006 Create Admin Seed Script

- Status: DONE
- Priority: P0
- Phase: Phase 3
- Dependencies:
  - DB-002

### Objective

Create a seed script that creates the initial admin user per PRD Section 38.1.

### Requirements

- Creates admin user with: email `admin@portfolio.dev`, password `Admin@123456`, fullName `Portfolio Admin`, role `admin`
- Password hashed via User model's pre-save hook
- Script connects to DB, inserts user, disconnects
- Idempotent: skips if admin already exists
- `npm run seed` command works

### Files / Modules

```
backend/seeds/seed.ts
backend/package.json (verify seed script)
```

### Implementation Steps

1. Create `backend/seeds/seed.ts`.
2. Import database connection and User model.
3. Connect to MongoDB.
4. Check if admin user exists by email.
5. If not: create admin user (password will be hashed by pre-save hook).
6. Log result (created or skipped).
7. Disconnect and exit.

### Technical Notes

- PRD Section 38.1 WARNING: "Change the password immediately in production"
- Do NOT log the password
- The seed script will be expanded in Phase 6 with more data

### Testing

- `npm run seed` creates admin user
- Running again skips (idempotent)
- Admin can log in via auth endpoint with seeded credentials

### Acceptance Criteria

- [x] `npm run seed` creates admin user
- [x] Password is hashed in database
- [x] Running twice doesn't create duplicates
- [x] Admin can log in with seeded credentials

### Definition of Done

- [x] Seed script created and working
- [x] Admin login verified

---

# Phase 4 — Core Admin API (CRUD)

---

## API-001 Create Cloudinary Configuration and Service

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - BACKEND-001

### Objective

Configure Cloudinary SDK and create a service for file upload and deletion per PRD Sections 6.4 and 17.

### Requirements

- Cloudinary SDK configured with credentials from environment
- Upload function: accepts file buffer, returns `{ url, publicId, width, height }`
- Delete function: accepts publicId, removes from Cloudinary
- Support for image and PDF uploads
- Folder organization in Cloudinary

### Files / Modules

```
backend/src/config/cloudinary.ts
backend/src/services/cloudinary.service.ts
```

### Implementation Steps

1. Create `src/config/cloudinary.ts` — configure Cloudinary SDK with `cloud_name`, `api_key`, `api_secret` from env.
2. Create `src/services/cloudinary.service.ts`:
   - `uploadImage(fileBuffer, folder)` → upload with `resource_type: 'image'`, `folder`, `transformation: [{ quality: 'auto', fetch_format: 'auto' }]`
   - `uploadPdf(fileBuffer, folder)` → upload with `resource_type: 'raw'`, `folder`
   - `deleteFile(publicId)` → `cloudinary.uploader.destroy(publicId)`
   - Return `{ url, publicId, width, height, format, bytes }`

### Technical Notes

- Use buffer upload (from Multer memory storage), not file path upload
- Cloudinary auto-optimization: `f_auto`, `q_auto` per PRD Section 17.4
- Folder structure suggestion: `portfolio/projects`, `portfolio/blog`, `portfolio/profile`, `portfolio/media`, `portfolio/cv`

### Acceptance Criteria

- [x] Cloudinary configured with env credentials
- [x] Image upload returns URL and publicId
- [x] PDF upload works
- [x] Delete removes file from Cloudinary

### Definition of Done

- [x] Config and service created
- [x] Upload and delete functions work

---

## API-002 Create Upload Middleware

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-001

### Objective

Create Multer middleware for handling file uploads per PRD Section 17.

### Requirements

- Memory storage (buffer, not disk)
- File size limits: 5MB for images, 10MB for PDFs
- MIME type filtering: images (jpeg, jpg, png, webp), documents (pdf)
- Multiple middleware variants: single image, multiple images, single PDF

### Files / Modules

```
backend/src/middleware/upload.middleware.ts
```

### Implementation Steps

1. Create `src/middleware/upload.middleware.ts`.
2. Configure Multer with memory storage.
3. Create file filter that validates MIME types.
4. Export:
   - `uploadSingleImage` — single file, field name `image`, 5MB limit
   - `uploadMultipleImages` — array of files, field name `images`, max 10, 5MB each
   - `uploadPdf` — single file, field name `file`, 10MB limit

### Technical Notes

- PRD Section 17.5: "Validate MIME type on both frontend and backend"
- Multer errors should be caught and transformed to `ValidationError`

### Acceptance Criteria

- [x] Image upload accepts jpg/png/webp under 5MB
- [x] PDF upload accepts pdf under 10MB
- [x] Rejects unsupported MIME types
- [x] Rejects files over size limit

### Definition of Done

- [x] Upload middleware created with multiple variants

---

## API-003 Create Admin Route Infrastructure

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - AUTH-005
  - BACKEND-009

### Objective

Create the admin route index that applies authentication and authorization middleware to all admin routes.

### Requirements

- All admin routes require `authenticate` + `authorize('admin')` middleware
- Admin routes mounted at `/api/v1/admin`
- Clean route organization per PRD Section 32

### Files / Modules

```
backend/src/routes/admin/index.ts
backend/src/routes/index.ts (modify — mount admin routes)
```

### Implementation Steps

1. Create `src/routes/admin/index.ts`.
2. Create Express Router.
3. Apply `authenticate` and `authorize('admin')` middleware to all routes.
4. Add mounting points for each admin resource (to be created in subsequent tasks).
5. Mount admin routes in `src/routes/index.ts` at `/admin`.

### Acceptance Criteria

- [x] Admin routes require authentication
- [x] Unauthenticated request returns 401
- [x] Non-admin role returns 403
- [x] Routes mounted at `/api/v1/admin`

### Definition of Done

- [x] Admin route index created and mounted

---

## API-004 Create Category CRUD (Service, Controller, Validator, Routes)

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-004

### Objective

Implement complete CRUD for Categories per PRD Section 12.3 (Admin — Categories). Categories are the simplest CRUD resource and establish the pattern for all subsequent resources.

### Requirements

- `GET /api/v1/admin/categories` — list all categories
- `POST /api/v1/admin/categories` — create category
- `PATCH /api/v1/admin/categories/:id` — update category
- `DELETE /api/v1/admin/categories/:id` — delete category (only if unused)
- Validation: `name.en` required, `type` required (enum), slug auto-generated
- Delete check: reject if category referenced by projects or blog posts

### Files / Modules

```
backend/src/validators/category.validator.ts
backend/src/services/category.service.ts
backend/src/controllers/admin/category.controller.ts
backend/src/routes/admin/category.routes.ts
backend/src/routes/admin/index.ts (modify — mount category routes)
```

### Implementation Steps

1. Create validator with validation chains for create and update.
2. Create service with: `getAll()`, `create(data)`, `update(id, data)`, `delete(id)`.
3. Delete: Check for references in Project and BlogPost collections before allowing.
4. Create controller with handlers using `catchAsync` wrapper.
5. Create routes file and mount in admin index.

### Technical Notes

- This is the FIRST CRUD resource implemented — it establishes the pattern for all others
- Slug auto-generated from `name.en`
- Delete must check: `Project.countDocuments({ category: id })` and `BlogPost.countDocuments({ category: id })`

### Testing

- GET returns all categories
- POST creates a category and returns 201
- PATCH updates a category
- DELETE removes a category
- DELETE fails with 409 if category is in use
- Validation rejects invalid data

### Acceptance Criteria

- [x] All 4 CRUD operations work
- [x] Validation on create and update
- [x] Delete protection for referenced categories
- [x] Correct response format per PRD Section 13

### Definition of Done

- [x] All files created
- [x] Endpoints return correct data

---

## API-005 Create Project CRUD (Service, Controller, Validator, Routes)

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - API-001
  - API-002
  - DB-005

### Objective

Implement complete CRUD for Projects per PRD Sections 9.4 and 12.3 (Admin — Projects), including image upload to Cloudinary.

### Requirements

- `GET /api/v1/admin/projects` — list all projects (including drafts), with pagination, search, filter
- `GET /api/v1/admin/projects/:id` — get project by ID
- `POST /api/v1/admin/projects` — create project with image upload
- `PATCH /api/v1/admin/projects/:id` — update project
- `DELETE /api/v1/admin/projects/:id` — delete project (and its Cloudinary images)
- Validation per PRD Section 9.4 form fields
- Image upload: `mainImage` (single), `screenshots` (multiple)

### Files / Modules

```
backend/src/validators/project.validator.ts
backend/src/services/project.service.ts
backend/src/controllers/admin/project.controller.ts
backend/src/routes/admin/project.routes.ts
```

### Implementation Steps

1. Create validator: title.en required, technologies required (array), category required (ObjectId), status enum.
2. Create service: `getAll(query)`, `getById(id)`, `create(data, files)`, `update(id, data, files)`, `delete(id)`.
3. Service create/update: Upload images to Cloudinary, store URLs in document.
4. Service delete: Delete associated Cloudinary images before removing document.
5. Create controller with file upload middleware.
6. Create routes and mount.

### Technical Notes

- Image upload uses Multer middleware with `fields`: `[{ name: 'mainImage', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]`
- Slug auto-generated from English title if not provided
- Populate `category` on GET responses

### Acceptance Criteria

- [x] All CRUD operations work
- [x] Image upload to Cloudinary works
- [x] Slug auto-generated
- [x] Category populated in responses
- [x] Validation enforced

### Definition of Done

- [x] All files created and endpoints working

---

## API-006 Create Skill CRUD

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-006

### Objective

Implement CRUD for Skills per PRD Section 12.3.

### Files / Modules

```
backend/src/validators/skill.validator.ts
backend/src/services/skill.service.ts
backend/src/controllers/admin/skill.controller.ts
backend/src/routes/admin/skill.routes.ts
```

### Acceptance Criteria

- [x] GET, POST, PATCH, DELETE endpoints work
- [x] Validation enforced

### Definition of Done

- [x] Skill CRUD complete

---

## API-007 Create Experience CRUD

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-007

### Objective

Implement CRUD for Experiences per PRD Section 12.3.

### Files / Modules

```
backend/src/validators/experience.validator.ts
backend/src/services/experience.service.ts
backend/src/controllers/admin/experience.controller.ts
backend/src/routes/admin/experience.routes.ts
```

### Acceptance Criteria

- [x] All CRUD operations work

### Definition of Done

- [x] Experience CRUD complete

---

## API-008 Create Education CRUD

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-008

### Objective

Implement CRUD for Education per PRD Section 12.3.

### Files / Modules

```
backend/src/validators/education.validator.ts
backend/src/services/education.service.ts
backend/src/controllers/admin/education.controller.ts
backend/src/routes/admin/education.routes.ts
```

### Acceptance Criteria

- [x] All CRUD operations work

### Definition of Done

- [x] Education CRUD complete

---

## API-009 Create Certification CRUD

- Status: DONE
- Priority: P1
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-009

### Objective

Implement CRUD for Certifications per PRD Section 12.3.

### Files / Modules

```
backend/src/validators/certification.validator.ts
backend/src/services/certification.service.ts
backend/src/controllers/admin/certification.controller.ts
backend/src/routes/admin/certification.routes.ts
```

### Acceptance Criteria

- [x] All CRUD operations work

### Definition of Done

- [x] Certification CRUD complete

---

## API-010 Create BlogPost Admin CRUD

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - API-001
  - DB-010

### Objective

Implement admin CRUD for Blog Posts per PRD Section 12.3, including publish/unpublish endpoints.

### Requirements

- Standard CRUD: GET list, GET by ID, POST, PATCH, DELETE
- Additional: `PATCH /:id/publish` and `PATCH /:id/unpublish`
- Cover image upload to Cloudinary
- Markdown content stored as bilingual strings

### Files / Modules

```
backend/src/validators/blog.validator.ts
backend/src/services/blog.service.ts
backend/src/controllers/admin/blog.controller.ts
backend/src/routes/admin/blog.routes.ts
```

### Implementation Steps

1. Standard CRUD pattern (same as projects).
2. Add `publish` endpoint: set `status: 'published'`, set `publishedAt: new Date()` if not already set.
3. Add `unpublish` endpoint: set `status: 'draft'`.
4. Cover image upload via Multer single image.
5. Populate `category` and `author` on responses.

### Acceptance Criteria

- [x] Standard CRUD works
- [x] Publish/unpublish endpoints work
- [x] `publishedAt` set on first publish
- [x] Cover image upload works

### Definition of Done

- [x] Blog admin CRUD complete with publish/unpublish

---

## API-011 Create Message Management Endpoints

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-011

### Objective

Implement admin message management per PRD Section 12.3 (Admin — Messages).

### Requirements

- `GET /api/v1/admin/messages` — list with filters (isRead, isArchived)
- `GET /api/v1/admin/messages/:id` — detail
- `PATCH /api/v1/admin/messages/:id/read` — mark as read (set `readAt`)
- `PATCH /api/v1/admin/messages/:id/unread` — mark as unread
- `PATCH /api/v1/admin/messages/:id/archive` — archive
- `DELETE /api/v1/admin/messages/:id` — delete

### Files / Modules

```
backend/src/services/message.service.ts
backend/src/controllers/admin/message.controller.ts
backend/src/routes/admin/message.routes.ts
backend/src/validators/message.validator.ts
```

### Acceptance Criteria

- [x] All message endpoints work
- [x] Read/unread toggle works
- [x] Archive works

### Definition of Done

- [x] Message management complete

---

## API-012 Create Profile Management Endpoints

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - API-001
  - DB-003

### Objective

Implement admin profile management per PRD Section 12.3: GET and PUT (upsert) with image upload.

### Requirements

- `GET /api/v1/admin/profile` — get current profile
- `PUT /api/v1/admin/profile` — update/create profile (upsert)
- Image uploads: `profileImage`, `aboutImage`

### Files / Modules

```
backend/src/validators/profile.validator.ts
backend/src/services/profile.service.ts
backend/src/controllers/admin/profile.controller.ts
backend/src/routes/admin/profile.routes.ts
backend/src/middleware/upload.middleware.ts
```

### Acceptance Criteria

- [x] GET returns profile
- [x] PUT upserts profile
- [x] Image upload works

### Definition of Done

- [x] Profile endpoints complete

---

## API-013 Create Social Link CRUD

- Status: DONE
- Priority: P1
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-013

### Objective

Implement CRUD + reorder for Social Links per PRD Section 12.3.

### Requirements

- Standard CRUD + `PATCH /reorder` endpoint

### Files / Modules

```
backend/src/validators/socialLink.validator.ts
backend/src/services/socialLink.service.ts
backend/src/controllers/admin/socialLink.controller.ts
backend/src/routes/admin/socialLink.routes.ts
```

### Acceptance Criteria

- [x] CRUD + reorder works

### Definition of Done

- [x] Social link endpoints complete

---

## API-014 Create Settings Management Endpoints

- Status: DONE
- Priority: P1
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-014

### Objective

Implement settings GET and PUT (upsert) per PRD Section 12.3.

### Files / Modules

```
backend/src/validators/settings.validator.ts
backend/src/services/settings.service.ts
backend/src/controllers/admin/settings.controller.ts
backend/src/routes/admin/settings.routes.ts
```

### Acceptance Criteria

- [x] GET and PUT work (singleton upsert)

### Definition of Done

- [x] Settings endpoints complete

---

## API-015 Create Dashboard Stats Endpoint

- Status: DONE
- Priority: P0
- Phase: Phase 4
- Dependencies:
  - API-003
  - DB-005
  - DB-010
  - DB-011

### Objective

Implement dashboard statistics endpoint per PRD Section 9.2.

### Requirements

- `GET /api/v1/admin/dashboard/stats` — returns counts for all major collections
- Stats: total projects, published projects, draft projects, total blog posts, published posts, unread messages, total skills, experience entries, CV downloads

### Files / Modules

```
backend/src/services/dashboard.service.ts
backend/src/controllers/admin/dashboard.controller.ts
backend/src/routes/admin/dashboard.routes.ts
```

### Acceptance Criteria

- [x] Stats endpoint returns correct counts
- [x] Requires authentication

### Definition of Done

- [x] Dashboard stats endpoint working

---

## API-016 Create Media and CV Management Endpoints

- Status: DONE
- Priority: P1
- Phase: Phase 4
- Dependencies:
  - API-003
  - API-001
  - API-002
  - DB-012
  - DB-014

### Objective

Implement media library and CV upload/delete endpoints per PRD Section 12.3.

### Requirements

- Media: `GET /admin/media`, `POST /admin/media/upload`, `DELETE /admin/media/:id`
- CV: `POST /admin/cv/upload` (PDF), `DELETE /admin/cv`

### Files / Modules

```
backend/src/services/media.service.ts
backend/src/controllers/admin/media.controller.ts
backend/src/routes/admin/media.routes.ts
backend/src/controllers/admin/cv.controller.ts
backend/src/routes/admin/cv.routes.ts
backend/src/validators/media.validator.ts
```

### Acceptance Criteria

- [x] Media upload/list/delete works
- [x] CV upload/delete works
- [x] Files stored in Cloudinary

### Definition of Done

- [x] Media and CV endpoints complete

---

## API-017 Configure Swagger/OpenAPI Documentation

- Status: DONE
- Priority: P1
- Phase: Phase 4
- Dependencies:
  - API-004 through API-016

### Objective

Configure Swagger/OpenAPI documentation accessible at `/api/docs` per PRD Section 6.6.

### Requirements

- `swagger-jsdoc` configured with OpenAPI 3.0 spec
- `swagger-ui-express` serving interactive docs at `/api/docs`
- Basic API info: title, version, description, servers

### Files / Modules

```
backend/src/config/swagger.ts
backend/src/app.ts (modify — mount swagger UI)
```

### Implementation Steps

1. Create `src/config/swagger.ts` with `swaggerJsdoc` options:
   - `openapi: "3.0.0"`, info block, servers array
   - `apis: ['./src/routes/**/*.ts']`
2. Mount `swagger-ui-express` at `/api/docs` in `app.ts`.
3. Add basic JSDoc swagger annotations to at least the health check and auth endpoints as examples.

### Technical Notes

- Full JSDoc annotations for all endpoints can be added incrementally
- PRD Section 6.6: Swagger UI at `/api/docs`

### Acceptance Criteria

- [x] Swagger UI accessible at `/api/docs`
- [x] Shows API info and available endpoints

### Definition of Done

- [x] Swagger configured and accessible

---

# Phase 5 — Public API

---

## PUB-001 Create Email Service

- Status: DONE
- Priority: P1
- Phase: Phase 5
- Dependencies:
  - BACKEND-001

### Objective

Create email configuration and service using Nodemailer per PRD Section 6.5.

### Requirements

- Configurable SMTP transport (Gmail for dev, Resend/SendGrid for production)
- `sendContactNotification(message)` — notify admin of new contact submission
- Graceful failure — email errors don't block API responses

### Files / Modules

```
backend/src/config/email.ts
backend/src/services/email.service.ts
```

### Acceptance Criteria

- [x] Email sends via SMTP
- [x] Failures handled gracefully (logged, not thrown)

### Definition of Done

- [x] Email service created

---

## PUB-002 Create Public API Controller and Routes

- Status: DONE
- Priority: P0
- Phase: Phase 5
- Dependencies:
  - API-004 through API-016

### Objective

Create all public read-only API endpoints per PRD Section 12.2. These serve published content only with no authentication.

### Requirements

All endpoints from PRD Section 12.2:
- `GET /api/v1/profile`
- `GET /api/v1/projects` (published only, pagination, filter, search)
- `GET /api/v1/projects/:slug` (increment viewCount)
- `GET /api/v1/skills` (visible only)
- `GET /api/v1/experiences` (sorted, type filter)
- `GET /api/v1/education` (sorted)
- `GET /api/v1/certifications` (visible, type filter)
- `GET /api/v1/blog` (published only, pagination, filter, search)
- `GET /api/v1/blog/:slug` (increment viewCount)
- `GET /api/v1/categories` (type filter)
- `GET /api/v1/social-links` (visible only)
- `GET /api/v1/settings/public` (public subset)

### Files / Modules

```
backend/src/controllers/public.controller.ts
backend/src/routes/public.routes.ts
backend/src/routes/index.ts (modify — mount public routes)
```

### Implementation Steps

1. Create `src/controllers/public.controller.ts` with a handler for each endpoint.
2. Each handler:
   - Calls the appropriate service method with public filters (`status: 'published'`, `isVisible: true`)
   - Uses pagination utility for list endpoints
   - Returns data in PRD Section 13 format
3. Project/Blog detail: Use `$inc: { viewCount: 1 }` atomic update on access.
4. Search: Case-insensitive regex on title.en, title.kh, shortDescription.en, shortDescription.kh.
5. Filter: By category slug, technology, tag.
6. Create `src/routes/public.routes.ts` — NO auth middleware.
7. Mount in `src/routes/index.ts`.

### Technical Notes

- Public endpoints MUST filter by `status: 'published'` for projects and blog posts
- Public endpoints MUST filter by `isVisible: true` for skills, certifications, social links
- Pagination format per PRD Section 13.2
- Settings public endpoint returns only: `siteTitle`, `siteDescription`, `enableCvDownload`, `enableContactForm`

### Testing

- Public endpoints return only published/visible content
- Draft content NOT returned
- Pagination works correctly
- Search filters correctly

### Acceptance Criteria

- [x] All 12 GET public endpoints functional
- [x] Only published/visible content returned
- [x] Pagination with correct totals
- [x] Search and filtering work
- [x] View counts increment

### Definition of Done

- [x] All public GET endpoints working

---

## PUB-003 Create Contact Form Endpoint

- Status: DONE
- Priority: P0
- Phase: Phase 5
- Dependencies:
  - PUB-001
  - DB-011
  - BACKEND-006

### Objective

Implement the public contact form submission endpoint per PRD Sections 8.11 and 12.2.

### Requirements

- `POST /api/v1/contact`
- Validation: name (2-100 chars), email (valid format), subject (5-200 chars), message (10-2000 chars)
- Honeypot: if `honeypot` field is non-empty, return 201 (fake success) but don't store
- Store message in `messages` collection
- Send email notification to admin (async, non-blocking)
- Rate limiting: 5 per IP per hour

### Files / Modules

```
backend/src/validators/contact.validator.ts
backend/src/routes/public.routes.ts (modify — add POST /contact)
```

### Implementation Steps

1. Create `src/validators/contact.validator.ts` with validation chains for all fields.
2. Add contact endpoint in public routes with `contactLimiter` rate limiting.
3. In controller:
   - Check honeypot field — if filled, return 201 success (but don't store)
   - Validate input
   - Create message document with `ipAddress: req.ip`
   - Send email notification asynchronously (don't await)
   - Return 201 success

### Acceptance Criteria

- [x] Valid submission stores message and returns 201
- [x] Honeypot rejects silently (returns 201 but doesn't store)
- [x] Validation returns 400 with field errors
- [x] Rate limit returns 429 after 5 submissions
- [x] Email notification sent (async)

### Definition of Done

- [x] Contact endpoint working with all protections

---

## PUB-004 Create CV Download Endpoint

- Status: DONE
- Priority: P1
- Phase: Phase 5
- Dependencies:
  - DB-014

### Objective

Implement CV download endpoint per PRD Section 8.12.

### Requirements

- `GET /api/v1/cv/download` — redirect to CV file URL, increment download counter

### Files / Modules

```
backend/src/routes/public.routes.ts (modify — add GET /cv/download)
```

### Implementation Steps

1. Find settings document, get `cvFile.url`.
2. If no CV or downloads disabled: return 404.
3. Increment `cvDownloadCount` with `$inc`.
4. Redirect to Cloudinary URL or stream the file.

### Acceptance Criteria

- [x] CV download redirects to file URL
- [x] Download counter incremented
- [x] Returns 404 if no CV available

### Definition of Done

- [x] CV download working

---

# Phase 6 — Seed Data

---

## SEED-001 Create Complete Seed Script

- Status: DONE
- Priority: P0
- Phase: Phase 6
- Dependencies:
  - AUTH-006
  - DB-003 through DB-014

### Objective

Extend the admin seed script to populate ALL collections with realistic bilingual demo data per PRD Section 38.

### Requirements

- Admin user (already from AUTH-006)
- Profile data (bilingual) per PRD Section 38.2
- Skills (10+ entries, multiple categories) per PRD Section 38.3
- Categories (6+ for projects and blog) per PRD Section 38.6
- Projects (3-5 published, bilingual) per PRD Section 38.4
- Experience (2-3 entries, bilingual)
- Education (1-2 entries, bilingual)
- Certifications (1-2 entries)
- Blog posts (2-3 with real Markdown content) per PRD Section 38.5
- Social links (GitHub, LinkedIn, Email) per PRD Section 38.6
- Settings (default values)
- Clear/reset functionality with safety check

### Files / Modules

```
backend/seeds/seed.ts (modify — extend with all collections)
```

### Implementation Steps

1. Extend seed script with seed data for each collection.
2. Add clear function: drops all collections before seeding (with confirmation in production).
3. Seed in dependency order: Users → Profile → Categories → Skills → Experience → Education → Certifications → Social Links → Settings → Projects → Blog Posts.
4. Use placeholder image URLs (e.g., `https://via.placeholder.com/800x600`) for images.
5. Blog posts should contain real Markdown with headers, code blocks, lists.
6. All bilingual content should have both English and Khmer text.
7. Add `npm run seed` verification.

### Technical Notes

- Projects reference categories — categories must be seeded first
- Blog posts reference categories and users — both must exist
- Use PRD Section 38 for specific seed data values

### Testing

- `npm run seed` populates all 13 collections
- Public API returns seeded content
- Admin can log in with seeded credentials
- Running `npm run seed` twice is idempotent (clears and reseeds)

### Acceptance Criteria

- [x] All collections populated with realistic data
- [x] Bilingual content present
- [x] Admin login works
- [x] Public API returns seeded content
- [x] Script is idempotent

### Definition of Done

- [x] Complete seed script running successfully

---

# Phase 7 — Angular Frontend Foundation

---

## FRONTEND-001 Create Global Styles and Design System

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - SETUP-004

### Objective

Create the CSS design system with custom properties for theming, typography, spacing, and component patterns per PRD Sections 16, 19, and 20.

### Requirements

- CSS custom properties for light and dark themes per PRD Section 16.2
- Typography styles with Google Fonts (Inter, Noto Sans Khmer, JetBrains Mono) per PRD Section 20.1
- CSS reset/normalize
- Spacing scale (4px base) per PRD Section 20.2
- Border radius tokens per PRD Section 20.3
- Button, card, form, and badge base styles

### Files / Modules

```
frontend/src/styles/_variables.css
frontend/src/styles/_reset.css
frontend/src/styles/_typography.css
frontend/src/styles.css (modify — import style files)
frontend/src/index.html (modify — add Google Fonts link)
```

### Implementation Steps

1. Create `src/styles/_variables.css` with all CSS custom properties from PRD Section 16.2 (light and dark).
2. Create `src/styles/_reset.css` — basic CSS reset/normalize.
3. Create `src/styles/_typography.css` — heading, body, code, and Khmer text styles.
4. Add Google Fonts link to `index.html`: Inter, Noto Sans Khmer, JetBrains Mono.
5. Import all style files in `src/styles.css` (after Tailwind directives).

### Acceptance Criteria

- [x] CSS custom properties defined for both themes
- [x] Google Fonts loading
- [x] Typography styles applied
- [x] Dark theme activates with `[data-theme="dark"]`

### Definition of Done

- [x] Design system CSS created

---

## FRONTEND-002 Create TypeScript Models and Interfaces

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - SETUP-004

### Objective

Create TypeScript interfaces matching all API response entities per PRD Section 11.

### Requirements

- Interface for each entity: User, Profile, Project, Skill, Experience, Education, Certification, BlogPost, Category, Message, Media, SocialLink, Settings
- Bilingual field type: `BilingualField = { en: string; kh: string }`
- API response types: `ApiResponse<T>`, `PaginatedResponse<T>`

### Files / Modules

```
frontend/src/app/core/models/
├── user.model.ts
├── profile.model.ts
├── project.model.ts
├── skill.model.ts
├── experience.model.ts
├── education.model.ts
├── certification.model.ts
├── blog-post.model.ts
├── category.model.ts
├── message.model.ts
├── media.model.ts
├── social-link.model.ts
├── settings.model.ts
├── api-response.model.ts
└── index.ts (barrel export)
```

### Acceptance Criteria

- [x] All entity interfaces created
- [x] Types match API response structure from PRD

### Definition of Done

- [x] Models created and exported

---

## FRONTEND-003 Create Core Services

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - FRONTEND-002
  - SETUP-004

### Objective

Create the core application services: API, Auth, Theme, Language, and Notification per Plan.md Phase 7.

### Requirements

- **ApiService**: Base HTTP methods using HttpClient with `environment.apiUrl`
- **AuthService**: Login, logout, token storage (Signal-based), user state, `isAuthenticated` computed signal
- **ThemeService**: Dark/light toggle with Signal, localStorage persistence, system preference detection
- **LanguageService**: EN/KH toggle with Signal, localStorage persistence
- **NotificationService**: Success/error toast using Angular Material Snackbar

### Files / Modules

```
frontend/src/app/core/services/
├── api.service.ts
├── auth.service.ts
├── theme.service.ts
├── language.service.ts
├── notification.service.ts
└── index.ts (barrel export)
```

### Implementation Steps

1. **ApiService**: Inject `HttpClient`. Methods: `get<T>(path)`, `post<T>(path, body)`, `put<T>(path, body)`, `patch<T>(path, body)`, `delete(path)`. All prepend `environment.apiUrl`.
2. **AuthService**: Signals for `currentUser` and `accessToken`. Methods: `login(email, password)`, `logout()`, `refreshToken()`, `getMe()`. Computed: `isAuthenticated`. Store access token in memory (signal), NOT localStorage.
3. **ThemeService**: Signal for `theme: 'light' | 'dark'`. On init: check localStorage → `prefers-color-scheme` → default light. `toggle()` sets `data-theme` on `<html>` and saves to localStorage.
4. **LanguageService**: Signal for `currentLang: 'en' | 'kh'`. `setLanguage(lang)`. Persist in localStorage.
5. **NotificationService**: Wrap Angular Material `MatSnackBar`. Methods: `success(message)`, `error(message)`, `info(message)`.

### Technical Notes

- Auth service stores access token in a Signal (memory) per PRD Section 10.2 — NOT localStorage
- Refresh token is in HTTP-only cookie — Angular doesn't access it directly
- Theme service must set `data-theme` attribute on document element

### Acceptance Criteria

- [x] All 5 services created
- [x] AuthService handles login/logout with Signals
- [x] ThemeService toggles theme and persists
- [x] Notification shows toast messages

### Definition of Done

- [x] Core services created and injectable

---

## FRONTEND-004 Create HTTP Interceptors

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - FRONTEND-003

### Objective

Create HTTP interceptors for auth token attachment and error handling per PRD Section 10.3.

### Requirements

- **AuthInterceptor**: Attach `Authorization: Bearer <token>` header to all API requests (when token exists)
- **ErrorInterceptor**: Catch 401 responses → attempt token refresh → retry original request. Handle other errors with notification service.

### Files / Modules

```
frontend/src/app/core/interceptors/auth.interceptor.ts
frontend/src/app/core/interceptors/error.interceptor.ts
frontend/src/app/core/interceptors/index.ts (barrel export)
```

### Implementation Steps

1. **AuthInterceptor**: Use functional interceptor pattern (Angular 15+). Clone request with `Authorization` header if `authService.accessToken()` exists.
2. **ErrorInterceptor**: Catch `HttpErrorResponse`:
   - 401: Call `authService.refreshToken()`. If success: retry with new token. If fail: redirect to `/admin/login`.
   - 403: Show "Insufficient permissions" notification.
   - 0 (network error): Show "Connection error" notification.
   - Other 4xx: Show error message from response.
   - 5xx: Show generic "Server error" notification.
3. Register both in `app.config.ts` via `provideHttpClient(withInterceptors([...]))`.

### Technical Notes

- Use `withCredentials: true` for requests to auth endpoints (for cookie handling)
- Token refresh must queue concurrent requests to avoid multiple refresh calls
- Functional interceptor pattern: `export const authInterceptor: HttpInterceptorFn = (req, next) => { ... }`

### Acceptance Criteria

- [x] Auth token attached to API requests
- [x] 401 triggers token refresh and retry
- [x] Failed refresh redirects to login
- [x] Error messages shown for other errors

### Definition of Done

- [x] Interceptors created and registered

---

## FRONTEND-005 Create Route Guards

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - FRONTEND-003

### Objective

Create route guards for protecting admin routes per PRD Section 10.3.

### Requirements

- **AuthGuard**: Protects `/admin/*` routes — redirects to `/admin/login` if not authenticated
- **RoleGuard**: Verifies user role (for future extensibility)
- **GuestGuard**: Prevents authenticated users from accessing guest-only routes like `/admin/login`

### Files / Modules

```
frontend/src/app/core/guards/auth.guard.ts
frontend/src/app/core/guards/role.guard.ts
frontend/src/app/core/guards/guest.guard.ts
frontend/src/app/core/guards/index.ts (barrel export)
```

### Implementation Steps

1. **AuthGuard**: Functional `CanActivateFn`. Check `authService.isAuthenticated()`. If false: attempt silent refresh, redirect to `/admin/login` with return URL if unauthenticated.
2. **RoleGuard**: Functional `CanActivateFn`. Check `authService.currentUser()?.role` against required role.
3. **GuestGuard**: Functional `CanActivateFn`. Check if user is authenticated; redirect to `/admin/dashboard` if so.

### Acceptance Criteria

- [x] Unauthenticated users redirected to login
- [x] Authenticated users can access admin routes
- [x] Role restrictions enforced
- [x] Logged-in users redirected away from login to dashboard

### Definition of Done

- [x] Guards created and unit tested

---

## FRONTEND-006 Create Shared UI Components

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - FRONTEND-001
  - FRONTEND-003

### Objective

Create reusable shared components used across public and admin pages per Plan.md Phase 7.

### Requirements

- Header (nav, theme toggle, language switcher)
- Footer (social links, copyright)
- Theme Toggle button
- Language Switcher (EN/KH toggle)
- Loading Spinner
- Skeleton Loader
- Empty State (icon + message + optional action)
- Pagination component
- Confirm Dialog (Angular Material Dialog)

### Files / Modules

```
frontend/src/app/shared/components/
├── header/
├── footer/
├── theme-toggle/
├── language-switcher/
├── loading-spinner/
├── skeleton-loader/
├── empty-state/
├── pagination/
├── confirm-dialog/
└── index.ts (barrel export)
```

### Implementation Steps

1. Create each component as a standalone Angular component using modern `@if` and `@for` control flow.
2. **Header**: Logo/site title, navigation links (Home, About, Skills, Experience, Education, Projects, Blog, Contact), theme toggle, language switcher, mobile hamburger menu.
3. **Footer**: Social links, copyright year, brief text, bilingual text, back-to-top button.
4. **Pagination**: Page numbers with ellipsis, prev/next buttons, input props: `page, totalPages, siblingCount`, output `pageChange`.
5. **Empty State**: Icon, title, description, optional action button with `actionClick` emitter.
6. **Confirm Dialog**: Title, message, confirm/cancel buttons using `MatDialog`.
7. **Loading Spinner & Skeleton Loader**: Accessible status spinner with overlay support and shimmer wave skeletons.

### Acceptance Criteria

- [x] All shared components created
- [x] Components render correctly
- [x] Header responsive with hamburger menu on mobile

### Definition of Done

- [x] All shared components created, unit tested, and functional

---

## FRONTEND-007 Create Shared Pipes

- Status: DONE
- Priority: P1
- Phase: Phase 7
- Dependencies:
  - FRONTEND-003

### Objective

Create custom pipes for template data transformation.

### Requirements

- **LocalizePipe**: Takes a bilingual field `{ en, kh }` and returns the correct language value based on current language
- **TruncatePipe**: Truncates text to specified length with ellipsis

### Files / Modules

```
frontend/src/app/shared/pipes/localize.pipe.ts
frontend/src/app/shared/pipes/truncate.pipe.ts
frontend/src/app/shared/pipes/index.ts (barrel export)
```

### Implementation Steps

1. **LocalizePipe**: Inject `LanguageService`. Impure pipe transforms `field[languageService.currentLang()] || field['en']` supporting string and string array bilingual fields.
2. **TruncatePipe**: Transform: if `value.length > limit`, return `value.slice(0, limit) + '...'` with optional word boundary snapping.

### Acceptance Criteria

- [x] LocalizePipe returns correct language text
- [x] TruncatePipe truncates with ellipsis

### Definition of Done

- [x] Pipes created and unit tested

---

## FRONTEND-008 Create Public Layout and Configure Routing

- Status: DONE
- Priority: P0
- Phase: Phase 7
- Dependencies:
  - FRONTEND-006

### Objective

Create the public layout component (header + router-outlet + footer) and configure application routing with lazy-loaded routes.

### Requirements

- Public layout wrapping all public pages
- Lazy-loaded feature routes for public and admin
- 404 wildcard route

### Files / Modules

```
frontend/src/app/features/public/public-layout/public-layout.component.ts
frontend/src/app/features/public/not-found/not-found.component.ts
frontend/src/app/app.routes.ts
frontend/src/app/app.config.ts
frontend/src/app/app.component.html
frontend/src/app/app.component.ts
```

### Implementation Steps

1. Create `PublicLayoutComponent` with header, `<router-outlet>`, and footer.
2. Configure `app.routes.ts`:
   - Public routes (lazy loaded): `''` → Home, `'about'`, `'skills'`, `'experience'`, `'education'`, `'projects'`, `'projects/:slug'`, `'blog'`, `'blog/:slug'`, `'achievements'`, `'contact'`
   - Admin routes (lazy loaded, guarded): `'admin/login'` (guarded with guestGuard) and `'admin'` (guarded with authGuard)
   - `'**'` → NotFoundComponent
3. Configure `app.config.ts` with `provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withInMemoryScrolling(...))`, `provideHttpClient(withInterceptors([...]))`, `provideAnimationsAsync()`.

### Acceptance Criteria

- [x] Public layout renders header + content + footer
- [x] Routing navigates between pages
- [x] Admin routes are lazy-loaded and guarded
- [x] 404 route works

### Definition of Done

- [x] Layout and routing configured, tested, and verified

---

# Phase 8 — Public Portfolio Pages

---

## PUBLIC-001 Create Home Page

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create the home page with all sections per PRD Section 8.1.

### Requirements

- Hero section: name, title, introduction, profile image, CTAs
- Featured projects section (3-4 cards)
- Skills overview
- Experience summary (latest 2-3)
- Education summary
- Contact CTA
- Social links

### Files / Modules

```
frontend/src/app/core/services/portfolio.service.ts
frontend/src/app/features/public/home/home.component.ts
frontend/src/app/features/public/home/home.component.html
frontend/src/app/features/public/home/home.component.css
```

### Acceptance Criteria

- [x] All PRD Section 8.1 sections present
- [x] Data fetched from API
- [x] Responsive layout

### Definition of Done

- [x] Home page created and renders API data

---

## PUBLIC-002 Create About Page

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create the About page per PRD Section 8.2.

### Files / Modules

```
frontend/src/app/features/public/about/about.component.ts
frontend/src/app/features/public/about/about.component.spec.ts
```

### Acceptance Criteria

- [x] Profile data displayed
- [x] Good typography and layout

### Definition of Done

- [x] About page complete and unit tested

---

## PUBLIC-003 Create Skills Page

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create Skills page with grouped category layout per PRD Section 8.3. No percentage bars — use badges/chips.

### Files / Modules

```
frontend/src/app/features/public/skills/skills.component.ts
frontend/src/app/features/public/skills/skills.component.spec.ts
```

### Acceptance Criteria

- [x] Skills grouped by category
- [x] Badge/chip layout (no progress bars)
- [x] Data from API

### Definition of Done

- [x] Skills page complete and unit tested

---

## PUBLIC-004 Create Experience Page

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create Experience page with timeline layout per PRD Section 8.4.

### Files / Modules

```
frontend/src/app/features/public/experience/experience.component.ts
frontend/src/app/features/public/experience/experience.component.spec.ts
```

### Acceptance Criteria

- [x] Timeline or card layout, most recent first
- [x] "Present" label for current positions
- [x] Filter by experience type and search support
- [x] Responsive visual timeline and bilingual content

### Definition of Done

- [x] Experience page complete and unit tested

---

## PUBLIC-005 Create Education Page

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create Education page per PRD Section 8.5.

### Files / Modules

```
frontend/src/app/features/public/education/education.component.ts
frontend/src/app/features/public/education/education.component.spec.ts
```

### Acceptance Criteria

- [x] Education entries displayed
- [x] Degree, institution, field, years, GPA, and extracurricular activities
- [x] Certifications & credentials section integrated
- [x] Bilingual English & Khmer localization

### Definition of Done

- [x] Education page complete and unit tested

---

## PUBLIC-006 Create Project List and Detail Pages

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create Projects list page (card grid with filter/search/pagination) and Project detail page (case study) per PRD Sections 8.6 and 8.7.

### Requirements

- List: Card grid, category filter, tech filter, search, pagination
- Detail: Full case study layout — title, hero image, meta, overview, problem, solution, features, tech stack, screenshots, challenges, lessons, links, related projects
- Markdown rendering via `marked`

### Files / Modules

```
frontend/src/app/features/public/projects/project-list.component.ts
frontend/src/app/features/public/projects/project-list.component.spec.ts
frontend/src/app/features/public/projects/project-detail.component.ts
frontend/src/app/features/public/projects/project-detail.component.spec.ts
frontend/src/app/shared/components/project-card/project-card.component.ts
frontend/src/app/shared/components/project-card/project-card.component.spec.ts
```

### Implementation Steps

1. Install `ngx-markdown` & `marked`: `npm install ngx-markdown marked`
2. Create reusable `ProjectCardComponent`.
3. Create `ProjectListComponent` with filter, search, and pagination.
4. Create `ProjectDetailComponent` with case study layout and Markdown rendering.

### Acceptance Criteria

- [x] Project grid with cards
- [x] Filtering and search work
- [x] Pagination works
- [x] Detail page renders Markdown
- [x] Related projects shown

### Definition of Done

- [x] Both pages complete and unit tested

---

## PUBLIC-007 Create Blog List and Detail Pages

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002

### Objective

Create Blog list and detail pages per PRD Sections 8.8 and 8.9, with Markdown rendering and code syntax highlighting.

### Requirements

- List: Card layout, category/tag filter, search, pagination, reading time
- Detail: Markdown to HTML rendering with code syntax highlighting, author card, related posts

### Files / Modules

```
frontend/src/app/features/public/blog/blog-list.component.ts
frontend/src/app/features/public/blog/blog-list.component.spec.ts
frontend/src/app/features/public/blog/blog-detail.component.ts
frontend/src/app/features/public/blog/blog-detail.component.spec.ts
frontend/src/app/shared/components/blog-card/blog-card.component.ts
frontend/src/app/shared/components/blog-card/blog-card.component.spec.ts
```

### Acceptance Criteria

- [x] Blog cards with reading time
- [x] Code blocks syntax highlighted
- [x] Markdown rendering works

### Definition of Done

- [x] Blog pages complete and unit tested

---

## PUBLIC-008 Create Achievements, Contact, and 404 Pages

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - FRONTEND-008
  - PUB-002
  - PUB-003

### Objective

Create remaining public pages: Achievements (PRD 8.10), Contact (PRD 8.11), and 404.

### Requirements

- **Achievements**: Cards grouped by type per PRD Section 8.10
- **Contact**: Angular Reactive Form with client-side validation per PRD Section 8.11. Fields: name, email, subject, message. Hidden honeypot field. Success/error states. Contact info display alongside form.
- **404**: Friendly not-found page with link to home

### Files / Modules

```
frontend/src/app/features/public/achievements/achievements.component.ts
frontend/src/app/features/public/achievements/achievements.component.spec.ts
frontend/src/app/features/public/contact/contact.component.ts
frontend/src/app/features/public/contact/contact.component.spec.ts
frontend/src/app/features/public/not-found/not-found.component.ts
frontend/src/app/features/public/not-found/not-found.component.spec.ts
```

### Acceptance Criteria

- [x] Contact form validates client-side
- [x] Contact form submits to API
- [x] Success/error messages displayed
- [x] Honeypot field hidden
- [x] 404 page renders for unknown routes

### Definition of Done

- [x] All 3 pages complete and unit tested

---

## PUBLIC-009 Make All Public Pages Responsive

- Status: DONE
- Priority: P0
- Phase: Phase 8
- Dependencies:
  - PUBLIC-001 through PUBLIC-008

### Objective

Ensure all public pages are responsive from 360px to 1440px+ per PRD Section 21.

### Requirements

- Test at breakpoints: 360px, 576px, 768px, 1024px, 1280px, 1440px
- Layout behaviors per PRD Section 21.2
- No horizontal scrolling on content at 360px

### Acceptance Criteria

- [x] All pages usable at 360px
- [x] Grid columns adjust per breakpoint
- [x] Navigation responsive (hamburger on mobile)

### Definition of Done

- [x] Responsive design verified at all breakpoints

---

# Phase 9 — Admin Dashboard — Layout & Auth

---

## ADMIN-001 Create Admin Login Page

- Status: DONE
- Priority: P0
- Phase: Phase 9
- Dependencies:
  - FRONTEND-003
  - FRONTEND-005

### Objective

Create the admin login page with email/password form per PRD Section 9.

### Requirements

- Email and password fields with validation
- Login button
- Error message display
- Redirect to `/admin/dashboard` on success
- Redirect unauthenticated admin routes to this page

### Files / Modules

```
frontend/src/app/features/admin/login/login.component.ts
frontend/src/app/features/admin/login/login.component.spec.ts
```

### Acceptance Criteria

- [x] Login form renders
- [x] Valid login redirects to dashboard
- [x] Invalid login shows error
- [x] Form validates required fields

### Definition of Done

- [x] Login page complete and unit tested

---

## ADMIN-002 Create Admin Layout (Sidebar, Header, Content)

- Status: DONE
- Priority: P0
- Phase: Phase 9
- Dependencies:
  - FRONTEND-006
  - FRONTEND-005

### Objective

Create the admin dashboard shell with sidebar navigation, header bar, and content area per PRD Section 9.1.

### Requirements

- Sidebar with all 15 navigation items per PRD Section 9.1 with icons
- Header with admin name, theme toggle, logout button
- Main content area with `<router-outlet>`
- Sidebar collapsible on mobile (drawer)
- Admin routing configuration (lazy loaded, guarded)

### Files / Modules

```
frontend/src/app/features/admin/layout/admin-layout/admin-layout.component.ts
frontend/src/app/features/admin/layout/admin-layout/admin-layout.component.spec.ts
frontend/src/app/features/admin/layout/admin-sidebar/admin-sidebar.component.ts
frontend/src/app/features/admin/layout/admin-sidebar/admin-sidebar.component.spec.ts
frontend/src/app/features/admin/layout/admin-header/admin-header.component.ts
frontend/src/app/features/admin/layout/admin-header/admin-header.component.spec.ts
frontend/src/app/features/admin/admin.routes.ts
```

### Acceptance Criteria

- [x] Sidebar shows all nav items with icons
- [x] Header shows admin info and logout
- [x] Content area renders child routes
- [x] Sidebar responsive (drawer on mobile)
- [x] Auth guard protects all admin routes

### Definition of Done

- [x] Admin layout shell complete and unit tested

---

## ADMIN-003 Create Admin Dashboard Overview Page

- Status: DONE
- Priority: P0
- Phase: Phase 9
- Dependencies:
  - ADMIN-002
  - API-015

### Objective

Create the dashboard overview page with statistics cards per PRD Section 9.2.

### Requirements

- Stat cards: total projects, published/draft projects, total/published blog posts, unread messages, total skills, experience entries, CV downloads
- Recent messages list (last 5 unread)
- Quick action buttons: "New Project", "New Blog Post"

### Files / Modules

```
frontend/src/app/core/models/dashboard-stats.model.ts
frontend/src/app/core/models/index.ts
frontend/src/app/core/services/portfolio.service.ts
frontend/src/app/features/admin/dashboard/dashboard.component.ts
frontend/src/app/features/admin/dashboard/dashboard.component.spec.ts
```

### Acceptance Criteria

- [x] Stats cards display real data from API
- [x] Quick action buttons navigate correctly
- [x] Recent messages list shows unread

### Definition of Done

- [x] Dashboard page complete and unit tested

---

# Phase 10 — Admin Dashboard — CRUD Sections

---

## ADMIN-004 Create Reusable Admin Components

- Status: DONE
- Priority: P0
- Phase: Phase 10
- Dependencies:
  - ADMIN-002

### Objective

Create reusable components for admin CRUD operations per Plan.md Phase 10: data table, bilingual field, image upload, and Markdown editor.

### Requirements

- **AdminDataTableComponent**: Configurable table with search, filter, sort, server-side pagination, action buttons
- **BilingualFieldComponent**: EN/KH Material Tabs wrapping form inputs
- **ImageUploadComponent**: File select, client-side validation (type/size), preview, upload
- **MarkdownEditorComponent**: Side-by-side textarea and `ngx-markdown` preview

### Files / Modules

```
frontend/src/app/features/admin/shared/
├── admin-data-table/admin-data-table.component.ts (.spec.ts)
├── bilingual-field/bilingual-field.component.ts (.spec.ts)
├── image-upload/image-upload.component.ts (.spec.ts)
├── markdown-editor/markdown-editor.component.ts (.spec.ts)
└── index.ts
```

### Acceptance Criteria

- [x] Data table supports search, pagination, and actions
- [x] Bilingual field shows EN/KH tabs
- [x] Image upload shows preview
- [x] Markdown editor shows live preview

### Definition of Done

- [x] All 4 reusable components created and unit tested

---

## ADMIN-005 Create Admin Project CRUD Pages

- Status: DONE
- Priority: P0
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-005

### Objective

Create project list and form (create/edit) pages per PRD Section 9.4.

### Requirements

- List page with data table, search, filter by status, pagination
- Form page with all fields per PRD Section 9.4
- Bilingual fields with EN/KH tabs
- Image upload for mainImage and screenshots
- Markdown editor for fullDescription, problem, solution
- Form validation
- Delete with confirmation

### Files / Modules

```
frontend/src/app/features/admin/projects/project-list/project-list.component.ts
frontend/src/app/features/admin/projects/project-list/project-list.component.spec.ts
frontend/src/app/features/admin/projects/project-form/project-form.component.ts
frontend/src/app/features/admin/projects/project-form/project-form.component.spec.ts
```

### Acceptance Criteria

- [x] Project list displays data table
- [x] Create project works end-to-end
- [x] Edit project loads existing data
- [x] Delete with confirmation
- [x] Image upload works
- [x] Validation errors shown

### Definition of Done

- [x] Project CRUD UI complete

---

## ADMIN-006 Create Admin Skill CRUD Pages

- Status: DONE
- Priority: P0
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-006

### Objective

Create skill list and form pages per PRD Section 9.5.

### Files / Modules

```
frontend/src/app/features/admin/skills/skill-list/skill-list.component.ts
frontend/src/app/features/admin/skills/skill-list/skill-list.component.spec.ts
frontend/src/app/features/admin/skills/skill-form/skill-form.component.ts
frontend/src/app/features/admin/skills/skill-form/skill-form.component.spec.ts
```

### Acceptance Criteria

- [x] Skill CRUD works end-to-end

### Definition of Done

- [x] Skill CRUD UI complete

---

## ADMIN-007 Create Admin Experience CRUD Pages

- Status: DONE
- Priority: P0
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-007

### Objective

Create experience list and form pages per PRD Section 9.6.

### Files / Modules

```
frontend/src/app/features/admin/experience/experience-list/experience-list.component.ts
frontend/src/app/features/admin/experience/experience-list/experience-list.component.spec.ts
frontend/src/app/features/admin/experience/experience-form/experience-form.component.ts
frontend/src/app/features/admin/experience/experience-form/experience-form.component.spec.ts
```

### Acceptance Criteria

- [x] Experience CRUD works end-to-end

### Definition of Done

- [x] Experience CRUD UI complete

---

## ADMIN-008 Create Admin Education CRUD Pages

- Status: DONE
- Priority: P0
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-008

### Objective

Create education list and form pages per PRD Section 9.7.

### Files / Modules

```
frontend/src/app/features/admin/education/education-list/education-list.component.ts
frontend/src/app/features/admin/education/education-list/education-list.component.spec.ts
frontend/src/app/features/admin/education/education-form/education-form.component.ts
frontend/src/app/features/admin/education/education-form/education-form.component.spec.ts
```

### Acceptance Criteria

- [x] Education CRUD works end-to-end

### Definition of Done

- [x] Education CRUD UI complete

---

## ADMIN-009 Create Admin Certification CRUD Pages

- Status: DONE
- Priority: P1
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-009

### Objective

Create certification and achievements list and form pages per PRD Section 9.8.

### Files / Modules

```
frontend/src/app/features/admin/certifications/certification-list/certification-list.component.ts
frontend/src/app/features/admin/certifications/certification-list/certification-list.component.spec.ts
frontend/src/app/features/admin/certifications/certification-form/certification-form.component.ts
frontend/src/app/features/admin/certifications/certification-form/certification-form.component.spec.ts
```

### Acceptance Criteria

- [x] Certification CRUD works end-to-end
- [x] Supports credential types (certification, award, achievement)
- [x] Bilingual name, issuer, and description
- [x] Credential ID, verification URL, issue date, expiry date, badge upload, visibility toggle, order

### Definition of Done

- [x] Certification CRUD UI complete with tests, linting, and build passed

## ADMIN-010 Create Admin Blog CRUD Pages

- Status: DONE
- Priority: P0
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-010

### Objective

Create blog list and form pages with Markdown editor per PRD Section 9.9.

### Requirements

- Markdown editor with side-by-side preview
- Publish/unpublish quick action
- Cover image upload

### Files / Modules

```
frontend/src/app/features/admin/blog/blog-list/blog-list.component.ts
frontend/src/app/features/admin/blog/blog-list/blog-list.component.spec.ts
frontend/src/app/features/admin/blog/blog-form/blog-form.component.ts
frontend/src/app/features/admin/blog/blog-form/blog-form.component.spec.ts
```

### Acceptance Criteria

- [x] Blog CRUD works with Markdown editing
- [x] Publish/unpublish works

### Definition of Done

- [x] Blog CRUD UI complete with tests, linting, and build passed

---

## ADMIN-011 Create Admin Category, Message, Profile, Social Links, Media, CV, and Settings Pages

- Status: DONE
- Priority: P0 (Categories, Messages, Profile) / P1 (others)
- Phase: Phase 10
- Dependencies:
  - ADMIN-004
  - API-004
  - API-011 through API-016

### Objective

Create all remaining admin pages per PRD Section 9.

### Requirements

- **Categories**: Inline create/edit list
- **Messages**: List with read/unread, detail view, delete
- **Profile**: Single form with bilingual fields and image upload
- **Social Links**: List with create/edit/delete, reorder
- **Media Library**: Grid view, upload, delete, copy URL
- **CV Management**: Upload PDF, view current, delete
- **Settings**: Single form

### Files / Modules

```
frontend/src/app/features/admin/categories/category-list.component.ts
frontend/src/app/features/admin/categories/category-list.component.spec.ts
frontend/src/app/features/admin/messages/message-list.component.ts
frontend/src/app/features/admin/messages/message-list.component.spec.ts
frontend/src/app/features/admin/profile/profile-form.component.ts
frontend/src/app/features/admin/profile/profile-form.component.spec.ts
frontend/src/app/features/admin/social-links/social-link-list.component.ts
frontend/src/app/features/admin/social-links/social-link-list.component.spec.ts
frontend/src/app/features/admin/media/media-list.component.ts
frontend/src/app/features/admin/media/media-list.component.spec.ts
frontend/src/app/features/admin/cv/cv-manager.component.ts
frontend/src/app/features/admin/cv/cv-manager.component.spec.ts
frontend/src/app/features/admin/settings/settings-form.component.ts
frontend/src/app/features/admin/settings/settings-form.component.spec.ts
```

### Acceptance Criteria

- [x] All remaining admin pages functional
- [x] Message read/unread toggle works
- [x] Profile upsert works
- [x] Media grid displays images

### Definition of Done

- [x] All admin sections complete with unit tests, linting, and build passed

---

# Phase 11 — Blog System (Full Stack)

---

## BLOG-001 Polish Blog Markdown Rendering and Reading Time

- Status: DONE
- Priority: P1
- Phase: Phase 11
- Dependencies:
  - PUBLIC-007
  - ADMIN-010

### Objective

Polish the blog system: ensure code syntax highlighting, reading time display, and related posts work correctly.

### Requirements

- Code blocks in blog have syntax highlighting
- Reading time shown on cards and detail
- Related posts (2-3 from same category) shown on detail page

### Files / Modules

```
backend/src/models/BlogPost.ts
frontend/src/app/features/public/blog/blog-detail.component.ts
frontend/src/app/features/public/blog/blog-detail.component.spec.ts
frontend/src/app/shared/components/blog-card/blog-card.component.ts
frontend/src/app/shared/components/blog-card/blog-card.component.spec.ts
```

### Acceptance Criteria

- [x] Code blocks syntax highlighted
- [x] Reading time displayed
- [x] Related posts shown

### Definition of Done

- [x] Blog system polished with syntax highlighting, copy-code button, reading time signals, related posts fallback, unit tests, and linting passed

---

# Phase 12 — Media & CV Management

---

## MEDIA-001 Polish Media Library and CV Download

- Status: DONE
- Priority: P1
- Phase: Phase 12
- Dependencies:
  - ADMIN-011

### Objective

Ensure media library and CV download work end-to-end.

### Requirements

- Media grid view with metadata
- Copy URL to clipboard
- CV download button on public pages
- File type filtering in media library

### Files / Modules

```
frontend/src/app/core/services/portfolio.service.ts
frontend/src/app/features/admin/media/media-list.component.ts
frontend/src/app/features/admin/media/media-list.component.spec.ts
frontend/src/app/features/admin/cv/cv-manager.component.ts
frontend/src/app/features/admin/cv/cv-manager.component.spec.ts
frontend/src/app/shared/components/header/header.component.ts
frontend/src/app/shared/components/header/header.component.spec.ts
frontend/src/app/features/public/home/home.component.ts
frontend/src/app/features/public/about/about.component.ts
```

### Acceptance Criteria

- [x] Media upload/delete/copy URL works
- [x] CV download from public pages works

### Definition of Done

- [x] Media and CV features polished with file type filtering, document preview, public header/hero CV download, unit tests, and linting passed

---

# Phase 13 — Contact System

---

## CONTACT-001 Verify Contact System End-to-End

- Status: TODO
- Priority: P0
- Phase: Phase 13
- Dependencies:
  - PUBLIC-008
  - ADMIN-011
  - PUB-003

### Objective

Verify the complete contact flow: form submission, honeypot, email notification, admin message management, unread badge.

### Requirements

- Contact form submits successfully
- Honeypot rejects bots silently
- Email notification sent to admin
- Admin can view/read/delete messages
- Unread count badge in admin sidebar

### Acceptance Criteria

- [ ] End-to-end contact flow verified
- [ ] Email sends
- [ ] Sidebar badge shows unread count

### Definition of Done

- [ ] Contact system fully functional

---

# Phase 14 — Multilingual Support (i18n)

---

## I18N-001 Configure ngx-translate and Create Translation Files

- Status: TODO
- Priority: P1
- Phase: Phase 14
- Dependencies:
  - FRONTEND-003

### Objective

Install and configure `ngx-translate` with English and Khmer translation files per PRD Section 15.

### Requirements

- `ngx-translate` installed and configured
- `assets/i18n/en.json` with all static UI labels (nav, buttons, forms, messages, errors, empty states)
- `assets/i18n/kh.json` with Khmer translations
- `translate` pipe applied to all static UI text
- `localize` pipe applied to all dynamic bilingual API content
- Language switcher persists preference

### Files / Modules

```
frontend/src/assets/i18n/en.json
frontend/src/assets/i18n/kh.json
frontend/src/app/app.config.ts (modify — add TranslateModule)
```

### Implementation Steps

1. Install: `npm install @ngx-translate/core @ngx-translate/http-loader`
2. Configure `TranslateModule` in `app.config.ts` with `HttpLoaderFactory`.
3. Create `en.json` with all UI labels organized by section (nav, hero, common, contact, admin, errors, etc.).
4. Create `kh.json` with Khmer translations.
5. Apply `| translate` pipe throughout all templates.
6. Apply `| localize` pipe to all dynamic bilingual content.
7. Verify language switcher toggles and persists.

### Acceptance Criteria

- [ ] Language switch changes all UI text
- [ ] Dynamic content shows correct language
- [ ] Preference persists in localStorage
- [ ] Fallback to English if Khmer text empty

### Definition of Done

- [ ] i18n fully implemented

---

# Phase 15 — Theme & Accessibility

---

## THEME-001 Polish Theme System and Accessibility

- Status: TODO
- Priority: P0
- Phase: Phase 15
- Dependencies:
  - FRONTEND-001
  - PUBLIC-009

### Objective

Polish dark/light theme and implement WCAG 2.2 AA accessibility per PRD Sections 16 and 22.

### Requirements

- Theme toggle works with smooth transition
- System preference detected on first visit
- Color contrast meets WCAG AA (4.5:1 text, 3:1 large)
- Semantic HTML on all pages
- `aria-label` on icon-only buttons
- Form labels and `aria-describedby` for errors
- Visible focus indicators
- Skip-to-content link
- Alt text on all images
- `prefers-reduced-motion` respected
- Keyboard navigation tested

### Acceptance Criteria

- [ ] Theme toggle smooth and persistent
- [ ] WCAG AA contrast met
- [ ] Keyboard navigable
- [ ] Screen reader friendly

### Definition of Done

- [ ] Theme and accessibility polished

---

# Phase 16 — SEO & Performance

---

## SEO-001 Implement SEO and Performance Optimizations

- Status: TODO
- Priority: P0
- Phase: Phase 16
- Dependencies:
  - PUBLIC-009

### Objective

Add SEO meta tags, Open Graph, robots.txt, and performance optimizations per PRD Sections 23 and 24.

### Requirements

- Dynamic `<title>` and `<meta description>` per route
- Open Graph metadata on project and blog detail pages
- `robots.txt` blocking `/admin` and `/api`
- Static `sitemap.xml`
- All routes lazy-loaded
- `loading="lazy"` on below-fold images
- Compression middleware on backend
- Cloudinary URLs with `f_auto,q_auto`
- Lighthouse score >= 70

### Files / Modules

```
frontend/src/app/core/services/seo.service.ts
frontend/src/robots.txt
frontend/src/sitemap.xml
```

### Acceptance Criteria

- [ ] Unique title and meta per page
- [ ] Open Graph on project/blog pages
- [ ] robots.txt blocks admin/api
- [ ] Lighthouse >= 70

### Definition of Done

- [ ] SEO and performance optimized

---

# Phase 17 — Testing & Quality

---

## TEST-001 Configure Backend Testing Infrastructure

- Status: TODO
- Priority: P0
- Phase: Phase 17
- Dependencies:
  - SETUP-002

### Objective

Configure Jest with `mongodb-memory-server` for backend testing.

### Requirements

- Jest configured for TypeScript
- `mongodb-memory-server` for isolated test database
- Test setup/teardown helpers
- Test utilities for creating authenticated requests

### Files / Modules

```
backend/jest.config.ts
backend/tests/setup.ts
backend/tests/helpers/testDb.ts
backend/tests/helpers/testAuth.ts
```

### Acceptance Criteria

- [ ] `npm test` runs successfully
- [ ] In-memory MongoDB works for tests

### Definition of Done

- [ ] Test infrastructure ready

---

## TEST-002 Write Backend Unit Tests

- Status: TODO
- Priority: P0
- Phase: Phase 17
- Dependencies:
  - TEST-001

### Objective

Write unit tests for utility functions and services.

### Requirements

- Tests for: slugify, pagination, readingTime, apiResponse
- Tests for: auth service (login logic, token generation)
- Tests for: error classes

### Files / Modules

```
backend/tests/unit/utils/slugify.test.ts
backend/tests/unit/utils/pagination.test.ts
backend/tests/unit/utils/readingTime.test.ts
backend/tests/unit/services/auth.service.test.ts
```

### Acceptance Criteria

- [ ] All utility tests pass
- [ ] Auth service tests pass

### Definition of Done

- [ ] Unit tests written and passing

---

## TEST-003 Write Backend Integration Tests

- Status: TODO
- Priority: P0
- Phase: Phase 17
- Dependencies:
  - TEST-001

### Objective

Write API integration tests using Supertest.

### Requirements

- Auth tests: login, refresh, logout, me, invalid credentials, expired tokens
- Project CRUD tests: create, read, update, delete, validation
- Contact form tests: valid submission, honeypot, rate limiting
- Public endpoint tests: only published content returned

### Files / Modules

```
backend/tests/integration/auth.test.ts
backend/tests/integration/projects.test.ts
backend/tests/integration/contact.test.ts
backend/tests/integration/public.test.ts
```

### Acceptance Criteria

- [ ] Auth flow fully tested
- [ ] CRUD operations tested
- [ ] Validation tested
- [ ] Backend coverage >= 60%

### Definition of Done

- [ ] Integration tests passing

---

## TEST-004 Write Frontend Tests

- Status: TODO
- Priority: P0
- Phase: Phase 17
- Dependencies:
  - SETUP-004

### Objective

Write Angular component and service tests.

### Requirements

- Service tests: AuthService, ThemeService
- Guard tests: AuthGuard
- Component tests: Login, Header, Contact form
- Coverage target >= 50%

### Files / Modules

```
frontend/src/app/core/services/auth.service.spec.ts
frontend/src/app/core/services/theme.service.spec.ts
frontend/src/app/core/guards/auth.guard.spec.ts
frontend/src/app/features/admin/login/login.component.spec.ts
frontend/src/app/features/public/contact/contact.component.spec.ts
```

### Acceptance Criteria

- [ ] Service tests pass
- [ ] Guard tests pass
- [ ] Component tests pass
- [ ] Frontend coverage >= 50%

### Definition of Done

- [ ] Frontend tests passing

---

# Phase 18 — Security Hardening

---

## SECURITY-001 Verify All Security Measures

- Status: TODO
- Priority: P0
- Phase: Phase 18
- Dependencies:
  - BACKEND-008
  - AUTH-004
  - PUB-003

### Objective

Verify all 17 security measures from Plan.md Section 17 are properly implemented.

### Requirements

- Verify: Helmet configured, CORS whitelist, rate limiting (auth + contact), input validation, HTML sanitization, MongoDB injection prevention, file upload restrictions, separate JWT secrets, HTTP-only secure cookies, no stack traces in production, `.env` in `.gitignore`, password min length, request body limit, no sensitive data in logs
- Run `npm audit` and fix critical/high vulnerabilities

### Acceptance Criteria

- [ ] All 17 security measures verified
- [ ] No critical npm audit vulnerabilities
- [ ] Error messages generic in production

### Definition of Done

- [ ] Security audit complete

---

# Phase 19 — Docker & CI/CD

---

## DOCKER-001 Create Production Dockerfiles

- Status: TODO
- Priority: P1
- Phase: Phase 19
- Dependencies:
  - SETUP-005

### Objective

Create production Dockerfiles for frontend and backend per PRD Section 29.

### Requirements

- Backend: Multi-stage build (build + production) per PRD Section 29.3
- Frontend: Multi-stage build (Angular build + nginx) per PRD Section 29.4
- nginx.conf for frontend static serving
- Health checks

### Files / Modules

```
backend/Dockerfile
frontend/Dockerfile
frontend/nginx.conf
docker-compose.yml (production)
```

### Acceptance Criteria

- [ ] Production Docker build succeeds
- [ ] Backend container starts and serves API
- [ ] Frontend container serves static files

### Definition of Done

- [ ] Production Docker setup complete

---

## CICD-001 Create GitHub Actions Workflows

- Status: TODO
- Priority: P1
- Phase: Phase 19
- Dependencies:
  - TEST-003
  - TEST-004

### Objective

Create CI/CD workflows per PRD Section 30.

### Requirements

- CI workflow (`.github/workflows/ci.yml`): on PR → install, lint, test, build
- Deploy workflow (`.github/workflows/deploy.yml`): on push to main → CI + deploy

### Files / Modules

```
.github/workflows/ci.yml
.github/workflows/deploy.yml
```

### Acceptance Criteria

- [ ] CI passes on PR
- [ ] Deploy triggers on push to main

### Definition of Done

- [ ] CI/CD workflows created

---

# Phase 20 — Production Deployment & Final QA

---

## DEPLOY-001 Deploy to Production

- Status: TODO
- Priority: P0
- Phase: Phase 20
- Dependencies:
  - DOCKER-001
  - CICD-001

### Objective

Deploy frontend and backend to production hosting per PRD Section 6.9.

### Requirements

- MongoDB Atlas cluster (free M0)
- Cloudinary account configured
- Backend deployed to Render/Railway
- Frontend deployed to Vercel/Netlify
- Environment variables configured
- CORS configured for production domain
- Seed data on production
- Email service configured for production
- HTTPS enabled

### Acceptance Criteria

- [ ] Portfolio accessible at production URL
- [ ] HTTPS enabled
- [ ] Admin login works
- [ ] Contact form sends emails
- [ ] No console errors

### Definition of Done

- [ ] Live and functional

---

## DOC-001 Complete Documentation

- Status: TODO
- Priority: P0
- Phase: Phase 20
- Dependencies:
  - DEPLOY-001

### Objective

Complete all project documentation per PRD Section 42.

### Requirements

- `README.md` (complete)
- `docs/SETUP.md` (local development)
- `docs/DEPLOYMENT.md` (production deployment)
- `docs/API.md` (API reference or link to Swagger)

### Files / Modules

```
README.md
docs/SETUP.md
docs/DEPLOYMENT.md
docs/API.md
```

### Acceptance Criteria

- [ ] README complete with all sections
- [ ] Setup guide tested
- [ ] Deployment guide accurate

### Definition of Done

- [ ] All docs complete

---

## QA-001 Final Quality Assurance

- Status: TODO
- Priority: P0
- Phase: Phase 20
- Dependencies:
  - DEPLOY-001

### Objective

Perform final smoke testing on the production deployment.

### Requirements

- All public pages load without errors
- Admin login and CRUD operations work
- Contact form sends email
- CV download works
- Responsive on mobile
- No console errors
- Lighthouse audit >= 70

### Acceptance Criteria

- [ ] All smoke tests pass
- [ ] Lighthouse >= 70
- [ ] No console errors in production

### Definition of Done

- [ ] Final QA passed

---

# Dependency Map

```text
SETUP-001 → SETUP-002 → SETUP-003
SETUP-001 → SETUP-004
SETUP-002 + SETUP-004 → SETUP-005, SETUP-006
              ↓
BACKEND-001 through BACKEND-009
              ↓
DB-001 → DB-002 through DB-014
              ↓
AUTH-001 → AUTH-002 → AUTH-003 → AUTH-004 → AUTH-005 → AUTH-006
              ↓
API-001 → API-002 → API-003
API-003 → API-004 through API-017
              ↓
PUB-001 → PUB-002 → PUB-003 → PUB-004
              ↓
SEED-001
              ↓
FRONTEND-001 through FRONTEND-008
              ↓
PUBLIC-001 through PUBLIC-009
              ↓
ADMIN-001 → ADMIN-002 → ADMIN-003 → ADMIN-004 → ADMIN-005 through ADMIN-011
              ↓
BLOG-001 → MEDIA-001 → CONTACT-001
              ↓
I18N-001 → THEME-001 → SEO-001
              ↓
TEST-001 → TEST-002 → TEST-003 → TEST-004
              ↓
SECURITY-001
              ↓
DOCKER-001 → CICD-001
              ↓
DEPLOY-001 → DOC-001 → QA-001
```

---

# MVP Task Set

## MVP — Required (Minimum functional portfolio)

- [x] SETUP-001, SETUP-002, SETUP-003, SETUP-004
- [x] BACKEND-001 through BACKEND-009
- [x] DB-001, DB-002, DB-003, DB-004, DB-005, DB-006, DB-007, DB-008, DB-010, DB-011
- [x] AUTH-001 through AUTH-006
- [x] API-001 through API-003, API-004, API-005, API-006, API-007, API-008, API-010, API-011, API-012, API-015
- [ ] PUB-002, PUB-003
- [ ] SEED-001
- [ ] FRONTEND-001 through FRONTEND-008
- [ ] PUBLIC-001 through PUBLIC-009
- [ ] ADMIN-001 through ADMIN-008, ADMIN-010, ADMIN-011 (partial — categories, messages, profile)
- [ ] CONTACT-001
- [ ] THEME-001 (basic dark/light)
- [ ] SEO-001 (basic titles/meta)

## Post-MVP — V1 Polish

- [x] SETUP-005, SETUP-006
- [x] DB-009, DB-012, DB-013, DB-014
- [ ] API-009, API-013, API-014, API-016, API-017
- [ ] PUB-001, PUB-004
- [ ] ADMIN-004 (reusable components refinement), ADMIN-009, ADMIN-011 (remaining sections)
- [ ] BLOG-001
- [ ] MEDIA-001
- [ ] I18N-001
- [ ] TEST-001 through TEST-004
- [ ] SECURITY-001
- [ ] DOCKER-001, CICD-001
- [ ] DEPLOY-001, DOC-001, QA-001

## Future (Post-V1)

- Angular SSR
- E2E tests (Cypress/Playwright)
- Blog comment system
- RSS feed
- Newsletter
- Google Analytics
- PWA
- Content versioning
- Advanced Markdown editor
- Automated sitemap generation

---

# Traceability Matrix

| PRD Requirement | PRD Section | Plan Phase | Task IDs | Status |
|----------------|-------------|------------|----------|--------|
| Technology Stack | 6 | 0 | SETUP-001 through SETUP-006 | TODO |
| System Architecture | 7 | 0-1 | SETUP-002, BACKEND-008, BACKEND-009 | TODO |
| Home Page | 8.1 | 8 | PUBLIC-001 | DONE |
| About Page | 8.2 | 8 | PUBLIC-002 | DONE |
| Skills Page | 8.3 | 8 | PUBLIC-003 | DONE |
| Experience Page | 8.4 | 8 | PUBLIC-004 | DONE |
| Education Page | 8.5 | 8 | PUBLIC-005 | DONE |
| Projects Page + Detail | 8.6-8.7 | 8 | PUBLIC-006 | DONE |
| Blog Page + Detail | 8.8-8.9 | 8, 11 | PUBLIC-007, BLOG-001 | DONE (Public) |
| Achievements Page | 8.10 | 8 | PUBLIC-008 | DONE |
| Contact Page | 8.11 | 8, 13 | PUBLIC-008, CONTACT-001 | DONE (Public) |
| CV Download | 8.12 | 5, 12 | PUB-004, MEDIA-001 | DONE |
| Admin Layout | 9.1 | 9 | ADMIN-002 | DONE |
| Dashboard | 9.2 | 9 | ADMIN-003 | DONE |
| CRUD Standards | 9.3 | 10 | ADMIN-004 | DONE |
| Admin Projects | 9.4 | 10 | ADMIN-005 | DONE |
| Admin Skills | 9.5 | 10 | ADMIN-006 | DONE |
| Admin Experience | 9.6 | 10 | ADMIN-007 | DONE |
| Admin Education | 9.7 | 10 | ADMIN-008 | DONE |
| Admin Certifications | 9.8 | 10 | ADMIN-009 | DONE |
| Admin Blog | 9.9 | 10 | ADMIN-010 | DONE |
| Admin Categories | 9.10 | 10 | ADMIN-011 | DONE |
| Admin Media | 9.11 | 10, 12 | ADMIN-011, MEDIA-001 | DONE |
| Admin Messages | 9.12 | 10, 13 | ADMIN-011, CONTACT-001 | DONE (Admin UI) |
| Admin CV | 9.13 | 10, 12 | ADMIN-011, MEDIA-001 | DONE |
| Admin Social Links | 9.14 | 10 | ADMIN-011 | DONE |
| Admin Profile | 9.15 | 10 | ADMIN-011 | DONE |
| Admin Settings | 9.16 | 10 | ADMIN-011 | DONE |
| Authentication | 10 | 3, 9 | AUTH-001 through AUTH-006, ADMIN-001, FRONTEND-004, FRONTEND-005 | TODO |
| Database Design | 11 | 2 | DB-001 through DB-014 | TODO |
| REST API | 12 | 4-5 | API-001 through API-017, PUB-001 through PUB-004 | TODO |
| API Response Format | 13 | 1 | BACKEND-005 | TODO |
| Error Handling | 14 | 1 | BACKEND-002, BACKEND-003 | TODO |
| Multilingual (i18n) | 15 | 14 | I18N-001 | TODO |
| Dark/Light Mode | 16 | 7, 15 | FRONTEND-001, FRONTEND-003, THEME-001 | TODO |
| File & Media Management | 17 | 4, 12 | API-001, API-002, API-016, MEDIA-001 | DONE |
| Security | 18 | 1, 3, 18 | BACKEND-006, BACKEND-008, AUTH-005, SECURITY-001 | TODO |
| UX/UI Design | 19-20 | 7, 8 | FRONTEND-001, FRONTEND-006, PUBLIC-009 | DONE (Public) |
| Responsive Design | 21 | 8 | PUBLIC-009 | DONE |
| Accessibility | 22 | 15 | THEME-001 | TODO |
| SEO | 23 | 16 | SEO-001 | TODO |
| Performance | 24 | 16 | SEO-001 | TODO |
| Analytics (counters) | 25 | 5 | PUB-002 (viewCount) | TODO |
| Logging | 26 | 1 | BACKEND-004 | TODO |
| Testing | 28 | 17 | TEST-001 through TEST-004 | TODO |
| Docker | 29 | 0, 19 | SETUP-005, DOCKER-001 | TODO |
| CI/CD | 30 | 19 | CICD-001 | TODO |
| Environment Config | 31 | 0-1 | SETUP-002, BACKEND-001 | TODO |
| Folder Structure | 32 | 0 | SETUP-001 | TODO |
| Seed Data | 38 | 6 | SEED-001 | TODO |
| Documentation | 42 | 0, 20 | SETUP-006, DOC-001 | TODO |

---

# Master Task Checklist

## Phase 0 — Project Setup
- [x] SETUP-001 Initialize Git repository
- [x] SETUP-002 Initialize backend project
- [x] SETUP-003 Create health check endpoint
- [x] SETUP-004 Initialize Angular frontend
- [x] SETUP-005 Create Docker Compose
- [x] SETUP-006 Create README.md

## Phase 1 — Backend Foundation
- [x] BACKEND-001 Environment configuration
- [x] BACKEND-002 Custom error classes
- [x] BACKEND-003 Global error handler
- [x] BACKEND-004 Logger and HTTP logging
- [x] BACKEND-005 Utility functions
- [x] BACKEND-006 Validation and rate limiting
- [x] BACKEND-007 TypeScript type definitions
- [x] BACKEND-008 CORS and security headers
- [x] BACKEND-009 Route structure

## Phase 2 — Database & Models
- [x] DB-001 MongoDB connection
- [x] DB-002 User model
- [x] DB-003 Profile model
- [x] DB-004 Category model
- [x] DB-005 Project model
- [x] DB-006 Skill model
- [x] DB-007 Experience model
- [x] DB-008 Education model
- [x] DB-009 Certification model
- [x] DB-010 BlogPost model
- [x] DB-011 Message model
- [x] DB-012 Media model
- [x] DB-013 SocialLink model
- [x] DB-014 Settings model

## Phase 3 — Authentication
- [x] AUTH-001 JWT token utility
- [x] AUTH-002 Auth service
- [x] AUTH-003 Auth validators
- [x] AUTH-004 Auth controller and routes
- [x] AUTH-005 Auth middleware
- [x] AUTH-006 Admin seed script

## Phase 4 — Admin API
- [x] API-001 Cloudinary config and service
- [x] API-002 Upload middleware
- [x] API-003 Admin route infrastructure
- [x] API-004 Category CRUD
- [x] API-005 Project CRUD
- [x] API-006 Skill CRUD
- [x] API-007 Experience CRUD
- [x] API-008 Education CRUD
- [x] API-009 Certification CRUD
- [x] API-010 Blog CRUD
- [x] API-011 Message management
- [x] API-012 Profile management
- [x] API-013 Social link CRUD
- [x] API-014 Settings management
- [x] API-015 Dashboard stats
- [x] API-016 Media and CV management
- [x] API-017 Swagger documentation

## Phase 5 — Public API
- [x] PUB-001 Email service
- [x] PUB-002 Public API endpoints
- [x] PUB-003 Contact form endpoint
- [x] PUB-004 CV download endpoint

## Phase 6 — Seed Data
- [x] SEED-001 Complete seed script

## Phase 7 — Angular Foundation
- [x] FRONTEND-001 Global styles and design system
- [x] FRONTEND-002 TypeScript models
- [x] FRONTEND-003 Core services
- [x] FRONTEND-004 HTTP interceptors
- [x] FRONTEND-005 Route guards
- [x] FRONTEND-006 Shared UI components
- [x] FRONTEND-007 Shared pipes
- [x] FRONTEND-008 Public layout and routing

## Phase 8 — Public Pages
- [x] PUBLIC-001 Home page
- [x] PUBLIC-002 About page
- [x] PUBLIC-003 Skills page
- [x] PUBLIC-004 Experience page
- [x] PUBLIC-005 Education page
- [x] PUBLIC-006 Project list and detail pages
- [x] PUBLIC-007 Blog list and detail pages
- [x] PUBLIC-008 Achievements, Contact, and 404 pages
- [x] PUBLIC-009 Responsive design verification

## Phase 9 — Admin Layout & Auth
- [x] ADMIN-001 Admin login page
- [x] ADMIN-002 Admin layout
- [x] ADMIN-003 Dashboard overview

## Phase 10 — Admin CRUD
- [x] ADMIN-004 Reusable admin components
- [x] ADMIN-005 Project CRUD pages
- [x] ADMIN-006 Skill CRUD pages
- [x] ADMIN-007 Experience CRUD pages
- [x] ADMIN-008 Education CRUD pages
- [x] ADMIN-009 Certification CRUD pages
- [x] ADMIN-010 Blog CRUD pages
- [x] ADMIN-011 Remaining admin pages

## Phase 11 — Blog System
- [x] BLOG-001 Blog polish

## Phase 12 — Media & CV
- [x] MEDIA-001 Media and CV polish

## Phase 13 — Contact System
- [ ] CONTACT-001 Contact system verification

## Phase 14 — i18n
- [ ] I18N-001 ngx-translate setup and translations

## Phase 15 — Theme & Accessibility
- [ ] THEME-001 Theme and accessibility polish

## Phase 16 — SEO & Performance
- [ ] SEO-001 SEO and performance optimization

## Phase 17 — Testing
- [ ] TEST-001 Backend test infrastructure
- [ ] TEST-002 Backend unit tests
- [ ] TEST-003 Backend integration tests
- [ ] TEST-004 Frontend tests

## Phase 18 — Security
- [ ] SECURITY-001 Security verification

## Phase 19 — Docker & CI/CD
- [ ] DOCKER-001 Production Dockerfiles
- [ ] CICD-001 GitHub Actions workflows

## Phase 20 — Deployment & QA
- [ ] DEPLOY-001 Production deployment
- [ ] DOC-001 Complete documentation
- [ ] QA-001 Final quality assurance

---

# AI Coding Agent Execution Rules

## Before Implementation

1. Read `PRD.md` before implementing features.
2. Read `Plan.md` before implementing features.
3. Read `Task.md` before selecting a task.
4. Select only tasks whose dependencies are complete (marked DONE).
5. Prefer the highest-priority (P0) incomplete task.

## During Implementation

6. Implement one focused task at a time.
7. Do not implement unrelated features.
8. Do not redesign the architecture without justification.
9. Do not silently change requirements.
10. Inspect existing code before creating new files.
11. Reuse existing services/components/utilities where appropriate.
12. Follow project coding conventions (TypeScript strict, ESLint, Prettier).
13. Follow the file/folder structure defined in PRD Section 32.
14. Follow the API response format defined in PRD Section 13.

## After Implementation

15. Run relevant tests after implementation.
16. Fix errors before marking a task DONE.
17. Update the task status: `TODO` → `DONE`.
18. Never mark a task DONE without verification.

## Problem Handling

19. If blocked, mark the task `BLOCKED` and explain why.
20. If requirements conflict, stop and report the conflict instead of guessing.
21. If information is missing, check PRD.md and Plan.md before asking.

## Security

22. Keep security requirements enabled — do not disable for convenience.
23. Do not expose secrets in code, logs, or responses.
24. Do not commit `.env` files.

## Documentation

25. Do not modify `PRD.md` unless explicitly instructed.
26. Do not modify `Plan.md` unless explicitly instructed.
27. Keep `Task.md` synchronized with implementation progress.
28. Avoid unnecessary dependencies or packages.

## Task Completion Report Format

```text
Task: TASK-ID
Status: DONE

Implemented:
- What was built

Files changed:
- List of files created or modified

Tests:
- What was tested

Verification:
- How completion was verified

Notes:
- Any important observations
```

## Blocked Task Report Format

```text
Task: TASK-ID
Status: BLOCKED

Reason:
- Why the task cannot proceed

Required action:
- What needs to happen before this task can continue
```

---

*End of Task.md*

*This document is derived from PRD.md and Plan.md. In case of conflict between documents, PRD.md takes precedence for product requirements, Plan.md takes precedence for implementation order.*
