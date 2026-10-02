# Local Development Setup Guide

This guide provides step-by-step instructions for running the Developer Portfolio & Content Management Platform locally.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Git**: v2.x or higher
- **Docker & Docker Compose** (Optional, recommended for isolated local databases and containerized dev)
- **MongoDB**: v7.x or higher (if running natively without Docker)

---

## 2. Repository Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 3. Environment Variables Configuration

Copy the example environment template in `backend/`:

```bash
cp backend/.env.example backend/.env
```

Review and configure your `backend/.env` file:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mongodb://localhost:27017/portfolio

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-chars-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Cloudinary (Optional for local mock, required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Nodemailer SMTP / Gmail / Ethereal)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=portfolio@example.com
```

---

## 4. Running the Platform

### Option A: Using Docker Compose (All Services)

Run the full stack (Frontend, Backend, and MongoDB) with live hot reload:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Interactive Swagger Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Health Check**: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)
- **MongoDB**: `localhost:27017`

### Option B: Running Natively

1. **Start MongoDB:**
   ```bash
   # Ensure local mongod is running on port 27017
   mongod --dbpath <data-directory>
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend Application:**
   ```bash
   cd frontend
   npm start
   ```

---

## 5. Seeding the Database

Populate your database with the complete initial portfolio dataset (admin account, projects, blog posts, skills, experience, education, profile):

```bash
cd backend
npm run seed
```

Default administrator credentials:
- **Email:** `admin@portfolio.dev`
- **Password:** `Admin@123456`

---

## 6. Running Tests & Quality Checks

### Backend:
```bash
cd backend
npm run lint          # Run ESLint
npm test              # Run Jest unit & integration test suites
npm run build         # Verify strict TypeScript compilation
```

### Frontend:
```bash
cd frontend
npm run lint          # Run ESLint
npm test -- --watch=false # Run Vitest/Karma test suites
npm run build         # Build production Angular bundle
```
