# Production Deployment & DevOps Engineering Guide

**Platform:** Developer Portfolio & Content Management Platform  
**Target Architecture:** Angular 19 SPA (Frontend) + Node.js/Express REST API (Backend) + MongoDB Atlas + Cloudflare R2 / Cloudinary + SMTP

---

## 1. Production Architecture Overview

```text
                                  ┌────────────────────────┐
                                  │   Public Web Visitors  │
                                  └───────────┬────────────┘
                                              │ HTTPS (443)
                                              ▼
                        ┌───────────────────────────────────────────┐
                        │        DNS / CDN Tier (Cloudflare)        │
                        └─────┬───────────────────────────────┬─────┘
                              │                               │
                CNAME / A     │                               │   CNAME / Reverse Proxy
         yourdomain.com       │                               │   api.yourdomain.com
                              ▼                               ▼
               ┌──────────────────────────────┐ ┌──────────────────────────────┐
               │    Frontend Host (Vercel)    │ │   Backend Host (Render/VPS)  │
               │  - Angular 19 SPA Static App │ │  - Node.js 20 Express REST   │
               │  - Edge CDN Caching          │ │  - Rate Limiting & Helmet    │
               │  - Client-side Routing       │ │  - Non-root Container Exec   │
               └──────────────────────────────┘ └──────────────┬───────────────┘
                                                               │
                                  ┌────────────────────────────┼───────────────────────────┐
                                  │ TLS 1.3                    │ S3 Protocol               │ SMTP (TLS 587)
                                  ▼                            ▼                           ▼
                     ┌─────────────────────────┐  ┌─────────────────────────┐ ┌─────────────────────────┐
                     │  MongoDB Atlas (M0/M10) │  │   Cloudflare R2 Bucket  │ │   Google SMTP / SendGrid │
                     │  - Replicated ReplicaSet│  │  - Zero Egress Media CDN│ │  - Visitor Inquiry     │
                     │  - Encrypted at Rest    │  │  - Avatars, CV, Projects│ │    Notification Relay   │
                     └─────────────────────────┘  └─────────────────────────┘ └─────────────────────────┘
```

---

## 2. External Accounts & Credentials Checklist

Before deploying to production, secure the following third-party provider accounts and credentials:

