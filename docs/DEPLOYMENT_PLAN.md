# Production Deployment Plan

**Project:** Developer Portfolio & Content Management Platform  
**Target Architecture:** Decoupled Full-Stack Web Application (Angular 19 SPA + Node.js/Express REST API + MongoDB Atlas + Cloudflare R2 / S3 Object Storage)  
**Author:** Senior DevOps & Release Engineering Review  
**Date:** October 2026  
**Status:** PROPOSED & PREPARED (Awaiting User Account Setup & Deployment Approval)

---

## 1. Hosting Architecture & Provider Comparison

To identify the most reliable, cost-effective, and low-maintenance deployment strategy, we evaluated the major platform candidates across Frontend, Backend, Database, and Storage tiers.

### 1.1. Frontend Hosting Options

| Provider | Plan / Pricing | Bandwidth & Build Limits | Key Capabilities | Limitations / Risks | Recommendation Rating |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Vercel** | **Hobby (Free)** | 100 GB/mo bandwidth, 6,000 build mins/mo | Global Anycast Edge CDN, native Angular SPA rewrites via [`vercel.json`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/vercel.json), automatic SSL, instant preview deployments | Non-commercial hobby use terms | **★ RECOMMENDED (PaaS)** |
| **Cloudflare Pages** | **Free** | Unlimited bandwidth, 500 builds/mo | Global Anycast network (300+ PoPs), instant cache invalidation, automated SSL | Requires manual `_redirects` file for SPA routing | **Strong Contender** |
| **Netlify** | **Starter (Free)** | 100 GB/mo bandwidth, 300 build mins/mo | Global CDN, automated SSL, branch previews | Lower build minutes limit than Vercel | **Viable** |
| **Self-Hosted VPS (Docker/Nginx)** | **$4 – $6 / mo** (Hetzner / DigitalOcean) | 20 TB/mo bandwidth | Full ownership, custom Nginx caching, no vendor limits | Requires manual OS updates, SSL renewal, firewall management | **Best for Unified VPS** |

---

### 1.2. Backend Hosting Options

| Provider | Plan / Pricing | CPU & RAM Specs | Cold Starts & Inactivity | Outbound SMTP / Networking | Recommendation Rating |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Render** | **Free Web Service** ($0/mo) | 0.1 vCPU, 512 MB RAM (750 free instance hrs/mo) | **Spins down after 15 mins** of inactivity (~50–60s cold start) | **Blocks outbound SMTP ports 25, 465, and 587** (requires HTTP API like Resend, or upgrade to $7/mo Starter) | **★ RECOMMENDED (Free Tier PaaS)** |
| **Railway** | **Trial ($5 grant)** / **Hobby ($5/mo)** | Up to 8 GB RAM, 8 vCPU (metered by second) | **Zero cold starts** (runs continuously while credit remains) | **Open SMTP ports (587/465)**, native persistent volume support | **★ RECOMMENDED (Low-Cost Paid PaaS)** |
| **Fly.io** | **Pay-as-you-go** (~$0–$5/mo) | 256 MB – 1 GB MicroVMs | Configurable auto-suspend (~2–3s cold start) | Open egress, global Anycast routing | Requires proprietary `flyctl` CLI setup |
| **Hetzner Cloud VPS** (CX22) | **€3.79 / mo** (~$4.10) | 2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB traffic | **Zero cold starts**; dedicated instance | Open ports, run entire stack + MongoDB in Docker | **★ RECOMMENDED (Unified VPS Setup)** |

---

### 1.3. Database (MongoDB) Hosting Options

| Provider | Plan / Pricing | Storage & Replica Specs | Security & Network Controls | Backup Capabilities | Recommendation Rating |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **MongoDB Atlas** | **M0 Shared (Free forever)** | 512 MB storage, shared RAM, 3-node replica set | TLS 1.3 end-to-end, SCRAM-SHA-256 auth, IP access list (`0.0.0.0/0` with auth) | Manual CLI snapshots (`mongodump`); automated snapshots require M10+ upgrade ($57/mo) | **★ RECOMMENDED (All Architectures)** |
| **Railway Managed Mongo** | **Usage-based** (~$2–$3/mo from credit) | Custom RAM/Disk | Internal VPC network routing | Ephemeral unless bound to Railway persistent volume | Viable for single-dashboard |
| **Self-Hosted MongoDB (Docker)** | **$0** (included on VPS) | Limited only by host SSD disk space | Localhost binding, internal Docker bridge | Scheduled cron jobs running `mongodump` to external S3/R2 | High maintenance |

---

### 1.4. Media Storage & Email Relay Options

