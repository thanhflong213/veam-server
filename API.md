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

**Protected**

Returns the profile of the currently logged-in admin.

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

Pages power the nav menu. `GET /pages` returns a tree: root pages (no `parent`) each include a `children` array of their child pages. Pages with `disabled: true` appear in the nav but are not navigable — they are group headers.

### GET /pages

**Public** — Used to build the nav menu.

Response:

```json
[
  {
    "_id": "...",
    "slug": "about",
    "title": "About",
    "contentHtml": "",
    "seoTitle": "",
    "seoDescription": "",
    "status": "published",
    "parent": null,
    "disabled": true,
    "createdAt": "...",
    "updatedAt": "...",
    "children": [
      {
        "_id": "...",
        "slug": "about-veam",
        "title": "About VEAM",
        "parent": "<parent_id>",
        "disabled": false,
        ...
      }
    ]
  }
]
```

### GET /pages/:slug

**Public** — Fetch a single page's content. Returns 404 if the page is disabled or not published.

Response: Single page object (no `children` field).

### GET /pages/manage

**Protected** — List all pages (draft + published) for the admin UI.

Response: Array of page objects (flat, no `children`).

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
  "parent": "<parent_page_id_or_omit>",
  "disabled": false
}
```

- `slug` — required, URL-safe, auto-normalised (lowercased, spaces → hyphens).
- `parent` — omit for root-level pages; provide a page ObjectId to nest under a parent.
- `disabled` — set `true` to make this a non-clickable group header in the nav.

Response: Created page object.

### PATCH /pages/:id

**Protected** — Update any field except `slug`.

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
  "data": [
    {
      "_id": "...",
      "title": "Call for Papers: VEAM 2026",
      "slug": "call-for-papers-veam-2026",
      "excerpt": "Short summary...",
      "contentHtml": "<p>...</p>",
      "coverImage": "https://...",
      "status": "published",
      "publishedAt": "2025-06-01T00:00:00.000Z",
      " ": false,
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

**Public** — Single published announcement.

Response: Single announcement object.

### GET /announcements/manage

**Protected** — Paginated list of all announcements (draft + published). Same query params as above.

### POST /announcements

**Protected**

Request:

```json
{
  "title": "Call for Papers: VEAM 2026",
  "slug": "optional-custom-slug",
  "excerpt": "Short summary shown in list views.",
  "contentHtml": "<p>Full HTML content.</p>",
  "coverImage": "https://example.com/cover.jpg",
  "status": "draft",
  "publishedAt": "2025-06-01T00:00:00.000Z",
  "recommend": false
}
```

- `slug` — auto-generated from `title` if omitted.
- `publishedAt` — auto-set to now when `status` is `"published"` and this field is omitted.
- `recommend` — when `true`, the announcement can be featured/highlighted on the client.

Response: Created announcement object.

### PATCH /announcements/:id

**Protected** — Update any field except `slug`.

Request: Same fields as POST, all optional.

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

### GET /institutions

**Public** — Paginated list of published institutions.

Query params: same as `/announcements` (`page`, `limit`, `search`).

Response:

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Vietnam National University",
      "slug": "vietnam-national-university",
      "excerpt": "...",
      "contentHtml": "<p>...</p>",
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

**Public** — Single published institution.

### GET /institutions/manage

**Protected** — All institutions (draft + published).

### POST /institutions

**Protected**

Request:

```json
{
  "title": "Vietnam National University",
  "slug": "optional-custom-slug",
  "excerpt": "Short summary.",
  "contentHtml": "<p>Full HTML content.</p>",
  "coverImage": "https://example.com/cover.jpg",
  "status": "draft",
  "publishedAt": "2025-01-01T00:00:00.000Z"
}
```

Response: Created institution object.

### PATCH /institutions/:id

**Protected** — Update any field except `slug`.

### DELETE /institutions/:id

**Protected** → `{ "deleted": true }`

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

The `url` is a relative path served statically by the backend. Prepend the base host to use it as `<img src>`.

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
