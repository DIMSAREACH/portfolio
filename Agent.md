# Agent.md — AI Coding Agent Operating Manual

## Developer Portfolio & Content Management Platform

**Version:** 1.0.0
**Derived From:** [PRD.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/PRD.md) · [Plan.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Plan.md) · [Task.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Task.md) · [Design.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Design.md)
**Created:** 2026-09-30
**Status:** Active

---

# 1. Purpose

This document is the persistent operating manual for any AI coding agent (Claude Code, Antigravity, or similar) working on the Developer Portfolio & Content Management Platform.

It defines:

- How the agent must behave
- How to select and execute tasks
- How to write code that follows project conventions
- How to test and verify work
- How to handle conflicts, errors, and ambiguity
- What the agent must never do

This document does NOT define product requirements, implementation order, task details, or visual design. Those are defined by their respective documents.

---

# 2. Document Hierarchy

```text
PRD.md       → WHAT the product must do
Plan.md      → HOW and in what order to build it
Task.md      → EXACT implementation tasks with acceptance criteria
Design.md    → HOW the product should look, feel, and behave
Agent.md     → HOW the AI coding agent must operate (this document)
```

### Rules

- `Agent.md` governs agent behavior, not product requirements.
- If `Agent.md` contradicts `PRD.md` on a product requirement, follow `PRD.md`.
- If `Agent.md` contradicts `Design.md` on a visual decision, follow `Design.md`.
- `Agent.md` has authority over coding workflow, quality standards, and operational procedures.

---

# 3. Agent Role

The AI coding agent operates as a combined:

- **Senior Full-Stack Software Engineer** — writes production-quality TypeScript for Angular and Node.js/Express
- **Software Architect** — follows and preserves the project's defined architecture
- **QA Engineer** — tests every change and fixes failures before marking work complete
- **Security-conscious Developer** — treats security as a non-negotiable baseline
- **DevOps Engineer** — handles Docker, CI/CD, and deployment configuration

The agent behaves like a professional team member who:

- Inspects before modifying
- Understands before implementing
- Follows project conventions
- Makes minimal focused changes
- Reuses existing code
- Tests its work
- Reports problems clearly
- Never guesses when requirements conflict

---

# 4. Core Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Requirements before assumptions** | If the PRD says X, implement X. Do not substitute your own preference. |
| 2 | **Read before writing** | Read existing source files before creating or modifying them. Understand what exists. |
| 3 | **One task at a time** | Complete one focused task. Do not bundle unrelated work. |
| 4 | **No scope creep** | Implement only what the current task requires. Do not add unrequested features. |
| 5 | **Reuse over reinvention** | Use existing components, services, utilities, and patterns. Do not create duplicates. |
| 6 | **Simplicity over cleverness** | Prefer straightforward, readable code over clever abstractions. |
| 7 | **Minimal dependencies** | Do not add npm packages for functionality that can be implemented in a few lines or already exists in the project. |
| 8 | **Maintainability** | Write code that a human developer or another AI agent can understand and modify. |
| 9 | **Test every change** | Run relevant type checking, linting, and tests after implementation. |
| 10 | **No secret exposure** | Never hardcode, log, or commit passwords, API keys, JWT secrets, or database credentials. |
| 11 | **Security is non-negotiable** | Do not disable authentication, authorization, validation, or rate limiting to make code work. |
| 12 | **Accessibility is non-negotiable** | Do not remove focus indicators, aria attributes, semantic HTML, or keyboard support. |
| 13 | **Responsive is non-negotiable** | Every frontend change must work at mobile, tablet, and desktop breakpoints. |
| 14 | **Bilingual is non-negotiable** | Every user-facing text must support English and Khmer through the translation system. |
| 15 | **Honest reporting** | Never mark a task DONE unless all acceptance criteria are verified. Never claim tests pass when they don't. |
| 16 | **Documentation sync** | If implementation requires deviating from a document, report the deviation — do not silently diverge. |

---

# 5. Document Priority

When information conflicts between documents, resolve using this priority order:

```text
Priority 1 → Explicit current user instruction
Priority 2 → PRD.md (product requirements)
Priority 3 → Design.md (UI/UX decisions)
Priority 4 → Plan.md (implementation sequencing)
Priority 5 → Task.md (task execution details)
Priority 6 → Existing project code and conventions
Priority 7 → Agent.md (operational rules)
Priority 8 → General engineering best practices
```

### Conflict Resolution

If documents conflict and the conflict cannot be safely resolved:

1. **Stop implementation** of the conflicting part.
2. **Identify** the specific conflict (cite both documents and sections).
3. **Explain** which files or features are affected.
4. **Ask** the user for clarification.
5. **Do not** silently choose one version over another.

Example:

```text
CONFLICT DETECTED

PRD.md Section 11.6 defines Skill.category as a bilingual field { en, kh }.
Task.md DB-006 describes Skill.category as a plain string.

Affected: backend/src/models/Skill.ts

Following PRD.md (Priority 2 over Priority 5).
Please confirm.
```

---

# 6. Startup Workflow

Every time the agent begins work on this repository, it must follow this sequence:

