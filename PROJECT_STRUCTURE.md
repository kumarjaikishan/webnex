# Webnex Labs CRM — Technical Architecture & Reference Guide

## 🚀 Overview & Branding
- **Brand Name**: **Webnex Labs**
- **Type**: Web Development Studio & Admin CRM Application (Invoices, Agreements, Welcome Notes, Payment Reminders, Portfolio, Maintenance tracking)
- **Stack**: 
  - **Frontend**: React (Vite), React Router, TailwindCSS, Axios
  - **Backend**: Node.js, Express, Mongoose (MongoDB Atlas cloud integration with fallback to local JSON DB), JWT Auth, Bcrypt

---

## 📁 Directory & File Map

```
devfolio-crm/
├── PROJECT_STRUCTURE.md          # Primary developer reference & AI context
├── README.md                     # Project overview
├── backend/
│   ├── .env                      # DB URI (db=mongodb+srv://...), JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
│   ├── server.js                 # Express server & API route mounts
│   ├── package.json              # Backend dependencies (express, mongoose, bcryptjs, jsonwebtoken, etc.)
│   ├── data/
│   │   └── db.json               # JSON database (fallback storage)
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization (Admin vs Client)
│   ├── routes/
│   │   ├── auth.js               # Login (/api/auth/login) & Me (/api/auth/me)
│   │   ├── invoices.js           # Admin Invoice CRUD (/api/invoices)
│   │   ├── contracts.js          # Agreements & Contracts CRUD (/api/contracts)
│   │   ├── reminders.js          # Payment & Milestone Reminders (/api/reminders)
│   │   ├── notes.js              # Notes & Cards (/api/notes)
│   │   ├── clients.js            # Client CRM Management (/api/clients)
│   │   ├── maintenance.js        # Site Maintenance Plans (/api/maintenance)
│   │   ├── projects.js           # Portfolio Projects (/api/projects)
│   │   └── contact.js            # Public Contact Form Submissions (/api/contact)
│   └── utils/
│       ├── db.js                 # Database Layer (MongoDB Mongoose + JSON DB Sync)
│       └── seed.js               # DB Seeding Script (`npm run seed`)
│
└── frontend/
    ├── index.html                # Entry HTML (Webnex Labs Title & Meta)
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js        # Design tokens & color palette
    └── src/
        ├── App.jsx               # Route Definitions & Main Layout
        ├── main.jsx              # Entry point
        ├── api/
        │   └── client.js         # Axios API Client with Auth Interceptor
        ├── context/
        │   └── AuthContext.jsx   # Auth State, Login, Logout, JWT management
        ├── components/
        │   ├── Navbar.jsx        # Webnex Labs navigation header
        │   ├── Footer.jsx        # Footer with brand & quick links
        │   ├── ProtectedRoute.jsx# Auth Guard (Admin/Client roles)
        │   ├── ProjectCard.jsx   # Portfolio item component
        │   ├── Marquee.jsx       # Tech stack marquee banner
        │   ├── StatCounter.jsx   # Animated count-up component
        │   └── Testimonials.jsx  # Client review carousel
        └── pages/
            ├── Home.jsx          # Public Landing Page
            ├── Work.jsx          # Public Portfolio Page
            ├── About.jsx         # Studio About Page
            ├── Contact.jsx       # Contact & Quote Form
            ├── Login.jsx         # Admin & Client Login (with 1-click Quick Admin Fill)
            ├── admin/
            │   ├── AdminLayout.jsx # Admin Dashboard Navigation Bar & Container
            │   ├── Overview.jsx    # Analytics & Summary Widgets
            │   ├── Clients.jsx     # Client List & Onboarding Modal
            │   ├── ClientDetail.jsx# Individual Client File & Portal Link
            │   ├── Invoices.jsx    # 🧾 Invoice Generator & Printable PDF Modal
            │   ├── Contracts.jsx   # 📄 Client Agreement Builder & Status Tracker
            │   ├── WelcomeNotes.jsx# 💌 Client Onboarding Welcome Letter Builder
            │   ├── Reminders.jsx   # 🔔 1-Click Payment Reminders Dashboard
            │   ├── Notes.jsx       # 📝 General Notes & Cards
            │   ├── Maintenance.jsx # 🛠️ Client Maintenance Subscriptions
            │   └── Projects.jsx    # 🚀 Admin Portfolio Manager
            └── client/
                ├── ClientLayout.jsx # Client Portal Frame
                └── ClientOverview.jsx# Client Dashboard (Invoices, Documents, Scope)
```

---

## 🔑 Database & Credentials Configured in `.env`

- **Database Connection**: Configured in `backend/.env` via `db = mongodb+srv://...`
- **Admin Email**: `jai@gmail.com`
- **Admin Password**: `Jai@4880`
- **Port**: `5000`
- **Client App URL**: `http://localhost:5173`

---

## 🛠️ Admin CRM Features & Usage

1. **Admin Login**:
   - Navigate to `/login`.
   - Use admin credentials `jai@gmail.com` / `Jai@4880` or click **"🔑 Fill Admin Credentials"**.
   - Authenticates via JWT token saved to `localStorage.getItem("devfolio_token")`.

2. **Invoice Generation (`/admin/invoices`)**:
   - Create custom invoices with line items, tax percentage, due dates, and terms.
   - Includes full **View / Print** printable PDF invoice modal (`window.print()`).
   - Change invoice status to **Paid**, **Pending**, or **Overdue**.

3. **Welcome Notes (`/admin/welcome-notes`)**:
   - Generate customizable client onboarding letters.
   - Live preview, 1-click copy text to clipboard, and save directly to CRM notes DB.

4. **Agreements & Contracts (`/admin/contracts`)**:
   - Draft legal service agreements, set contract values, and assign to clients.
   - Track signature lifecycle (`draft` → `sent` → `signed` → `active`).

5. **Payment Reminders (`/admin/reminders`)**:
   - Manage payment milestone reminders.
   - Highlight overdue/pending invoices with 1-click notification trigger.

---

## ⚡ How to Run Development Servers

- **Start Backend**: `cd backend && npm run dev` (Runs on `http://localhost:5000`)
- **Start Frontend**: `cd frontend && npm run dev` (Runs on `http://localhost:5173`)
- **Seed Database**: `cd backend && npm run seed`
