# API Reference & Documentation

The Developer Portfolio & Content Management Platform exposes a structured RESTful API versioned under `/api/v1`.

Interactive Swagger / OpenAPI 3.0 documentation is available when running the server:
- **Interactive UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **OpenAPI JSON Spec:** [http://localhost:3000/api/docs.json](http://localhost:3000/api/docs.json)

---

## 1. Response Formats

All API endpoints return JSON conforming to standard response envelopes.

### Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation message",
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

---

## 2. Authentication Flow

Authentication uses JSON Web Tokens (JWT).
- **Access Tokens:** Short-lived (15 minutes), passed via `Authorization: Bearer <token>` HTTP header.
- **Refresh Tokens:** Long-lived (7 days), stored in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie named `portfolio_refresh_token`.

### Auth Endpoints

| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/login` | Public | Authenticate with email & password; returns access token and sets refresh cookie |
| `POST` | `/api/v1/auth/refresh` | Public | Refresh expired access token using cookie |
| `POST` | `/api/v1/auth/logout` | Authenticated | Invalidate refresh token and clear cookie |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve currently authenticated admin user details |
| `PUT` | `/api/v1/auth/password` | Authenticated | Update administrator password |

---

## 3. Public Endpoints

Public endpoints return only published and visible portfolio content.

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/api/v1/public/profile` | Public developer profile info and bio |
| `GET` | `/api/v1/public/projects` | List published projects (supports `?page=`, `?category=`, `?featured=`) |
| `GET` | `/api/v1/public/projects/:slug` | Retrieve single project by unique slug (increments view counter) |
| `GET` | `/api/v1/public/blog` | List published articles (supports `?page=`, `?category=`, `?tag=`, `?search=`) |
| `GET` | `/api/v1/public/blog/:slug` | Retrieve single article by slug (increments view counter) |
| `GET` | `/api/v1/public/skills` | List skills grouped by category |
| `GET` | `/api/v1/public/experience` | List career experience entries |
| `GET` | `/api/v1/public/education` | List academic background and credentials |
| `GET` | `/api/v1/public/certifications` | List professional certifications |
| `GET` | `/api/v1/public/social-links` | List active social links in display order |
| `POST` | `/api/v1/public/contact` | Submit contact form inquiry (rate-limited, sends notification) |
| `GET` | `/api/v1/cv/download` | Download current CV (redirects to Cloudinary, increments counter) |

---

## 4. Admin Management Endpoints

All admin endpoints require an active `Authorization: Bearer <token>` header with `admin` role.

### Dashboard & Analytics
- `GET /api/v1/admin/dashboard/stats`: Aggregated platform statistics, collection counts, and recent contact inquiries.

### Projects Management
- `GET /api/v1/admin/projects`: Paginated project list with draft/published filtering.
- `GET /api/v1/admin/projects/:id`: Get project by ID.
- `POST /api/v1/admin/projects`: Create project (supports multipart/form-data image uploads).
- `PATCH /api/v1/admin/projects/:id`: Update project.
- `DELETE /api/v1/admin/projects/:id`: Delete project.

### Blog Management
- `GET /api/v1/admin/blog`: List all articles.
- `GET /api/v1/admin/blog/:id`: Get article by ID.
- `POST /api/v1/admin/blog`: Create article (supports cover image upload).
- `PATCH /api/v1/admin/blog/:id`: Update article.
- `DELETE /api/v1/admin/blog/:id`: Delete article.
- `PATCH /api/v1/admin/blog/:id/publish`: Toggle publish status.

### Experience, Education & Certifications
- `GET|POST /api/v1/admin/experiences`
- `GET|PATCH|DELETE /api/v1/admin/experiences/:id`
- `GET|POST /api/v1/admin/educations`
- `GET|PATCH|DELETE /api/v1/admin/educations/:id`
- `GET|POST /api/v1/admin/certifications`
- `GET|PATCH|DELETE /api/v1/admin/certifications/:id`

### Skills & Categories
- `GET|POST /api/v1/admin/skills`
- `GET|PATCH|DELETE /api/v1/admin/skills/:id`
- `GET|POST /api/v1/admin/categories`
- `GET|PATCH|DELETE /api/v1/admin/categories/:id`

### Messages & Inquiries
- `GET /api/v1/admin/messages`: List inquiries (supports `?status=unread|read|archived`).
- `PATCH /api/v1/admin/messages/:id/read`: Mark message as read.
- `PATCH /api/v1/admin/messages/:id/archive`: Archive message.
- `DELETE /api/v1/admin/messages/:id`: Delete message.

### Media Library & CV
- `GET /api/v1/admin/media`: List uploaded Cloudinary media assets.
- `POST /api/v1/admin/media/upload`: Upload file to Cloudinary.
- `DELETE /api/v1/admin/media/:id`: Delete file from Cloudinary and database.
- `GET /api/v1/admin/cv`: Get current CV details.
- `POST /api/v1/admin/cv/upload`: Upload new CV PDF document.

### Profile & Settings
- `GET /api/v1/admin/profile`: Get profile configuration.
- `PUT /api/v1/admin/profile`: Update profile info and avatar.
- `GET /api/v1/admin/settings`: Get global system settings.
- `PUT /api/v1/admin/settings`: Update settings (maintenance mode, notifications, etc.).
- `GET|POST /api/v1/admin/social-links`: Manage social links and reorder.