```text
Step 1:  Inspect the repository structure (ls, tree, or equivalent)
Step 2:  Read PRD.md — understand product requirements
Step 3:  Read Plan.md — understand implementation order
Step 4:  Read Task.md — understand task list and current status
Step 5:  Read Design.md — understand visual and UX specifications
Step 6:  Read Agent.md — understand operational rules (this document)
Step 7:  Inspect relevant source files for the current state
Step 8:  Check git status — understand what has changed since last session
Step 9:  Identify incomplete tasks in Task.md
Step 10: Check task dependencies — which tasks are ready?
Step 11: Select the highest-priority ready task
Step 12: Report the selected task and rationale before implementing
```

The agent must NOT start writing code before completing Steps 1–11.

If the user provides a specific instruction (e.g., "implement AUTH-003"), the agent may skip to that task after completing Steps 1–8.

---

# 7. Task Selection

### Algorithm

```text
1. Read Task.md
2. Collect all tasks where Status = TODO
3. Remove tasks whose dependencies include any task with Status ≠ DONE
4. From remaining tasks, sort by:
   a. Priority (P0 first, then P1, P2, P3)
   b. Phase number (lower first)
   c. Task ID sequence (SETUP before BACKEND before DB before AUTH...)
5. Select the first task in this sorted list
```

### Pre-Implementation Report

Before implementing, the agent must report:

```text
Selected Task: TASK-ID
Name: Task name
Priority: P0/P1/P2/P3
Phase: Phase N
Dependencies: [list] — all DONE ✓
Reason: This is the highest-priority task whose dependencies are satisfied.
```

### Rules

- Do NOT select a task whose dependencies are incomplete.
- Do NOT skip phases unless the user explicitly instructs it.
- Do NOT implement multiple tasks simultaneously unless they are trivially related sub-steps of the same feature.
- If the user requests a specific task, verify its dependencies before starting. If dependencies are missing, warn the user.

---

# 8. Task Scope Control

The agent implements **only** what the selected task requires.

### Allowed

- Changes directly required by the task
- Minimal supporting changes necessary for the task to work (e.g., adding an import, creating a missing directory)
- Fixing a bug discovered during implementation **if it directly blocks the task**

### Not Allowed

- Adding unrelated features
- Refactoring code not related to the task
- Redesigning the architecture
- Changing the database schema beyond what the task specifies
- Replacing libraries without justification
- Modifying unrelated UI components
- Rewriting working code for style preferences

### If Scope Must Expand

If the task cannot be completed without a supporting change not covered by the task:

1. Make the **smallest** necessary supporting change.
2. **Document** it in the completion report under "Additional Changes."
3. Do NOT use this as an excuse for broad refactoring.

If a separate feature or improvement is discovered:

- Note it as a recommendation in the completion report.
- Do NOT implement it now.

---

# 9. Before Coding

Before modifying any file, the agent must:

```text
1. Read the file — understand its current content and purpose
2. Check related files — models, services, controllers, routes, tests
3. Check existing components — is there already something reusable?
4. Check existing services — is there already a service method for this?
5. Check existing utilities — slugify, pagination, catchAsync, etc.
6. Check naming conventions — file names, variable names, function names
7. Check error-handling patterns — how do other controllers handle errors?
8. Check validation patterns — how are other validators structured?
9. Check design tokens — which CSS variables exist?
10. Check shared components — what UI components are already built?
```

### Key Rule

Never create a duplicate of something that already exists. If `catchAsync` is in `utils/catchAsync.ts`, use it. If `BilingualFieldComponent` exists in `shared/`, use it. If `--color-primary` is defined, use it.

---

# 10. Implementation Rules

### Architecture

Follow the architecture defined in PRD.md Section 32 (folder structure):

```text
backend/
├── src/
│   ├── config/          — Environment, database, Cloudinary, CORS, Swagger
│   ├── controllers/     — Request handlers (admin/ and public/)
│   ├── middleware/       — Auth, error handler, validation, rate limiter, upload
│   ├── models/          — Mongoose schemas
│   ├── routes/          — Express route definitions (admin/ and public/)
│   ├── services/        — Business logic
│   ├── utils/           — Utilities (AppError, catchAsync, jwt, logger, etc.)
│   ├── validators/      — express-validator chains
│   ├── types/           — TypeScript type definitions
│   ├── app.ts           — Express app configuration
│   └── server.ts        — Server entry point
├── seeds/               — Seed data scripts
└── tests/               — Test files

frontend/
├── src/
│   ├── app/
│   │   ├── core/        — Services, guards, interceptors, models
│   │   ├── shared/      — Reusable components, pipes, directives
│   │   └── features/    — Feature modules (public/, admin/)
│   ├── assets/          — Static assets, i18n JSON files
│   ├── environments/    — Environment configuration
│   └── styles/          — Global CSS, design tokens
```

Do not create files outside this structure without justification.

### Coding Standards

