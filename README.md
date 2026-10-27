# Developer Portfolio & Content Management Platform

A modern, high-performance personal portfolio website combined with a secure, private administrative content management system (CMS). Built with Angular, Node.js/Express, TypeScript, and MongoDB.

---

## Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | Angular 19+ | Standalone components, Signals, Reactive Forms, Router |
| **Frontend Styling** | Tailwind CSS + Angular Material | Utility-first styling + accessible UI component library |
| **Backend API** | Node.js + Express | TypeScript (strict mode), RESTful API architecture |
| **Database** | MongoDB + Mongoose ODM | Local development via Docker, Atlas for production |
| **Authentication** | JWT (Access + Refresh Tokens) | HTTP-only cookies, bcryptjs password hashing |
| **Media Storage** | Cloudinary | Cloud storage for portfolio project images and CV uploads |
| **DevOps & Tooling** | Docker, ESLint, Prettier, Jest | Docker Compose for multi-container local development |

---

## Project Structure

```text
portfolio/
├── backend/                  # Node.js/Express TypeScript API
│   ├── src/
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entry point (port 3000)
│   ├── tests/                # Unit and integration test suites
│   ├── .env.example          # Environment variable template
│   ├── tsconfig.json         # Strict TypeScript compiler options
│   └── Dockerfile.dev        # Development container image
├── frontend/                 # Angular 19+ SPA client
│   ├── src/
│   │   ├── app/              # Core, shared, and feature components
│   │   ├── environments/     # Dev and Prod API endpoint configs
│   │   └── styles.css        # Tailwind CSS and global design tokens
│   ├── angular.json          # Angular CLI workspace config
│   ├── tailwind.config.js    # Tailwind configuration
│   └── Dockerfile.dev        # Development container image
├── docs/                     # Architecture and setup documentation
├── docker-compose.dev.yml    # Multi-container local orchestration
├── PRD.md                    # Product Requirements Document
├── Plan.md                   # 21-phase implementation plan
├── Task.md                   # 75+ granular development tasks
├── Design.md                 # Design system & UX specification
├── Agent.md                  # AI agent operating manual
└── README.md                 # Project quick-start & overview
```

---

## Project Documentation

The repository is governed and documented by the following specifications:

- **[PRD.md](docs/PRD.md)** — Product Requirements Document (features, schemas, API specifications)
- **[Plan.md](docs/Plan.md)** — Architectural roadmap and dependency-aware implementation phases
- **[Task.md](docs/Task.md)** — Task tracker with acceptance criteria and definition of done
- **[Design.md](docs/Design.md)** — Design system, color palettes, typography, and UX guidelines
- **[Agent.md](Agent.md)** — Operating manual and coding standards for AI pair programming
- **[SETUP.md](docs/SETUP.md)** — Local development setup and testing guide
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Production hosting, MongoDB Atlas, and container guide
- **[API.md](docs/API.md)** — RESTful API endpoint catalog, authentication flow, and Swagger documentation

---

## Prerequisites

- **Node.js**: LTS version 20+ (tested on Node 20–26)
- **npm**: version 10+
- **Docker & Docker Compose**: (Optional, for containerized local development)
- **MongoDB**: Community Server (if running without Docker)

---

## Quick Start

### Option 1: Running with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Configure environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Launch all services:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

4. Access the applications:
   - **Frontend**: [http://localhost:4200](http://localhost:4200)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)
   - **Health Check**: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)
   - **MongoDB**: `localhost:27017`

---

### Option 2: Running Locally (Native Node + Angular)

#### 1. Start MongoDB
If running MongoDB via Docker Desktop:
```bash
# Ensure Docker Desktop is active (on Windows, ensure context is default if needed)
docker context use default
docker compose -f docker-compose.dev.yml up -d mongo
```
Or start local native MongoDB:
```bash
mongod --dbpath <path-to-data-directory>
```

#### 2. Backend Setup & Database Seeding

```bash
cd backend

# Install dependencies
npm install

# Setup local environment
cp .env.example .env

# Populate initial admin account, categories, skills, projects, and profile
npm run seed

# Start development server with hot-reload
npm run dev
```

Default Administrative Credentials:
- **Email:** `admin@portfolio.dev`
- **Password:** `Admin@123456`

Available Backend Scripts:
- `npm run dev`: Starts the server with `ts-node-dev` on port 3000
- `npm run seed`: Seeds complete initial database dataset
- `npm run build`: Compiles TypeScript to `dist/`
- `npm run start`: Runs compiled production code (`node dist/server.js`)
- `npm run test`: Runs test suite via Jest
- `npm run lint`: Runs ESLint checks
- `npm run lint:fix`: Automatically fixes lint issues

#### 3. Frontend Setup

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Angular development server
npm start
```

Available Frontend Scripts:
- `npm start`: Serves the application on [http://localhost:4200](http://localhost:4200)
- `npm run build`: Generates production build in `dist/frontend`
- `npm run test`: Executes unit tests with Vitest
- `npm run lint`: Runs Angular ESLint checks

---

## Local Application Addresses

| Service | URL | Description |
|---|---|---|
| **Frontend Web App** | [http://localhost:4200](http://localhost:4200) | Public portfolio & Admin CMS |
| **Admin Login** | [http://localhost:4200/admin/login](http://localhost:4200/admin/login) | Administrative authentication |
| **Backend API** | [http://localhost:3000/api/v1](http://localhost:3000/api/v1) | RESTful API base route |
| **API Health Check** | [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health) | Health status & timestamp |
| **Interactive Swagger Docs** | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) | OpenAPI 3.0 specification & UI |
| **MongoDB** | `localhost:27017` | Database instance |

---

## Environment Variables

The backend requires environment variables defined in `backend/.env`. Refer to [backend/.env.example](backend/.env.example) for the complete list:

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/portfolio` |
| `CORS_ORIGIN` | Allowed client URL | `http://localhost:4200` |
| `JWT_SECRET` | Secret key for access token signing | 32+ char secret string |
| `JWT_REFRESH_SECRET` | Secret key for refresh token signing | 32+ char secret string |
| `JWT_ACCESS_EXPIRATION` | Access token lifespan | `15m` |
| `JWT_REFRESH_EXPIRATION`| Refresh token lifespan | `7d` |
| `R2_*` | Cloudflare R2 credentials (Primary media storage) | See `.env.example` |
| `CLOUDINARY_*` | Cloudinary credentials (Fallback media storage) | Optional dev mock |
| `EMAIL_*` | SMTP credentials for contact & reset emails | `smtp.gmail.com` |
| `RATE_LIMIT_*` | Rate limiting settings | `15m` window / `100` max requests |

---

## License

This project is licensed under the ISC License.
