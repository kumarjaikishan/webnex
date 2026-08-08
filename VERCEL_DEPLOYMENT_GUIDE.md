# 🚀 Webnex Labs — Vercel Deployment Guide

This project is pre-configured for 1-click full-stack deployment on **Vercel** (both Frontend React App + Backend Express API as Serverless Functions).

---

## 📁 Key Vercel Files Configured

1. **`vercel.json`**: Root routing configuration. Automatically routes `/api/*` to backend serverless function and `/*` to Vite React SPA.
2. **`api/index.js`**: Serverless function handler wrapping Express backend.
3. **`package.json`**: Root script definitions for Vercel build pipeline.
4. **`frontend/src/api/client.js`**: Environment-aware API client (uses local `http://localhost:5000/api` in dev, relative `/api` on Vercel).

---

## 🛠️ Step-by-Step Vercel Deployment

### Option A: Deploy via Vercel Web Dashboard (Recommended)

1. Push your code to a **GitHub / GitLab / Bitbucket** repository.
2. Log into [Vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
3. Import your **`webnex-labs-crm`** repository.
4. Set the **Environment Variables** in Vercel project settings:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `db` | `mongodb+srv://jai:Jai%404880@cluster0.4ntduoo.mongodb.net/portfolio?retryWrites=true&w=majority` | Your MongoDB URI |
   | `JWT_SECRET` | `change_this_to_a_long_random_string` | Random JWT secret key |
   | `ADMIN_EMAIL` | `jai@gmail.com` | Admin login email |
   | `ADMIN_PASSWORD` | `Jai@4880` | Admin login password |

5. Click **"Deploy"**. Vercel will automatically build the frontend bundle and serverless API functions!

---

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI (if not installed):
   ```bash
   npm i -g vercel
   ```
2. Run in the root directory:
   ```bash
   vercel
   ```
3. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🔍 Verification After Deployment

- **Public Site**: `https://<your-project>.vercel.app`
- **Backend Health Check**: `https://<your-project>.vercel.app/api/health`
- **Admin Portal**: `https://<your-project>.vercel.app/login` (`jai@gmail.com` / `Jai@4880`)
