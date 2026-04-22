# VEAM API Reference

**Base URL:** `http://localhost:3000/api`  
**Auth:** Pass `Authorization: Bearer <token>` on all protected routes. Token is obtained from `POST /auth/login`.

---

## Auth

### POST /auth/login

**Public**

Request:

```json
{
  "email": "admin@veam.org",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "<jwt>"
}
```

---

## Admins

### GET /admins/me

**Protected** — Returns the profile of the currently logged-in admin.

Response:

```json
{
  "_id": "...",
  "email": "admin@veam.org",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Pages

Pages power the nav menu. `GET /pages` returns a recursive tree: every root page (no `parent`) includes a `children` array, and each child may itself contain a `children` array. Pages with `disabled: true` appear in the nav but are **not clickable** — they are group headers that only exist to nest children.

`contentHtml` is **excluded** from all list endpoints. Fetch it only via `GET /pages/:slug` or `GET /pages/manage/:id`.

### GET /pages

**Public** — Nav tree of all published pages.

Response:

```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "slug": "about",
    "title": "About",
    "seoTitle": "",
    "seoDescription": "",
    "status": "published",
    "parent": null,
    "disabled": true,
    "createdAt": "...",
    "updatedAt": "...",
    "children": [
      {
        "_id": "664f1a2b3c4d5e6f7a8b9c0e",
        "slug": "about-veam",
        "title": "About VEAM",
        "parent": "664f1a2b3c4d5e6f7a8b9c0d",
        "disabled": false,
        "children": []
      }
    ]
  }
]
```

### GET /pages/:slug

**Public** — Single published page with full content. Returns `404` if the page is disabled or not published.

Response:

```json
{
  "_id": "...",
  "slug": "about-veam",
  "title": "About VEAM",
  "contentHtml": "<p>Full HTML content here.</p>",
  "seoTitle": "About VEAM | VEAM",
  "seoDescription": "Learn about VEAM...",
  "status": "published",
  "parent": "...",
  "disabled": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### GET /pages/manage

**Protected** — Flat list of all pages (draft + published), no `children` field, no `contentHtml`.

Response: Array of page objects.

### GET /pages/manage/:id

**Protected** — Single page by MongoDB ID. Includes `contentHtml` — use this when opening a page in the admin editor.

Response: Single page object (same shape as `GET /pages/:slug`).

### POST /pages

**Protected**

Request:

```json
{
  "slug": "about-veam",
  "title": "About VEAM",
  "contentHtml": "<p>...</p>",
  "seoTitle": "About VEAM | Vietnam Economists Annual Meeting",
  "seoDescription": "Learn about VEAM...",
  "status": "draft",
  "parent": "<parent_page_id>",
  "disabled": false
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | yes | URL-safe, auto-normalised (lowercase, spaces → hyphens) |
| `title` | yes | |
| `contentHtml` | no | Full HTML body |
| `seoTitle` | no | |
| `seoDescription` | no | |
| `status` | no | `"draft"` (default) or `"published"` |
| `parent` | no | Omit for root pages. Provide a page ObjectId to nest under a parent. The API rejects circular references. |
| `disabled` | no | `false` (default). Set `true` for a non-clickable nav group header. |

Response: Created page object.

### PATCH /pages/:id

**Protected** — Update any field except `slug`. Setting `parent` that would create a circular reference returns `400`.

Request: Same fields as POST, all optional.

Response: Updated page object.

### DELETE /pages/:id

**Protected**

Response:

```json
{ "deleted": true }
```

---

## Announcements

`contentHtml` is **excluded** from list endpoints (`GET /announcements` and `GET /announcements/manage`). Fetch it only via `GET /announcements/:slug` or `GET /announcements/manage/:id`.

### GET /announcements

**Public** — Paginated list of published announcements.

Query params:

| Param | Default | Notes |
|-------|---------|-------|
| `page` | `1` | |
| `limit` | `10` | Max 100 |
| `search` | — | Case-insensitive title search |

Response:

```json
{
  "items": [
    {
      "_id": "...",
      "title": "Call for Papers: VEAM 2026",
      "slug": "call-for-papers-veam-2026",
      "excerpt": "Short summary...",
      "description": "Longer plain-text description...",
      "coverImage": "https://...",
      "status": "published",
      "publishedAt": "2025-06-01T00:00:00.000Z",
      "recommend": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

### GET /announcements/:slug

**Public** — Single published announcement with full content.

Response:

```json
{
  "_id": "...",
  "title": "Call for Papers: VEAM 2026",
  "slug": "call-for-papers-veam-2026",
  "excerpt": "Short summary...",
  "description": "Longer plain-text description...",
  "contentHtml": "<p>Full HTML content.</p>",
  "coverImage": "https://...",
  "status": "published",
  "publishedAt": "2025-06-01T00:00:00.000Z",
  "recommend": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### GET /announcements/manage

**Protected** — Paginated list of all announcements (draft + published), no `contentHtml`. Same query params as above.

Response: Same paginated shape as `GET /announcements` but includes drafts.

### GET /announcements/manage/:id

**Protected** — Single announcement by MongoDB ID. Includes `contentHtml` — use this when opening an announcement in the admin editor.

Response: Single announcement object (same shape as `GET /announcements/:slug`).

### POST /announcements

**Protected**

Request:

```json
{
  "title": "Call for Papers: VEAM 2026",
  "slug": "optional-custom-slug",
  "excerpt": "Short summary shown in list views.",
  "description": "Longer plain-text description shown on cards or detail intros.",
  "contentHtml": "<p>Full HTML content.</p>",
  "coverImage": "https://example.com/cover.jpg",
  "status": "draft",
  "publishedAt": "2025-06-01T00:00:00.000Z",
  "recommend": false
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | |
| `slug` | no | Auto-generated from `title` if omitted. Immutable after creation. |
| `excerpt` | no | Short text for list cards |
| `description` | no | Longer plain-text description |
| `contentHtml` | no | Full HTML body |
| `coverImage` | no | Absolute URL |
| `status` | no | `"draft"` (default) or `"published"` |
| `publishedAt` | no | ISO 8601. Auto-set to now when `status=published` and omitted. |
| `recommend` | no | `false` (default). When `true`, the item can be featured on the home page. |

Response: Created announcement object (full, including `contentHtml`).

### PATCH /announcements/:id

**Protected** — Update any field except `slug`. All fields optional.

Response: Updated announcement object.

### DELETE /announcements/:id

**Protected**

Response:

```json
{ "deleted": true }
```

---

## Institutions

Same shape as Announcements but without the `recommend` field.

`contentHtml` is **excluded** from list endpoints. Fetch it only via `GET /institutions/:slug` or `GET /institutions/manage/:id`.

### GET /institutions

**Public** — Paginated list of published institutions.

Query params: same as `/announcements` (`page`, `limit`, `search`).

Response:

```json
{
  "items": [
    {
      "_id": "...",
      "title": "Vietnam National University",
      "slug": "vietnam-national-university",
      "excerpt": "Short summary...",
      "description": "Longer plain-text description...",
      "coverImage": "https://...",
      "status": "published",
      "publishedAt": "2025-01-01T00:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

### GET /institutions/:slug

**Public** — Single published institution with full content.

Response:

```json
{
  "_id": "...",
  "title": "Vietnam National University",
  "slug": "vietnam-national-university",
  "excerpt": "Short summary...",
  "description": "Longer plain-text description...",
  "contentHtml": "<p>Full HTML content.</p>",
  "coverImage": "https://...",
  "status": "published",
  "publishedAt": "2025-01-01T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### GET /institutions/manage

**Protected** — Paginated list of all institutions (draft + published), no `contentHtml`. Same query params as above.

### GET /institutions/manage/:id

**Protected** — Single institution by MongoDB ID. Includes `contentHtml` — use this when opening an institution in the admin editor.

Response: Single institution object (same shape as `GET /institutions/:slug`).

### POST /institutions

**Protected**

Request:

```json
{
  "title": "Vietnam National University",
  "slug": "optional-custom-slug",
  "excerpt": "Short summary.",
  "description": "Longer plain-text description.",
  "contentHtml": "<p>Full HTML content.</p>",
  "coverImage": "https://example.com/cover.jpg",
  "status": "draft",
  "publishedAt": "2025-01-01T00:00:00.000Z"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | |
| `slug` | no | Auto-generated from `title` if omitted. Immutable after creation. |
| `excerpt` | no | Short text for list cards |
| `description` | no | Longer plain-text description |
| `contentHtml` | no | Full HTML body |
| `coverImage` | no | Absolute URL |
| `status` | no | `"draft"` (default) or `"published"` |
| `publishedAt` | no | ISO 8601. Auto-set to now when `status=published` and omitted. |

Response: Created institution object (full, including `contentHtml`).

### PATCH /institutions/:id

**Protected** — Update any field except `slug`. All fields optional.

Response: Updated institution object.

### DELETE /institutions/:id

**Protected**

Response:

```json
{ "deleted": true }
```

---

## Settings

A single site-wide settings document (upserted — always one record).

### GET /settings

**Public**

Response:

```json
{
  "_id": "...",
  "siteName": "VEAM",
  "activeTheme": "modern",
  "heroSlides": [
    {
      "type": "text",
      "badge": "VEAM 2026",
      "title": "Vietnam Economists Annual Meeting",
      "subtitle": "...",
      "ctaLabel": "Register Now",
      "ctaUrl": "/registration"
    },
    {
      "type": "image",
      "imageUrl": "https://...",
      "title": "...",
      "ctaLabel": "Learn More",
      "ctaUrl": "/about"
    }
  ],
  "navItems": [
    {
      "label": "About",
      "href": "/about",
      "enabled": true,
      "children": [
        { "label": "About VEAM", "href": "/about-veam", "enabled": true }
      ]
    }
  ],
  "featuredAnnouncements": ["<announcement_id>"],
  "socialLinks": {
    "facebook": "https://facebook.com/...",
    "twitter": "https://twitter.com/...",
    "linkedin": "https://linkedin.com/...",
    "youtube": "https://youtube.com/..."
  },
  "contactInfo": {
    "email": "veam@depocen.org",
    "phone": "(84 24) 39351419",
    "address": "...",
    "businessHours": "8:00 AM – 6:00 PM"
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

### PATCH /settings

**Protected** — Partial update. All fields optional.

Request:

```json
{
  "siteName": "VEAM",
  "activeTheme": "modern",
  "heroSlides": [...],
  "navItems": [...],
  "featuredAnnouncements": ["<id>"],
  "socialLinks": { "facebook": "https://..." },
  "contactInfo": { "email": "veam@depocen.org" }
}
```

`heroSlide` fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `type` | `"text" \| "image"` | yes | |
| `badge` | string | no | Small label above title |
| `title` | string | yes | |
| `subtitle` | string | no | |
| `imageUrl` | string | no | Required when `type: "image"` |
| `ctaLabel` | string | no | Button label |
| `ctaUrl` | string | no | Button link |

Response: Updated settings object.

---

## Uploads

### POST /uploads

**Protected** — Upload an image file.

Request: `multipart/form-data` with field `file`.

Accepted types: `image/jpeg`, `image/png`, `image/webp`, `image/gif` — max **5 MB**.

Response:

```json
{
  "url": "/uploads/1707234567890-abc123def456.jpg",
  "filename": "1707234567890-abc123def456.jpg",
  "size": 204800,
  "mimetype": "image/jpeg"
}
```

The `url` is a relative path served statically by the backend. Prepend the base host to use as `<img src>`.

---

## Common Response Shape

All responses are wrapped by a global `ResponseInterceptor`:

```json
{
  "statusCode": 200,
  "data": { ... }
}
```

Errors follow:

```json
{
  "statusCode": 404,
  "message": "Page \"about-xyz\" not found",
  "error": "Not Found"
}
```
