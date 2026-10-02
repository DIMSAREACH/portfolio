# Production Deployment Guide

This guide details the procedures for deploying the Developer Portfolio & Content Management Platform into production environments.

---

## 1. Production Architecture

```text
[ Client Browser ]
        │
        ├── (HTTPS: 443) ──> [ Frontend: Vercel / Netlify / Nginx Container ]
        │
        └── (HTTPS: 443) ──> [ Backend API: Render / Railway / Node Container ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       [ MongoDB Atlas (M0+) ]               [ Cloudinary Media CDN ]
```

---

## 2. Infrastructure Setup

### 2.1 MongoDB Atlas Cluster

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Provision an **M0 Free Tier** cluster in your preferred region.
3. In **Database Access**, create an administrative user with read/write privileges.
4. In **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere) to allow connections from dynamic PaaS IPs.
5. Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### 2.2 Cloudinary Configuration

1. Create an account at [Cloudinary](https://cloudinary.com).
2. Obtain your **Cloud Name**, **API Key**, and **API Secret** from the Cloudinary dashboard.
3. Configure default unsigned or signed upload preset settings (or rely on server-side signed uploads via the backend API).

---

## 3. Backend Deployment (Render / Railway / Docker)

### Option A: Render.com Web Service

1. Create a new **Web Service** pointing to your Git repository.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start` (or `node dist/server.js`)
   - **Health Check Path:** `/api/v1/health`
3. Add Environment Variables:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
   JWT_SECRET=production_strong_secret_min_32_characters
   JWT_REFRESH_SECRET=production_strong_refresh_secret_min_32_characters
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-portfolio-domain.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_HOST=smtp.sendgrid.net (or smtp.gmail.com)
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_smtp_user
   EMAIL_PASS=your_smtp_password
   EMAIL_FROM=notifications@yourdomain.com
   ```

### Option B: Docker Container

Deploy using the provided multi-stage `backend/Dockerfile` or run via `docker-compose.yml`:

```bash
docker compose up -d --build
```

---

## 4. Frontend Deployment (Vercel / Netlify)

### Option A: Vercel

1. Import repository into [Vercel](https://vercel.com).
2. Configure settings:
   - **Framework Preset:** `Angular`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend/browser`
3. Add Rewrite rule for SPA routing:
   Create `frontend/vercel.json` if needed:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Configure production API URL:
   Update `frontend/src/environments/environment.prod.ts` or set build environment variables to point to your live backend domain:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://api.yourdomain.com/api/v1',
   };
   ```

---

## 5. Post-Deployment Verification

1. **Verify Backend Health:**
   ```bash
   curl -I https://api.yourdomain.com/api/v1/health
   # Expected: HTTP/1.1 200 OK
   ```

2. **Seed Initial Data:**
   Run remote database seed or trigger seed script against production MongoDB Atlas:
   ```bash
   DATABASE_URL="<atlas-connection-string>" npm run seed
   ```

3. **Verify Public Routes:**
   - Homepage loads without errors: `https://yourdomain.com/`
   - Dynamic meta tags and Open Graph tags render accurately
   - `/robots.txt` and `/sitemap.xml` are accessible

4. **Verify Administrative Access:**
   - Log into `/admin/login` using your configured admin credentials
   - Confirm token refresh cookies (`portfolio_refresh_token`) are stored securely with `HttpOnly; Secure; SameSite=Lax`
   - Verify file uploads stream successfully to Cloudinary