- **Media Storage (Cloudflare R2 vs. Cloudinary)**:
  - **Cloudflare R2 (Recommended)**: 10 GB free storage, 10,000,000 read requests/mo, and **$0 egress fees**. S3-compatible API natively implemented in [`r2.service.ts`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/backend/src/services/r2.service.ts).
  - **Cloudinary (Fallback)**: 25 monthly transformation credits. Ideal for automated thumbnail resizing.
- **Outbound Email (SMTP vs. HTTP Email API)**:
  - **Critical Note on Render Free Tier**: Because Render blocks ports `25`, `465`, and `587` on free web services, standard Nodemailer Gmail SMTP will time out. 
  - **Solution for Render Free Tier**: Use **Resend** (3,000 free emails/month over HTTPS Port 443) or **Brevo/SendGrid** REST API.
  - **Solution for Railway or VPS**: Standard Gmail SMTP (Port 587 with 16-character Google App Password) works immediately with zero code changes.

---

## 2. Recommended Production Setup

We recommend the **Modern Serverless / PaaS Stack**:

1. **Frontend**: **Vercel** (Hobby Plan — $0/mo)
   - Fastest global loading times (LCP < 0.8s) via global edge CDN.
   - Built-in rewrites for Angular SPA routing via [`vercel.json`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/vercel.json).
   - Zero-maintenance automated HTTPS certificates.
2. **Backend**: **Render** (Free Tier Web Service — $0/mo) *OR* **Railway** ($5/mo Hobby)
   - Render is 100% free; can be kept awake using a free Uptime monitor pinging `/api/v1/health` every 10 minutes.
   - If cold starts and SMTP port restrictions are unacceptable, Railway ($5/mo) provides instant execution and unrestricted SMTP.
3. **Database**: **MongoDB Atlas** (M0 Free Tier — $0/mo)
   - 3-node managed replica set with automated patches and SSL.
4. **Media Storage**: **Cloudflare R2** (Free Tier — $0/mo)
   - Zero egress cost storage for resumes, screenshots, and avatars.
5. **Total Monthly Cost**: **$0.00 / month** (or $5.00/month if choosing Railway).

---

## 3. Environment Variables & Secret Handling

### 3.1. Secret Generation Guidelines
Never reuse local development secrets in production. Generate cryptographically strong 64-hex secrets using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.2. Backend Production Variables Reference

| Variable Name | Required | Example Production Value | Purpose & Constraints |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Enables production optimizations and disables debug traces |
| `PORT` | Yes | `10000` | Render standard port (or `3000` on Docker/VPS) |
| `DATABASE_URL` | Yes | `mongodb+srv://admin:pass@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority` | MongoDB Atlas replica set connection string |
| `JWT_SECRET` | Yes | `e837d9c... (64 hex characters)` | Used to sign short-lived access tokens (15m) |
| `JWT_REFRESH_SECRET` | Yes | `a192b4f... (64 hex characters)` | Used to sign long-lived refresh tokens (7d) |
| `JWT_ACCESS_EXPIRATION` | No | `15m` | Token lifespan |
| `JWT_REFRESH_EXPIRATION`| No | `7d` | Refresh cookie lifespan |
| `CORS_ORIGIN` | Yes | `https://yourdomain.com,https://portfolio.vercel.app` | Comma-separated allowed frontend origins |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | 15 minutes window |
| `RATE_LIMIT_MAX_REQUESTS`| No | `100` | Maximum requests per IP per window |
| `LOG_LEVEL` | No | `info` | JSON structured log verbosity |
| `R2_ACCOUNT_ID` | Yes | `<cloudflare-account-id>` | Cloudflare R2 Account Identifier |
| `R2_ACCESS_KEY_ID` | Yes | `<r2-access-key-id>` | R2 Storage Token Access Key |
| `R2_SECRET_ACCESS_KEY`| Yes | `<r2-secret-access-key>` | R2 Storage Token Secret Key |
| `R2_BUCKET_NAME` | Yes | `portfolio-media` | Cloudflare bucket name |
| `R2_PUBLIC_URL` | Yes | `https://pub-xxxxxxxx.r2.dev` | Public URL prefix for assets |
| `R2_ENDPOINT` | Yes | `https://<account-id>.r2.cloudflarestorage.com` | S3-compatible API endpoint |
| `EMAIL_HOST` | Yes | `smtp.gmail.com` | SMTP relay server host |
| `EMAIL_PORT` | Yes | `587` | Outbound TLS port |
| `EMAIL_USER` | Yes | `your-email@gmail.com` | SMTP authentication user |
| `EMAIL_PASS` | Yes | `<16-char-app-password>` | Google App Password |
| `EMAIL_FROM` | No | `"Portfolio Contact" <your-email@gmail.com>` | Notification sender header |

