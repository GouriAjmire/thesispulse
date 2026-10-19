# ThesisPulse

Research mentoring site for medical residents: React frontend, Spring Boot REST API, PostgreSQL in Docker.

It combines the one-page conversion flow of the ThesisRx site (problem, services, process, specialties, FAQs, enquiry CTA)
with the editorial structure of the MedThesis site (top contact bar, blog with categories, recent posts, archives,
newsletter, downloadable formats). Layout, copy, name and visual style are all original.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, react-markdown (plain CSS, no UI kit) |
| Backend | Spring Boot 3.3, Java 21, Spring Data JPA, Spring Security (HTTP Basic for `/api/admin/**`), Flyway |
| Database | PostgreSQL 16 (Docker image `postgres:16-alpine`) |
| Serving | nginx serves the built React app and proxies `/api` to the backend |

## Quick start (everything in Docker)

```bash
cp .env.example .env        # then edit the passwords
docker compose up --build
```

- Site: http://localhost:3000
- API: http://localhost:8080/api/posts
- Admin dashboard: http://localhost:3000/admin (use `ADMIN_USER` / `ADMIN_PASSWORD` from `.env`)

The database schema and starter content (services, FAQs, specialties, six blog posts) are created automatically by
Flyway migrations on first start.

Contact-form submissions are emailed to `gouriajmire@gmail.com` using SMTP. Configure `SMTP_USERNAME`,
`SMTP_PASSWORD` and `SMTP_FROM` in `.env` before starting the stack; for Gmail, use an app password and set
`SMTP_FROM` to the authenticated account address. The form requires a valid email and an international phone number
with country code (pre-filled with `+91`).

## Local development

```bash
cp .env.example .env
docker compose up -d db                     # Postgres on 127.0.0.1:5432

cd backend
export ADMIN_PASSWORD=choose-one            # required, there is no default
export DB_PASSWORD=<POSTGRES_PASSWORD from .env>
mvn spring-boot:run                         # API on :8080

cd ../frontend
npm install
npm run dev                                 # site on :5173, /api proxied to :8080
```

## Pages

| Route | Inspired by | What it does |
|---|---|---|
| `/` | ThesisRx | Hero, problems, services, process, specialties, promises, latest posts, FAQ, CTA |
| `/services` | ThesisRx | Six services with included features and an "Enquire" button per service |
| `/blog`, `/blog/:slug` | MedThesis | Category pages with breadcrumb banner, search, pagination, archives, recent posts, newsletter |
| `/formats` | MedThesis | Downloadable synopsis and thesis outlines (files in `frontend/public/downloads`) |
| `/about`, `/faq` | both | Story, principles, accordion FAQ |
| `/contact` | both | Enquiry form saved to the database |
| `/reviews` | n/a | Read public reviews and submit a review |
| `/admin` | n/a | Sign in, triage enquiries, write/edit/delete posts, view subscribers |

## REST API

Public:

| Method | Path | Notes |
|---|---|---|
| GET | `/api/services`, `/api/faqs`, `/api/specialties`, `/api/resources` | Site content |
| GET | `/api/categories` | With published post counts |
| GET | `/api/posts?category=&q=&year=&month=&page=&size=` | Paged search |
| GET | `/api/posts/recent?limit=3`, `/api/posts/archives`, `/api/posts/{slug}` | |
| POST | `/api/enquiries` | Validated; stored with status `NEW` |
| POST | `/api/subscribers` | Idempotent |
| GET, POST | `/api/reviews` | List reviews and submit a validated review; new reviews are immediately public |

Admin (HTTP Basic): `GET /api/admin/stats`, `GET|POST /api/admin/posts`, `PUT|DELETE /api/admin/posts/{id}`,
`GET /api/admin/enquiries`, `PATCH /api/admin/enquiries/{id}/status`, `GET /api/admin/subscribers`.

## Before you go live

1. **Replace placeholder details** in `frontend/src/siteConfig.js` (email, phone, WhatsApp, hours).
2. **Review all copy for accuracy.** The text makes no claims about your team's qualifications or results; add only
   what is true for your business. The FAQ also tells clients to follow their institution's integrity policy. Keep that.
3. **Use HTTPS.** Admin login uses HTTP Basic, which is only safe over TLS. Put the stack behind a TLS-terminating
   proxy (Caddy, Traefik, a cloud load balancer). For a larger team, swap in JWT or OAuth.
4. **Do not publish port 5432** (it is bound to localhost only in `docker-compose.yml`) and use strong passwords.
5. **Configure SMTP credentials** in `.env` before accepting contact enquiries. The contact form reports an error
instead of claiming success if the email notification cannot be sent.

## Project layout

```
thesispulse/
  docker-compose.yml  .env.example
  backend/   pom.xml  Dockerfile
    src/main/java/com/thesispulse/{config,domain,repo,service,web}
    src/main/resources/{application.yml, db/migration/V1__schema.sql, V2__seed.sql, V3__reviews.sql}
  frontend/  package.json  vite.config.js  Dockerfile  nginx.conf
    src/{api.js, siteConfig.js, styles.css, components/, pages/}
    public/downloads/
```

## Build status note

This project was generated in an environment without access to Maven Central or the npm registry, so it has **not been
compiled or run yet**. Java and JSX syntax were checked with `javac` and `tsc` parsers only. Run
`docker compose up --build` and fix anything that surfaces; please report errors and they can be sorted quickly.