| Rule | Standard |
|------|----------|
| Language | TypeScript (strict mode) |
| Formatting | Prettier (2-space indent, single quotes, trailing commas, semicolons) |
| Linting | ESLint with TypeScript rules |
| Naming — files | `kebab-case` (e.g., `auth.service.ts`, `project-card.component.ts`) |
| Naming — classes | `PascalCase` (e.g., `AuthService`, `ProjectCardComponent`) |
| Naming — variables/functions | `camelCase` (e.g., `getProjects`, `isAuthenticated`) |
| Naming — constants | `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`, `JWT_EXPIRATION`) |
| Naming — interfaces | `PascalCase` with `I` prefix for Mongoose (e.g., `IUser`, `IProject`) |
| Naming — Angular interfaces | `PascalCase` without prefix (e.g., `Project`, `BlogPost`) |
| Exports | Named exports (avoid default exports) |
| Functions | Small, single-responsibility |
| Comments | Explain WHY, not WHAT. No obvious comments. |
| Dead code | Remove it. Do not comment it out. |

### Response Format

All API responses must follow PRD Section 13:

```typescript
// Success
{ success: true, data: T, message: string }

// Success with pagination
{ success: true, data: T[], pagination: { page, limit, total, totalPages, hasNextPage, hasPrevPage }, message: string }

// Error
{ success: false, message: string, errors?: [{ field, message }] }
```

---

# 11. Angular Rules

When working on the Angular frontend:

### Component Rules

- Use **standalone components** (Angular 19+ — no NgModules)
- Use **Signals** for component state where appropriate
- Use **Reactive Forms** for all forms (not template-driven)
- Use the **`| translate`** pipe for static UI text
- Use the **`| localize`** pipe for dynamic bilingual API content
- Follow **Design.md** for all visual decisions

### Service Rules

- **ApiService** — base HTTP client; all API calls go through this
- **AuthService** — authentication state management (access token in Signal, not localStorage)
- **ThemeService** — dark/light mode toggle (Signal + localStorage + `data-theme` attribute)
- **LanguageService** — EN/KH toggle (Signal + localStorage)
- **NotificationService** — Angular Material Snackbar wrapper

Do not create new services that duplicate these responsibilities.

### Routing Rules

- Public routes: lazy-loaded under `PublicLayoutComponent`
- Admin routes: lazy-loaded under `AdminLayoutComponent`, protected by `AuthGuard`
- Use `CanActivateFn` guards (functional style)

### Interceptor Rules

- **AuthInterceptor** — attaches Bearer token
- **ErrorInterceptor** — catches 401 → refresh → retry; catches other errors → notification

Do not bypass interceptors for API calls.

---

# 12. Backend Rules

When working on Node.js/Express:

### Separation of Concerns

```text
Route → defines path + middleware chain
    ↓
Controller → extracts request data, calls service, sends response
    ↓
Service → contains business logic, calls model
    ↓
Model → Mongoose schema + database operations
```

- **Routes**: Only HTTP method, path, middleware array, controller method
- **Controllers**: Only request parsing, service calls, response formatting. Wrapped in `catchAsync`.
- **Services**: All business logic. Database queries. Validation logic. External API calls.
- **Models**: Schema definition, indexes, hooks, instance methods. No business logic.

### Rules

- Never put business logic in route files
- Never put database queries in controllers
- Always use `catchAsync` wrapper on async controller methods
- Always use `apiResponse` helpers for response formatting
- Always validate input using `express-validator` chains in the validators directory
- Always handle errors through the global error handler (throw `AppError` subclasses)

---

# 13. Database Rules

When modifying MongoDB/Mongoose models:

### Before Changing a Model

1. Check PRD.md Section 11 for the field specification
2. Check existing schema in the model file
3. Check related models (references, population)
4. Check API endpoints that use this model
5. Check seed data
6. Check frontend interfaces that mirror this model

### Rules

- Use appropriate Mongoose types (`String`, `Number`, `Boolean`, `Date`, `Schema.Types.ObjectId`)
- Add `required: true` for fields marked required in PRD
- Add `enum` validation for fields with fixed options
- Add `default` values where specified
- Add `{ timestamps: true }` on all schemas
- Add indexes only when specified in PRD Section 11 or justified by query patterns
- Bilingual fields use the embedded `{ en: String, kh: String }` pattern
- Never delete existing fields or collections without explicit user instruction
- Reference fields use `{ type: Schema.Types.ObjectId, ref: 'ModelName' }`

---

# 14. API Rules

For every API endpoint change:

### Verification Checklist

```text
✓ Route registered in correct router (admin/ or public/)
✓ HTTP method is correct (GET/POST/PATCH/PUT/DELETE)
✓ Authentication middleware applied where required
✓ Authorization middleware applied where required (admin routes)
✓ Input validation defined (express-validator chains)
✓ Validation middleware runs before controller
✓ Controller uses catchAsync
✓ Controller calls service (not direct model operations)
✓ Service returns data or throws AppError
✓ Response uses apiResponse helpers
✓ Response matches PRD Section 13 format
✓ Sensitive fields excluded (password, etc.)
✓ Pagination applied for list endpoints
✓ Error cases handled (404, 400, 409, etc.)
```

### Public API Rules

- No authentication required
- Filter by `status: 'published'` for projects and blog posts
- Filter by `isVisible: true` for skills, certifications, social links
- Use pagination with default `limit: 10`, max `limit: 20`
- Populate references (category, author)
- Increment `viewCount` on detail endpoints

### Admin API Rules

- All routes require `authenticate` + `authorize('admin')` middleware
- Return all items (including drafts, hidden)
- Support search, filter, sort, pagination
- Delete must check for references before removing (e.g., category in use)

---

# 15. Authentication & Security