| Provider | Service / Purpose | Required Credentials / Tokens | Free Tier Available? | Setup Link |
| :--- | :--- | :--- | :---: | :--- |
| **MongoDB Atlas** | Managed Cloud Database | Connection string with username and password: `mongodb+srv://...` | Yes (M0 Cluster 512MB) | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **Vercel** | Frontend Static / SPA Hosting | GitHub Account connection; Project auto-detected from repo | Yes (Hobby Tier) | [vercel.com](https://vercel.com) |
| **Render** or **Railway** | Backend API Container Web Service | GitHub Account connection; Environment variables configuration | Yes (Free Web Service / Free Credits) | [render.com](https://render.com) / [railway.app](https://railway.app) |
| **Cloudflare R2** | Zero-Egress Media & File Storage | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Yes (10 GB storage free) | [dash.cloudflare.com](https://dash.cloudflare.com) |
| **Google Account** or **SendGrid** | Outbound Contact Form SMTP Delivery | Google 16-character App Password (or SendGrid API Key): `EMAIL_USER`, `EMAIL_PASS` | Yes (Gmail free; SendGrid 100 emails/day) | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |

---

## 3. Step-by-Step Deployment Instructions

### 3.1. Phase 1: Database Provisioning (MongoDB Atlas)

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a new project named `Portfolio`.
3. Deploy an **M0 Free** cluster in your closest cloud region (e.g., `AWS / ap-southeast-1` or `AWS / us-east-1`).
4. **Database Access:** Create a database user (e.g., `portfolio_admin`) with the **Read and write to any database** privilege. Note the password.
5. **Network Access:** Add IP Address `0.0.0.0/0` (Allow access from anywhere). This is required because serverless and PaaS platforms (like Render/Railway) use dynamic outbound IPs.
6. Click **Connect** -> **Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://portfolio_admin:<YOUR_PASSWORD>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
7. *(Optional)* Seed the production database from your terminal before opening traffic:
   ```bash
   cd backend
   DATABASE_URL="mongodb+srv://portfolio_admin:<PASSWORD>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority" npm run seed
   ```

---

### 3.2. Phase 2: Object Storage Setup (Cloudflare R2)

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. In the sidebar, select **R2** -> **Create bucket**. Name the bucket `portfolio-media`.
3. Under bucket **Settings** -> **Public access**, connect a custom domain (e.g., `media.yourdomain.com`) or enable the **R2.dev subdomain**.
4. In the R2 sidebar, click **Manage R2 API Tokens** -> **Create API token**:
   - Permission: **Object Read & Write**
   - Bucket: Apply to `portfolio-media`
5. Copy the generated **Access Key ID**, **Secret Access Key**, and **Endpoint URL**:
   - `R2_ACCOUNT_ID`: Your Cloudflare Account ID (found in dashboard URL)
   - `R2_ACCESS_KEY_ID`: `<access-key-id>`
   - `R2_SECRET_ACCESS_KEY`: `<secret-access-key>`
   - `R2_BUCKET_NAME`: `portfolio-media`
   - `R2_PUBLIC_URL`: `https://pub-xxxxxxxx.r2.dev` (or `https://media.yourdomain.com`)
   - `R2_ENDPOINT`: `https://<account-id>.r2.cloudflarestorage.com`

---

### 3.3. Phase 3: Backend Deployment (Render Web Service)

1. Sign in to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/DIMSAREACH/portfolio`.
4. Configure the service:
   - **Name:** `portfolio-backend`
   - **Region:** Closest to your database (e.g., `Oregon (US West)` or `Singapore`)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or `Starter` for always-on instances without cold starts)
5. Under **Advanced** -> **Health Check Path**, enter:
   ```text
   /api/v1/health
   ```
6. Add the following **Environment Variables**:

| Variable | Value / Notes |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | Your MongoDB Atlas connection string (`mongodb+srv://...`) |
| `JWT_SECRET` | Generate random 64-hex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_REFRESH_SECRET`| Generate a second distinct 64-hex string |
| `JWT_ACCESS_EXPIRATION` | `15m` |
| `JWT_REFRESH_EXPIRATION`| `7d` |
| `CORS_ORIGIN` | `https://your-portfolio.vercel.app,https://yourdomain.com` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `LOG_LEVEL` | `info` |
| `R2_ACCOUNT_ID` | Your Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | Your Cloudflare R2 Access Key ID |
| `R2_SECRET_ACCESS_KEY`| Your Cloudflare R2 Secret Access Key |
| `R2_BUCKET_NAME` | `portfolio-media` |
| `R2_PUBLIC_URL` | `https://pub-xxxxxxxx.r2.dev` |
| `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASS` | Your Google 16-character App Password |
| `EMAIL_FROM` | `"Portfolio Notifications" <your-email@gmail.com>` |

7. Click **Create Web Service**. Wait for the build and deployment to complete.
8. Verify backend responsiveness:
   ```bash
   curl -I https://portfolio-backend.onrender.com/api/v1/health
   # Expected: HTTP/1.1 200 OK
   ```

---

### 3.4. Phase 4: Frontend Deployment (Vercel)

1. In [`frontend/src/environments/environment.prod.ts`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/src/environments/environment.prod.ts), ensure `apiUrl` points to your Render backend:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://portfolio-backend.onrender.com/api/v1',
   };
   ```
2. Push your changes to Git (`git push origin main`).
3. Sign in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
4. Import your GitHub repository `portfolio`.
5. Configure the deployment:
   - **Framework Preset:** `Angular`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend/browser`
6. Click **Deploy**. Vercel will install dependencies, build the production bundle, and publish to global edge CDN nodes.
7. Vercel automatically respects [`frontend/vercel.json`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/vercel.json) to rewrite all routes to `index.html` for client-side routing and apply immutable asset caching.

---

### 3.5. Phase 5: Self-Hosted Docker Deployment (Alternative Option)

If hosting on a single Linux VPS (Ubuntu/Debian) using Docker Compose:

1. Clone repository on VPS:
   ```bash
   git clone https://github.com/DIMSAREACH/portfolio.git /var/www/portfolio
   cd /var/www/portfolio
   ```
2. Copy and populate the production environment file:
   ```bash
   cp .env.example backend/.env
   nano backend/.env
   ```
3. Build and launch all services in detached mode:
   ```bash
   docker compose up --build -d
   ```
4. Verify container statuses and health probes:
   ```bash
   docker compose ps
   # Both portfolio-backend and portfolio-frontend should show (healthy)
   ```

---

## 4. HTTPS, Domain & DNS Configuration

To bind your custom domain (e.g., `yourdomain.com`) and API subdomain (`api.yourdomain.com`):

### 4.1. DNS Records Setup

In your domain registrar or DNS provider (Cloudflare, Namecheap, GoDaddy):

| Record Type | Name / Host | Target / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` (or `www`) | `cname.vercel-dns.com` | Auto | DNS Only (or Proxied) |
| **CNAME** | `api` | `portfolio-backend.onrender.com` | Auto | DNS Only |

### 4.2. Update Allowed CORS Origins
Once your custom domain is connected, update the `CORS_ORIGIN` environment variable in Render:
```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Both Vercel and Render automatically provision and renew free SSL/TLS certificates via Let's Encrypt.

---

## 5. Database Backup, Recovery & Disaster Planning

### 5.1. Automated Backups (MongoDB Atlas)
- On MongoDB Atlas (M10+ tier), automated continuous backup snapshots are enabled by default.
- For free tier (M0), manual CLI backups must be scheduled periodically.

### 5.2. Manual Backup with `mongodump`
To create a complete gzip archive of your production database:
```bash
mongodump --uri="mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/portfolio" --archive="portfolio-backup-$(date +%Y%m%d_%H%M%S).gz" --gzip
```

### 5.3. Disaster Recovery Restore with `mongorestore`
To restore a backup snapshot to a clean database cluster:
```bash
mongorestore --uri="mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/portfolio" --archive="portfolio-backup-YYYYMMDD_HHMMSS.gz" --gzip --drop
```
*(The `--drop` flag clears existing collections prior to restoration to prevent key collision errors).*

---

## 6. Health Checks, Monitoring & Logging

### 6.1. Health Check Probes
- **Backend Health Probe:** `GET /api/v1/health`  
  Returns HTTP `200 OK` with JSON `{ "status": "ok", "timestamp": "2026-..." }`.
- **Frontend Health Probe:** `GET /`  
  Returns HTTP `200 OK` serving the Nginx static assets.

### 6.2. Application Logging
- Handled via Winston and Morgan.
- In production (`NODE_ENV=production`), logs are formatted as structured JSON with log level `info`.
- View live application logs on Render via:
  **Render Dashboard** -> Select Web Service -> **Logs** tab.

### 6.3. Uptime Monitoring
Set up a free monitor on [UptimeRobot](https://uptimerobot.com) or [Better Uptime](https://betterstack.com):
- Monitor Type: `HTTP(s)`
- URL: `https://api.yourdomain.com/api/v1/health`
- Interval: `5 minutes`
- Keyword: `"status":"ok"`

---

## 7. Pre-Production Launch Checklist

Before sharing your portfolio URL publicly, complete the following actions:

- [ ] **1. Change Default Admin Credentials**:
  - Sign in to `https://yourdomain.com/admin/login` using initial seeded credentials (`admin@portfolio.dev` / `Admin@123456`).
  - Update your administrator email and password immediately via `/admin/profile`.
- [ ] **2. Whitelist Production Domains in `CORS_ORIGIN`**:
  - Confirm `CORS_ORIGIN` matches the exact frontend domain(s) without trailing slashes.
- [ ] **3. Verify Live Email Transmission**:
  - Fill out and submit the `/contact` form on the live site.
  - Check your personal inbox to verify that the message notification arrives.
- [ ] **4. Test Cloudflare R2 Uploads & CV Download**:
  - In `/admin/media`, upload a test image to confirm R2 bucket permissions.
  - In `/admin/settings`, upload your latest PDF resume.
  - Click **Download CV** on the homepage to ensure the file downloads smoothly.
- [ ] **5. Confirm SEO & Social Graph Meta**:
  - Inspect `og:image`, `og:title`, and `og:description` using [OpenGraph.xyz](https://www.opengraph.xyz) or Twitter Card Validator.
- [ ] **6. Verify Security Headers**:
  - Test the live domain on [SecurityHeaders.com](https://securityheaders.com) to confirm `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` are present.
