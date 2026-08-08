# Lumix Digital — Website Development Company Platform

A production-ready MERN monorepo for **Lumix Digital**, a website development company based in
Bihar Sharif, Nalanda. Built with React + Vite + TypeScript + Tailwind on the frontend and
Express + MongoDB (Mongoose) on the backend.

## What's in this first pass

- **Full route scaffold** — every page from the brief (Home, Services, Portfolio, Case Studies,
  Testimonials, Pricing, About, Blog, FAQs, Contact, Privacy, Terms) exists and renders.
- **Home page fully built** — hero with animated mockup, stats counter, services grid, why-choose-us,
  process timeline, featured projects, testimonials slider, pricing preview, FAQ preview, CTA section,
  plus an exit-intent popup and floating WhatsApp/Call/Back-to-top buttons.
- **Other pages** are built with real layouts and real data (not lorem ipsum), just less densely
  designed than Home — a good base to expand page-by-page.
- **Backend** — Express API with Mongoose models for Testimonials, Projects, Blog Posts, FAQs,
  Services and Leads, a generic CRUD factory for the content models, and a `/api/leads` endpoint
  wired to the Contact form.
- **SEO** — meta tags, Open Graph, Twitter cards, LocalBusiness JSON-LD schema, `robots.txt` and
  `sitemap.xml`.
- **Verified build** — both `frontend` and `backend` type-check and build cleanly
  (`tsc -b` and `vite build` / `tsc`) as of this delivery.

## Project structure

```
lumix-digital/
├── frontend/                 React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/       Navbar, Footer, floating actions, home/* sections
│   │   ├── pages/            One file per route
│   │   ├── data/             Mock content (mirrors the backend content models)
│   │   ├── hooks/            useScrollReveal, useCounter
│   │   ├── lib/               api client, icon map
│   │   └── types/            Shared TS interfaces
│   └── public/                robots.txt, sitemap.xml
├── backend/                  Express + Mongoose (TypeScript)
│   └── src/
│       ├── models/            Testimonial, Project, BlogPost, FAQ, Service, Lead
│       ├── controllers/       Generic CRUD factory + lead controller
│       ├── routes/            /api/leads, /api/testimonials, /api/projects, /api/blog, /api/faqs, /api/services
│       ├── config/db.ts       MongoDB Atlas connection
│       └── seed.ts            Seeds sample content into MongoDB
└── README.md                  You are here
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and paste your MongoDB Atlas connection string into MONGO_URI
npm run seed      # optional — populates sample services/testimonials/projects/faqs
npm run dev       # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev             # starts the site on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so the frontend and backend talk to
each other automatically in development.

### 3. Production build

```bash
cd frontend && npm run build   # outputs to frontend/dist
cd backend  && npm run build   # compiles TypeScript to backend/dist
```

## MongoDB Atlas setup (since you chose Atlas)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, allow your IP (or `0.0.0.0/0` for development).
4. Under **Database → Connect → Drivers**, copy the connection string and paste it into
   `backend/.env` as `MONGO_URI`, replacing `<username>`, `<password>`, and `<cluster-url>`.

## What's next (suggested order)

1. Wire the remaining pages (Portfolio, Case Studies, Pricing, About, Blog) to fetch from the
   backend API instead of the local `data/` files, the same way `Contact.tsx` already posts leads.
2. Replace placeholder phone/WhatsApp numbers and social links in `Navbar`, `Footer`, and
   `FloatingActions` with real business details.
3. Add real project/testimonial photos to `frontend/public` and swap the placeholder `/projects/*`
   and `/avatars/*` image paths.
4. Deploy the backend (Render/Railway/EC2) and frontend (Vercel/Netlify), then update
   `VITE_API_URL` and `CORS_ORIGIN` to the live URLs.
5. Register the real domain, update `index.html` canonical/OG URLs and `public/sitemap.xml`
   accordingly, and submit the sitemap to Google Search Console.

## Tech stack

React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · Lucide Icons · React Hook Form + Zod ·
TanStack Query · React Router · Express · Mongoose · MongoDB Atlas