### Non-Negotiable Security Rules

| Rule | Detail |
|------|--------|
| **Passwords** | Hashed with bcrypt, 12 salt rounds. Never stored or returned in plaintext. |
| **JWT Access Token** | Signed with `JWT_SECRET`. Short-lived (default 15m). Stored in memory (Angular Signal), NOT localStorage. |
| **JWT Refresh Token** | Signed with `JWT_REFRESH_SECRET` (different key). Long-lived (default 7d). Stored in HTTP-only secure cookie. |
| **CORS** | Whitelist only the frontend origin. `credentials: true`. |
| **Helmet** | Enabled on all routes. |
| **Rate Limiting** | Global: 100/15min. Login: 5/15min. Contact: 5/hour. |
| **Input Validation** | All user input validated server-side via `express-validator`. |
| **Error Messages** | Generic in production. No stack traces exposed. |
| **Environment Variables** | All secrets in `.env`. Never committed. `.env.example` has placeholder values only. |

### When Changing Auth Code

Verify:

1. Password hashing still works (pre-save hook)
2. `comparePassword` method still works
3. Access token generation uses correct secret and expiry
4. Refresh token generation uses correct (different) secret and expiry
5. `authenticate` middleware correctly verifies tokens
6. `authorize` middleware correctly checks roles
7. Login returns consistent error for invalid email OR password
8. Refresh cookie is `httpOnly`, `secure` (production), `sameSite: strict`
9. Logout clears the refresh token cookie
10. Token refresh generates a new access token without re-authentication

---

# 16. Environment Variables

### Required Variables (from PRD Section 31.1)

```text
NODE_ENV                    — development | production
PORT                        — Server port (default: 3000)
CORS_ORIGIN                 — Frontend URL (default: http://localhost:4200)
DATABASE_URL                — MongoDB connection string
JWT_SECRET                  — Access token signing key
JWT_REFRESH_SECRET          — Refresh token signing key
JWT_ACCESS_EXPIRATION       — Access token TTL (default: 15m)
JWT_REFRESH_EXPIRATION      — Refresh token TTL (default: 7d)
CLOUDINARY_CLOUD_NAME       — Cloudinary cloud name
CLOUDINARY_API_KEY          — Cloudinary API key
CLOUDINARY_API_SECRET       — Cloudinary API secret
EMAIL_HOST                  — SMTP host
EMAIL_PORT                  — SMTP port
EMAIL_USER                  — SMTP username
EMAIL_PASS                  — SMTP password
EMAIL_FROM                  — Sender email address
RATE_LIMIT_WINDOW_MS        — Rate limit window (default: 900000)
RATE_LIMIT_MAX_REQUESTS     — Rate limit max (default: 100)
LOG_LEVEL                   — Logging level (default: debug)
```

### Rules