### 3.3. Frontend Build Environment Variables
Frontend variables are embedded during build time into [`environment.prod.ts`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/src/environments/environment.prod.ts):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://portfolio-backend.onrender.com/api/v1',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'kh']
};
```

---

## 4. Step-by-Step Deployment Execution Order

Follow these steps sequentially. Do not start a subsequent step until the preceding step is verified.

```text
[Step 1: MongoDB Atlas] ──> [Step 2: Cloudflare R2] ──> [Step 3: Render Backend]
                                                               │
                                                               ▼
[Step 6: DNS & Domain]  <── [Step 5: Vercel Frontend] <── [Step 4: Seed Database]
```

### Step 1: Provision MongoDB Atlas Cluster
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create an **M0 Free** cluster in your preferred region.
3. Under **Database Access**, create user `portfolio_user` with password `<SECURE_PASSWORD>` and role `Read and write to any database`.
4. Under **Network Access**, add `0.0.0.0/0` (required for dynamic PaaS IP routing).
5. Copy connection string:
   ```text
   mongodb+srv://portfolio_user:<SECURE_PASSWORD>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### Step 2: Set Up Cloudflare R2 Object Storage
1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) and navigate to **R2**.
2. Create bucket `portfolio-media`.
3. Enable public access via an `r2.dev` subdomain or attach custom domain `media.yourdomain.com`.
4. Go to **Manage R2 API Tokens** -> Create token with **Object Read & Write** permissions.
5. Save `Account ID`, `Access Key ID`, and `Secret Access Key`.

