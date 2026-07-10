# InvoiceNaija

> Professional invoice management built for Nigerian freelancers and small businesses.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Author](#author)

---

## Overview

Most Nigerian freelancers — designers, developers, photographers, event planners — send invoices as WhatsApp screenshots or manually typed Word documents. They have zero visibility into who has paid, who owes them, and how much they've earned.

**InvoiceNaija** fixes that.

It is a lightweight multi-user SaaS platform where any freelancer can sign up, manage clients, create professional invoices, track payment status, and download branded PDF invoices — all in one place, for free.

---

## Features

- **Authentication** — Secure register, login, and logout with JWT. Forgot/reset password via email.
- **Client Management** — Add, edit, and delete clients. All scoped privately per user.
- **Invoice CRUD** — Create invoices with multiple line items. Edit, delete, and download as PDF.
- **Live Totals** — Line item totals auto-calculate as you type. No manual math.
- **Invoice Status** — Track every invoice through `Draft → Sent → Paid → Overdue`.
- **PDF Generation** — Download professional branded invoices with your business name and bank details.
- **Earnings Dashboard** — See total earnings, paid invoices count, and unpaid invoices at a glance.
- **Settings** — Update profile, business name, and bank details shown on invoice PDFs.
- **Landing Page** — Public-facing landing page with features, how it works, testimonials, and FAQ.
- **Fully Responsive** — Works on mobile, tablet, and desktop.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| Context API | Global auth state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens | Authentication |
| Bcrypt | Password hashing |
| PDFKit | Invoice PDF generation |
| Resend | Password reset emails |

---

## Architecture

```
User / Browser
      │
      │  HTTPS
      ▼
Vercel — Frontend (React + Vite + TypeScript + Tailwind)
      │
      │  REST API
      ▼
Render — Backend (Node.js + Express + TypeScript)
      │
      ├─────────────────────┬──────────────────────┐
      │                     │                      │
      ▼                     ▼                      ▼
MongoDB Atlas          PDFKit                  Resend
Users · Clients    Invoice PDF gen        Password reset
Invoices
```

**Request flow:**

```
Client makes API request
  → Axios attaches JWT from localStorage (interceptor)
    → Express receives request
      → protect middleware verifies JWT
        → req.user attached from DB
          → Controller runs business logic
            → Mongoose queries MongoDB Atlas
              → Response returned to client
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Resend account and API key (free tier — 3,000 emails/month)

### 1. Clone the repository

```bash
git clone https://github.com/Jafarscript/invoice-naija.git
cd invoice-naija
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

The server will be running on `http://localhost:8080`

### 3. Setup the frontend

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server runs on | `8080` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_super_secret` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |
| `FRONTEND_URL` | Frontend URL for reset link in emails | `http://localhost:5173` |

> **Never commit your `.env` file to GitHub.** It is included in `.gitignore` by default.

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new account |
| POST | `/login` | Public | Login and receive JWT |
| POST | `/forgot-password` | Public | Request password reset email |
| POST | `/reset-password` | Public | Reset password with token |

### Client Routes — `/api/clients`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Create a new client |
| GET | `/` | Protected | Get all clients for logged in user |
| GET | `/:id` | Protected | Get a single client |
| PUT | `/:id` | Protected | Update a client |
| DELETE | `/:id` | Protected | Delete a client |

### Invoice Routes — `/api/invoices`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Create a new invoice |
| GET | `/` | Protected | Get all invoices for logged in user |
| GET | `/:id` | Protected | Get a single invoice |
| PUT | `/:id` | Protected | Update invoice (line items, due date, notes) |
| PATCH | `/:id/status` | Protected | Update invoice status only |
| DELETE | `/:id` | Protected | Delete an invoice |
| GET | `/:id/pdf` | Protected | Download invoice as PDF |

### User Routes — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/me` | Protected | Get current user profile |
| PUT | `/me` | Protected | Update profile and bank details |

> All **Protected** routes require a `Bearer` token in the `Authorization` header.

---

## Project Structure

```
invoice-naija/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts               # MongoDB connection
│   │   │   └── email.ts            # Resend email service
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Register, login, forgot/reset password
│   │   │   ├── clientController.ts # Client CRUD
│   │   │   ├── invoiceController.ts# Invoice CRUD + status
│   │   │   ├── pdfController.ts    # PDF generation
│   │   │   └── userController.ts   # Profile + settings
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT protect middleware
│   │   ├── models/
│   │   │   ├── User.ts             # User schema + bank details
│   │   │   ├── Client.ts           # Client schema (scoped per user)
│   │   │   └── Invoice.ts          # Invoice schema + line items
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── clientRoutes.ts
│   │   │   ├── invoiceRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── types/
│   │   │   └── express.d.ts        # AuthRequest interface
│   │   └── index.ts                # Express entry point
│   ├── .env                        # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.ts            # Axios instance with JWT interceptor
    │   ├── components/
    │   │   ├── Sidebar.tsx         # Responsive sidebar with mobile drawer
    │   │   └── Layout.tsx          # Wraps all protected pages
    │   ├── context/
    │   │   └── AuthContext.tsx     # Global auth state + login/logout
    │   ├── pages/
    │   │   ├── landing/
    │   │   │   └── Landing.tsx     # Public landing page
    │   │   ├── auth/
    │   │   │   ├── Login.tsx
    │   │   │   ├── Register.tsx
    │   │   │   ├── ForgotPassword.tsx
    │   │   │   └── ResetPassword.tsx
    │   │   ├── dashboard/
    │   │   │   └── Dashboard.tsx   # Stats + recent invoices table
    │   │   ├── clients/
    │   │   │   └── Clients.tsx     # Client list, create, edit, delete
    │   │   ├── invoices/
    │   │   │   ├── Invoices.tsx    # Invoice list, status update, delete
    │   │   │   ├── CreateInvoice.tsx # Invoice form with live totals
    │   │   │   └── EditInvoice.tsx # Edit existing invoice
    │   │   └── settings/
    │   │       └── Settings.tsx    # Profile + bank details
    │   ├── types/
    │   │   └── index.ts            # TypeScript interfaces
    │   ├── App.tsx                 # Routes + protected route logic
    │   └── main.tsx                # React entry point
    ├── .gitignore
    ├── package.json
    └── vite.config.ts
```

---

## Deployment

### Backend — Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
5. Add all environment variables from `server/.env` in the Render dashboard
6. Deploy

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Set the **Root Directory** to `client`
3. Add this environment variable:
   - `VITE_API_URL=https://your-render-backend-url.onrender.com/api`
4. Deploy

> After deploying, update `FRONTEND_URL` in your Render environment variables to your live Vercel URL.

---

## Author

**Jafar Lihammed** — Full Stack Developer

- GitHub: [@Jafarscript](https://github.com/Jafarscript)
- LinkedIn: [jafar-li-hammed](https://linkedin.com/in/jafar-li-hammed)
- Email: lihammedjafar@gmail.com

---

## License

This project is licensed under the MIT License.

---

> Built with ❤️ in Lagos, Nigeria 🇳🇬