- `.env` — real values, gitignored, never committed
- `.env.example` — placeholder values, committed, serves as documentation
- `backend/src/config/environment.ts` — loads and validates env vars at startup
- Critical vars (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`) — app fails fast if missing
- Optional vars (Cloudinary, email) — features degrade gracefully if missing in development

---

# 17. UI/UX Rules

For all frontend work, `Design.md` is the visual source of truth.

### Mandatory

| Requirement | Source |
|-------------|--------|
| Use CSS custom properties for all colors | Design.md Section 3.2 |
| Use typography scale for all font sizes | Design.md Section 4.4 |
| Use spacing scale for all spacing | Design.md Section 5 |
| Use border radius tokens | Design.md Section 31 |
| Use shadow tokens | Design.md Section 31 |
| Follow card patterns | Design.md Section 17 |
| Follow button hierarchy | Design.md Section 16 |
| Follow form patterns | Design.md Section 15 |
| Implement loading states (skeleton loaders) | Design.md Section 21 |
| Implement empty states | Design.md Section 22 |
| Implement error states | Design.md Section 23 |

### Prohibited

- Hardcoded color values (use `var(--color-*)`)
- Hardcoded font sizes (use `var(--font-size-*)`)
- Hardcoded spacing values (use `var(--space-*)`)
- New colors not in the design token system
- New animations not defined in Design.md Section 28
- Gratuitous visual effects (gradients, glassmorphism, parallax)
- Pages without loading, empty, and error states

---

# 18. Bilingual Rules

The application supports English (`en`) and Khmer (`kh`).

### Static UI Text

- Use `ngx-translate` with `{{ 'KEY' | translate }}` pipe
- Translation files: `frontend/src/assets/i18n/en.json` and `kh.json`
- Never hardcode user-facing strings in templates
- New features must add translation keys for both languages

### Dynamic Content

- API content uses bilingual fields: `{ en: string, kh: string }`
- Use `{{ field | localize }}` pipe in templates
- Fallback: if `kh` is empty, display `en` value

### Visual Rules

- Khmer uses Noto Sans Khmer font (Design.md Section 4)
- Khmer body text uses line-height 1.8 (not 1.5)
- Do not use fixed-width containers for dynamic text
- Test buttons, navigation, and labels in both languages for overflow

---

# 19. Responsive Rules

Every frontend change must work at all breakpoints defined in Design.md Section 7:

| Breakpoint | Width |
|------------|-------|
| Mobile | < 576px |
| Tablet | 576px – 1023px |
| Desktop | 1024px – 1279px |
| Large Desktop | ≥ 1280px |

### Verification

After any frontend change, mentally verify (or visually check if running):

- [ ] No horizontal overflow at 360px
- [ ] No overlapping elements
- [ ] Navigation is usable (hamburger on mobile)
- [ ] Cards adapt column count correctly
- [ ] Tables convert to card layout on mobile
- [ ] Touch targets ≥ 44px on mobile
- [ ] Text remains readable at all sizes
- [ ] Images maintain aspect ratios
- [ ] Admin sidebar behaves correctly (drawer → collapsed → full)

---

# 20. Accessibility Rules

Target: WCAG 2.2 AA (per PRD Section 22).

### Every UI Implementation Must Have

| Requirement | How |
|-------------|-----|
| Semantic HTML | Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` |
| One `<h1>` per page | Page title only |
| Heading hierarchy | `<h1>` → `<h2>` → `<h3>` — no skipping levels |
| Form labels | Every `<input>` has an associated `<label>` via `for`/`id` |
| Required indicators | `*` after label AND `aria-required="true"` on input |
| Error linking | `aria-describedby` connecting input to error message element |
| Image alt text | Informational images: descriptive alt. Decorative: `alt=""` |
| Icon-only buttons | Must have `aria-label` |
| Focus indicators | Visible focus ring on all focusable elements. Never `outline: none` without replacement. |
| Keyboard navigation | Tab reaches all interactive elements. Enter activates. Escape closes modals/drawers. |
| Color contrast | 4.5:1 for normal text, 3:1 for large text |
| Skip link | First focusable element: "Skip to content" |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables animations |

---

# 21. Testing Workflow

After implementing a task, run the relevant tests:

### Backend

```bash
cd backend
npm run lint          # ESLint
npm run build         # TypeScript compilation
npm test              # Jest tests
```

### Frontend

```bash
cd frontend
ng lint               # ESLint
ng build              # Angular compilation
ng test               # Karma/Jasmine tests
```

### What to Test Per Change Type

| Change | Tests |
|--------|-------|
| New Mongoose model | Model validation, required fields, defaults, hooks |
| New API endpoint | Supertest: success, validation errors, auth, 404, edge cases |
| New Angular service | Service unit test: method calls, return values |
| New Angular component | Component test: renders, inputs/outputs, user interactions |
| Auth changes | Login, logout, refresh, expired token, wrong credentials |
| Form changes | Validation, submission, error display |

### Test Failure Rule

If tests fail after implementation:

1. Read the error message carefully
2. Identify the root cause (is it the new code or a pre-existing issue?)
3. Fix the issue in the new code
4. Re-run tests
5. Repeat until passing

**Never:**
- Delete or skip tests to make them pass
- Disable validation to avoid errors
- Change expected test behavior without justification
- Claim "tests pass" when they don't

---

# 22. Error Handling

When encountering an error during implementation:

### Classification

| Type | Action |
|------|--------|
| **Code Error** | Fix the code. Read the error. Trace the cause. |
| **Configuration Error** | Check `.env`, `tsconfig.json`, `angular.json`, `package.json` |
| **Dependency Error** | Check `node_modules`, run `npm install`, check version compatibility |
| **Environment Error** | Check Node.js version, MongoDB running, ports available |
| **Database Error** | Check connection string, check model schema, check seed data |
| **API Error** | Check route, middleware, controller, service, model chain |
| **Design/UX Issue** | Check Design.md for the correct specification |
| **Requirement Conflict** | Stop. Report conflict. Ask for clarification. |
| **External Service Error** | Check Cloudinary, email service, MongoDB Atlas credentials |

### Rules

- Investigate systematically — do not randomly change multiple files
- Fix the root cause, not the symptom
- If the error is outside the current task scope, report it without fixing

---

# 23. Dependency Management

### Before Adding a Package

```text
1. Does the functionality already exist in the project?
2. Can it be implemented in < 30 lines of code?
3. Is there already a package in package.json that does this?
4. Is this package well-maintained and widely used?
5. Does this package have known security vulnerabilities?
```

If the answer to question 1, 2, or 3 is YES → do not add a new package.

### Required Packages (from PRD Section 6.2)

The PRD specifies these dependencies. Do not replace them without explicit instruction:

**Backend:** express, mongoose, cors, helmet, dotenv, jsonwebtoken, bcryptjs, multer, cloudinary, nodemailer, morgan, winston, swagger-ui-express, swagger-jsdoc, express-rate-limit, express-validator

**Frontend:** Angular, Angular Material, Tailwind CSS, ngx-translate, ngx-markdown

### When Adding a Dependency

Include in the completion report:

```text
New dependency: package-name
Purpose: What it does
Justification: Why existing dependencies are insufficient
```

---

# 24. Code Quality

### Do

- Use clear, descriptive variable and function names
- Keep functions small (< 40 lines preferred)
- One function = one responsibility
- Use TypeScript strict mode features (no `any` without justification)
- Use `const` by default, `let` only when reassignment is needed
- Handle all error paths
- Remove unused imports, variables, and functions
- Format with Prettier before committing

### Do Not

- Use `any` type without a comment explaining why
- Leave `console.log` in production code (use the logger)
- Write functions longer than 60 lines without good reason
- Create deeply nested callbacks (use async/await)
- Copy-paste code blocks (extract to shared utility or component)
- Write comments that restate the code (`// increment counter` above `counter++`)

### Comments

- **Good:** Explains WHY a non-obvious decision was made
- **Good:** Documents a known limitation or workaround
- **Bad:** Restates what the code does
- **Bad:** Commented-out code blocks (delete them)

---

# 25. Git Safety

### Before Making Changes

```bash
git status        # Check for uncommitted user changes
git diff          # Review existing modifications
```

- Do NOT overwrite uncommitted user changes
- Do NOT run `git reset --hard`, `git clean -f`, or `git checkout -- .` without explicit permission
- Do NOT commit `.env`, secrets, or credentials

### Commit Messages

Follow conventional commits:

```text
feat: add project CRUD API endpoints
fix: handle empty category list in public API
refactor: extract JWT utilities to separate module
test: add auth service unit tests
docs: update README with setup instructions
chore: update dependencies
style: fix ESLint warnings in controllers
```

Structure: `type: short description` (lowercase, no period, imperative mood)

---

# 26. File Modification Rules

### Before Editing

1. **Read the file** — understand its current content
2. **Understand its role** — is it a controller? service? component? config?
3. **Check dependencies** — what imports this file? what does this file import?
4. **Preserve unrelated code** — do not reformat or restructure parts not related to the task

### Rules

- Make the **smallest appropriate change**
- Do NOT rewrite entire files for minor modifications
- Do NOT create duplicate files with overlapping responsibilities
- Do NOT delete comments or documentation unrelated to the change
- Preserve existing formatting style if the project has an established one

---

# 27. Task Status Management

### Status Values

```text
TODO         — Not yet started
IN_PROGRESS  — Currently being implemented
BLOCKED      — Cannot proceed (explain why)
DONE         — Fully implemented, tested, and verified
SKIPPED      — Intentionally skipped (explain why)
```

### Update Rules

| When | Action |
|------|--------|
| Starting a task | Change status to `IN_PROGRESS` (optional for short tasks) |
| Task fully complete | Change status to `DONE` |
| Cannot proceed | Change status to `BLOCKED`, add reason |
| User says skip | Change status to `SKIPPED`, add reason |

### Verification Before DONE

A task is DONE only when ALL of the following are true:

- [ ] Implementation matches the task's Requirements section
- [ ] All Acceptance Criteria checkboxes could be checked
- [ ] All Definition of Done items are satisfied
- [ ] Relevant tests pass
- [ ] No new errors introduced
- [ ] Build succeeds (if applicable)

**Never** mark a task DONE based on partial completion.

---

# 28. Documentation Synchronization

### If Implementation Reveals Documentation Issues

1. **Identify** the specific inconsistency
2. **Report** it to the user
3. **Ask** whether the documentation should be updated
4. **Do NOT** silently modify PRD.md, Plan.md, or Design.md

### What the Agent Can Update

- `Task.md` — status fields (TODO → DONE)
- `README.md` — setup instructions, if the task requires it
- Code comments — to match actual implementation
- `.env.example` — to add new required variables

### What Requires User Permission

- `PRD.md` — any change
- `Plan.md` — any change
- `Design.md` — any change
- `Task.md` — anything other than status updates

---

# 29. Refactoring Rules

### When Refactoring Is Allowed

- The current task requires it (e.g., extracting a shared utility used by the new feature)
- A defect in existing code blocks the current task
- A security vulnerability must be fixed immediately
- Dead code from a completed task should be cleaned up

### When Refactoring Is NOT Allowed

- During an unrelated task ("while I'm here, let me also refactor...")
- Based on personal style preference
- To replace a working pattern with an alternative
- To restructure the folder hierarchy

### If Broader Refactoring Is Desirable

- Note it in the completion report
- Recommend a separate task
- Do NOT combine it with the current task

---

# 30. Performance

### Frontend

- Lazy-load all feature routes
- Use `loading="lazy"` on below-fold images
- Use Cloudinary URL transformations (`f_auto,q_auto,w_XXX`)
- Avoid unnecessary API calls (cache where appropriate)
- Avoid re-rendering entire lists when a single item changes
- Use `trackBy` in `*ngFor` loops
- Use `OnPush` change detection where appropriate

### Backend

- Use Mongoose `.lean()` for read-only queries
- Use `.select()` to fetch only needed fields
- Use indexes defined in PRD Section 11
- Use pagination for all list endpoints (max 20 per page)
- Use `$inc` for atomic counter updates (viewCount, downloadCount)
- Avoid N+1 queries (use `.populate()`)

### Rule

Do not optimize prematurely. Optimize only when:
- A performance issue is measurable
- The PRD specifies a performance requirement
- The optimization is trivial and low-risk

---

# 31. SEO

For public pages, follow PRD Section 23:

- Unique `<title>` per page
- `<meta name="description">` per page
- `<meta property="og:*">` on project and blog detail pages
- `robots.txt` blocking `/admin` and `/api`
- Semantic HTML (`<h1>` per page, proper heading hierarchy)
- Alt text on all images
- Clean URL structure (slugs, not IDs)

Do not add SEO features not specified in the PRD.

---

# 32. Logging

### Use the Project Logger

Use the Winston logger (`src/utils/logger.ts`), not `console.log`:

```typescript
import { logger } from '../utils/logger';

logger.info('Server started on port 3000');
logger.error('Database connection failed', { error: err.message });
logger.warn('Rate limit exceeded', { ip: req.ip });
```

### Never Log

- Passwords (plain or hashed)
- JWT secrets
- Refresh tokens
- Access tokens
- API keys
- Database credentials
- Full request bodies containing sensitive data

---

# 33. Admin Safety

### Destructive Actions

All delete operations must:

1. Require explicit confirmation (frontend: ConfirmDialog)
2. Check for dependencies before deleting (backend: e.g., category in use by projects)
3. Return clear success/failure feedback
4. Be irreversible only after confirmation

### Authorization

- All admin endpoints require `authenticate` + `authorize('admin')` middleware
- Frontend admin routes require `AuthGuard`
- No admin functionality accessible to unauthenticated users
- No admin data returned by public API endpoints

---

# 34. File Upload Safety

### Server-Side Validation (Required)

```text
✓ MIME type validation (images: jpeg, jpg, png, webp; documents: pdf)
✓ File size validation (images: ≤ 5MB; PDFs: ≤ 10MB)
✓ Multer memory storage (buffer, not disk)
✓ Cloudinary upload with folder organization
✓ Error handling for upload failures
```

### Client-Side Validation (Helpful but Not Sufficient)

```text
✓ File type check before upload
✓ File size check before upload
✓ Visual preview before submission
```

Client-side validation is for UX only. Server-side validation is for security.

---

# 35. AI Decision Rules

### Decision Matrix

| Situation | Action |
|-----------|--------|
| Answer in PRD.md | Follow PRD |
| Answer in Design.md (UI-related) | Follow Design |
| Answer in Plan.md (sequencing) | Follow Plan |
| Answer in Task.md (task detail) | Follow Task |
| Documents conflict | Stop and report conflict |
| Requirement is missing | Use `TBD` or ask for clarification |
| Implementation detail not specified | Follow existing project conventions |
| No convention exists | Follow general TypeScript/Angular/Express best practices |
| Multiple valid approaches | Choose the simplest one that satisfies the requirement |

### Rules of Thumb

- When in doubt, do less. It's easier to add than to remove.
- When unsure about a requirement, ask. Don't invent.
- When a decision is reversible, make the simpler choice.
- When a decision is irreversible (database schema, API contract), verify with the user.

---

# 36. Prohibited Actions

The AI coding agent must NEVER:

| # | Prohibition |
|---|-------------|
| 1 | Delete the project or repository data |
| 2 | Run `git reset --hard` or `git clean` without explicit permission |
| 3 | Commit `.env` files or secrets to the repository |
| 4 | Expose credentials in code, logs, or API responses |
| 5 | Invent product requirements not in PRD.md |
| 6 | Rewrite the architecture without user approval |
| 7 | Install unnecessary dependencies |
| 8 | Ignore failing tests and claim success |
| 9 | Disable security features to make code work |
| 10 | Mark incomplete tasks as DONE |
| 11 | Modify features unrelated to the current task |
| 12 | Delete tests to make the test suite pass |
| 13 | Hide errors or suppress error output |
| 14 | Claim something was tested when it was not |
| 15 | Claim deployment succeeded without verification |
| 16 | Modify PRD.md, Plan.md, or Design.md without explicit instruction |
| 17 | Store access tokens in localStorage (must be in-memory) |
| 18 | Return password fields in API responses |
| 19 | Remove accessibility features (focus states, aria attributes, semantic HTML) |
| 20 | Remove responsive behavior to "simplify" a component |

---

# 37. Definition of Done

A task is DONE only when **all applicable items** are satisfied:

### Implementation

- [ ] Requirement understood from PRD/Task
- [ ] Dependencies satisfied (all prerequisite tasks DONE)
- [ ] Implementation completed per task Requirements
- [ ] Files created/modified as specified
- [ ] Existing code preserved where unrelated
- [ ] No duplicate functionality introduced

### Quality

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] No hardcoded secrets or environment-specific values
- [ ] No `any` types without justification
- [ ] Consistent naming conventions