### Step 3: Deploy Backend API on Render
1. Sign up at [render.com](https://render.com) and connect GitHub repository `https://github.com/DIMSAREACH/portfolio`.
2. Select **New +** -> **Web Service**.
3. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/v1/health`
4. Enter the environment variables from Section 3.2.
5. Deploy and note your assigned URL: `https://portfolio-backend-xxxx.onrender.com`.
6. Verify health check:
   ```bash
   curl -I https://portfolio-backend-xxxx.onrender.com/api/v1/health
   # Expected: HTTP/1.1 200 OK
   ```

### Step 4: Seed Production Database
From your local terminal, run the database seed once targeting the production Atlas connection string:
```bash
cd backend
DATABASE_URL="mongodb+srv://portfolio_user:<PASSWORD>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority" npm run seed
```
*Creates initial administrator account, profile, 6 categories, 19 skills, 6 projects, 3 experiences, and 2 education records.*

### Step 5: Deploy Frontend on Vercel
1. In [`frontend/src/environments/environment.prod.ts`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/src/environments/environment.prod.ts), update `apiUrl` to point to the live Render URL:
   ```typescript
   apiUrl: 'https://portfolio-backend-xxxx.onrender.com/api/v1'
   ```
2. Commit and push:
   ```bash
   git add frontend/src/environments/environment.prod.ts
   git commit -m "chore(frontend): configure production API endpoint"
   git push origin main
   ```
3. Sign in to [vercel.com](https://vercel.com) -> **Add New...** -> **Project**.
4. Import `portfolio`. Configure:
   - **Framework Preset**: `Angular`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/frontend/browser`
5. Click **Deploy**. Note your live frontend URL: `https://portfolio-xxxx.vercel.app`.

### Step 6: Configure Custom Domain, HTTPS, and CORS Whitelisting
1. In Vercel, navigate to **Settings** -> **Domains**. Add `yourdomain.com` and `www.yourdomain.com`.
2. In your DNS registrar (Namecheap, GoDaddy, Cloudflare), add DNS records:
   - `CNAME` for `@` (or `A` record) pointing to `76.76.21.21` (Vercel IP).
   - `CNAME` for `www` pointing to `cname.vercel-dns.com`.
   - `CNAME` for `api` pointing to `portfolio-backend-xxxx.onrender.com`.
3. In Render dashboard, update `CORS_ORIGIN`:
   ```text
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://portfolio-xxxx.vercel.app
   ```
4. Allow 5–10 minutes for DNS propagation and automatic SSL issuance.

---

## 5. Database Backup, Recovery & Disaster Planning

### 5.1. Automated Backup Strategy
- **MongoDB Atlas Scheduled Backups**: If upgrading to Atlas M10+, daily continuous snapshots are retained automatically.
- **On M0 Free Tier**: Set up a weekly local cron or GitHub Action running `mongodump` with gzip compression.

### 5.2. Backup Command
To back up the live database to a compressed archive:
```bash
mongodump --uri="mongodb+srv://portfolio_user:<PASSWORD>@cluster0.mongodb.net/portfolio" \
  --archive="portfolio-backup-$(date +%Y%m%d_%H%M%S).gz" --gzip
```

### 5.3. Disaster Recovery Restore Command
To restore an archive to a clean cluster:
```bash
mongorestore --uri="mongodb+srv://portfolio_user:<PASSWORD>@cluster0.mongodb.net/portfolio" \
  --archive="portfolio-backup-YYYYMMDD_HHMMSS.gz" --gzip --drop
```

---

## 6. Post-Deployment Smoke Tests

Once deployed, execute the automated E2E QA test suite directly against the production endpoints:

```bash
cd backend
FRONTEND_BASE="https://yourdomain.com" API_BASE="https://api.yourdomain.com/api/v1" npm run test:e2e
```

### Manual Verification Checklist
1. **Public Site Loading**: Visit `https://yourdomain.com`. Verify hero image, developer bio, and social links render.
2. **Language Switching**: Toggle between English and Khmer (`kh`); verify text and font update.
3. **Theme Toggling**: Switch between Light and Dark modes; verify colors update without flash of unstyled content.
4. **Project Detail Navigation**: Click a project card; verify route `/projects/:slug` opens with gallery screenshots and tech badges.
5. **Contact Form**: Submit a message at `/contact`; verify success notification appears and entry is saved in the database.
6. **CV Download**: Click **Download CV**; verify the PDF opens or downloads cleanly.
7. **Admin Authentication**: Navigate to `/admin/login`. Sign in using seeded credentials (`admin@portfolio.dev` / `Admin@123456`).
8. **Password Update**: In `/admin/profile`, update the administrator password to a secure personal password.
9. **Project Creation & Publishing**: Create a draft project, verify it does not appear on public `/projects`, toggle published to `true`, and confirm it appears publicly.

---

## 7. Monitoring, Troubleshooting & Maintenance

### 7.1. Preventing Render Free-Tier Spin-Downs
To eliminate the 50-second cold start delay on Render's free tier:
1. Create a free account at [UptimeRobot](https://uptimerobot.com).
2. Add a new monitor:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Portfolio API Health`
   - **URL**: `https://portfolio-backend-xxxx.onrender.com/api/v1/health`
   - **Monitoring Interval**: `Every 10 minutes`
3. This periodic HTTP ping keeps the service warm within Render's 750 free hours/month pool (a 31-day month is 744 hours).

### 7.2. Troubleshooting Common Production Defects

| Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **CORS Error** in browser console (`Access-Control-Allow-Origin`) | Frontend origin not whitelisted in backend | Check Render `CORS_ORIGIN` variable. Ensure no trailing slashes (e.g., `https://yourdomain.com`, not `https://yourdomain.com/`). |
| **Contact form hangs / 504 Gateway Timeout** | Render Free Tier blocking SMTP ports 587/465 | Switch to Resend/SendGrid HTTP API over Port 443, or upgrade to Render Starter plan ($7/mo) to unlock standard SMTP. |
| **Angular 404 on Page Refresh** | Web server trying to find physical directory instead of SPA fallback | Verify [`frontend/vercel.json`](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/frontend/vercel.json) rewrite rule `{"source": "/(.*)", "destination": "/"}` is active. |
| **Images Fail to Load** | Cloudflare R2 bucket public access not enabled | In Cloudflare Dashboard -> R2 -> `portfolio-media` -> Settings, enable **R2.dev subdomain** or attach custom domain. |

---

## 8. Rollback Procedures

If a critical defect is discovered in production, execute these rollback steps:

### 8.1. Frontend Rollback (Instant — < 30 seconds)
1. Sign in to [Vercel](https://vercel.com) -> Select `portfolio` project -> Click **Deployments** tab.
2. Locate the previous stable deployment hash.
3. Click the **...** menu -> **Promote to Production** (or **Instant Rollback**).
4. Vercel immediately switches edge routing to the previous build artifact with zero downtime.

### 8.2. Backend Rollback (< 2 minutes)
1. In Render dashboard -> Select `portfolio-backend` -> Click **Events** or **Deploys**.
2. Locate the previous successful deploy.
3. Click **Rollback to this deploy**. Render reverts the active Docker container to the prior commit SHA.

### 8.3. Database Rollback
If a database migration or erroneous script damaged data, restore the latest `.gz` snapshot:
```bash
mongorestore --uri="<MONGODB_URI>" --archive="portfolio-backup-YYYYMMDD_HHMMSS.gz" --gzip --drop
```