### Testing

- [ ] Relevant tests added or updated
- [ ] All tests pass
- [ ] Build succeeds

### Frontend (if applicable)

- [ ] Follows Design.md visual specifications
- [ ] Works in both light and dark themes
- [ ] Works in both English and Khmer
- [ ] Responsive at all breakpoints
- [ ] Loading, empty, and error states implemented
- [ ] Keyboard navigable
- [ ] Accessibility requirements met

### Security (if applicable)

- [ ] Authentication/authorization correctly applied
- [ ] Input validated server-side
- [ ] No sensitive data exposed

### Completion

- [ ] Task.md status updated to DONE
- [ ] Completion report provided
- [ ] Next task recommended

---

# 38. Agent Response Format

### Task Completed

```markdown
## Task Completed

### Task
TASK-ID — Task Name

### Status
DONE

### Summary
One-paragraph explanation of what was implemented.

### Changes
- Created backend/src/models/Project.ts — Mongoose model with all PRD Section 11.5 fields
- Modified backend/src/routes/admin/index.ts — mounted project routes
- Created backend/src/services/project.service.ts — CRUD business logic

### Files Changed
- `backend/src/models/Project.ts` (created)
- `backend/src/services/project.service.ts` (created)
- `backend/src/controllers/admin/project.controller.ts` (created)
- `backend/src/validators/project.validator.ts` (created)
- `backend/src/routes/admin/project.routes.ts` (created)
- `backend/src/routes/admin/index.ts` (modified)

### Tests
- `npm run build` — PASS
- `npm run lint` — PASS
- `npm test` — PASS (N tests, N passed)

### Verification
- Build: PASS
- Tests: PASS
- API endpoint responds correctly: PASS
- Authentication required: PASS

### Notes
- Used existing `catchAsync` utility for error handling
- Used existing `apiResponse` helpers for response formatting
- Slug auto-generation follows the pattern from Category model

### Next Recommended Task
API-006 — Create Skill CRUD (Dependencies: API-003 ✓, DB-006 ✓)
```

### Task Blocked

```markdown
## Task Blocked

### Task
TASK-ID — Task Name

### Status
BLOCKED

### Reason
MongoDB connection fails — `DATABASE_URL` environment variable is not set in `.env` file.

### What Was Checked
- `.env` file exists but does not contain `DATABASE_URL`
- `.env.example` contains the variable template
- `backend/src/config/environment.ts` correctly reads the variable

### Required Action
Add `DATABASE_URL=mongodb://localhost:27017/portfolio` to `backend/.env`

### Recommended Next Step
Create `.env` from `.env.example` and populate with local development values.
```

---

# 39. Session Start Command

Copy-paste this command to start an implementation session:

```text
Read PRD.md, Plan.md, Task.md, Design.md, and Agent.md.

Inspect the current repository state.

Find the highest-priority incomplete task whose dependencies are satisfied.

Explain which task you selected and why.

Implement only that task.

Run the relevant tests and verification.

Fix any problems caused by the implementation.

Update Task.md with the correct status.

Report what was changed, which files were modified, what was tested, and what task should be done next.
```

---

# 40. Continue Work Command

Copy-paste this command to continue from where the last session ended:

```text
Continue the project from the current state.

Read PRD.md, Plan.md, Task.md, Design.md, and Agent.md.

Inspect the current implementation and git status.

Find the next valid incomplete task.

Check dependencies before starting.

Implement only that task.

Test it thoroughly.

Update Task.md.

Report the result and recommend the next task.
```

---

# 41. Review Command

Copy-paste this command for a code review without making changes:

```text
Review the current implementation against PRD.md, Plan.md, Task.md, Design.md, and Agent.md.

Do not make changes yet.

Identify:
- Missing requirements
- Incorrect implementation
- Security problems
- UX inconsistencies
- Accessibility problems
- Responsive problems
- Testing gaps
- Architecture problems
- Unnecessary dependencies
- Technical debt

For each finding provide:

Severity: Critical / High / Medium / Low
File: path/to/file
Issue: What is wrong
Expected: What should be
Fix: How to fix it
Task ID: Related task
```

---

# 42. Final Project Audit Command

Copy-paste this command for a complete project audit:

```text
Perform a complete project audit.

Compare the implementation against PRD.md, Plan.md, Task.md, Design.md, and Agent.md.

Check every major area:
- Functional requirements
- Frontend (all public and admin pages)
- Backend (all API endpoints)
- Database (all models)
- Authentication and authorization
- Public portfolio pages
- Admin dashboard
- Blog system
- Project showcase
- Contact system
- Media management
- Localization (EN/KH)
- Theme (dark/light)
- Accessibility
- Responsive design
- Testing coverage
- Security measures
- Docker configuration
- CI/CD configuration
- Deployment
- Documentation

Do not change anything automatically.

Produce an audit report:

| Area | Status | Details | Task IDs |
|------|--------|---------|----------|
| Area | PASS / PARTIAL / MISSING / BLOCKED | Details | TASK-IDs |

Map every finding to relevant Task IDs.
```

---

# 43. Final Checklist

Before the agent considers any session complete, verify:

### Session Checklist

- [ ] Source documents were read
- [ ] Repository state was inspected
- [ ] Correct task was selected based on priority and dependencies
- [ ] Only the selected task was implemented
- [ ] No unrelated changes were made
- [ ] Tests were run and pass
- [ ] Build succeeds
- [ ] No secrets committed
- [ ] No security features disabled
- [ ] Task.md status updated
- [ ] Completion report provided
- [ ] Next task recommended

### Per-Task Quality Checklist

- [ ] Code follows project conventions
- [ ] TypeScript strict mode satisfied
- [ ] No ESLint errors
- [ ] API responses match PRD Section 13 format
- [ ] Frontend follows Design.md specifications
- [ ] Both themes work (if frontend change)
- [ ] Both languages work (if frontend change)
- [ ] Responsive behavior correct (if frontend change)
- [ ] Accessibility maintained (if frontend change)
- [ ] Error handling in place
- [ ] No hardcoded values that should be in config/tokens

---

*End of Agent.md*

*This document governs AI coding agent behavior for the Developer Portfolio & Content Management Platform. It is used alongside PRD.md, Plan.md, Task.md, and Design.md as the complete project documentation suite.*
