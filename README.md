# 🛒 WP Ecommerce — Next.js + WooCommerce

A full-stack ecommerce storefront built with **Next.js 16**, **WooCommerce REST API**, **MUI**, and **NextAuth.js**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 + SCSS + MUI v7 |
| Auth | NextAuth.js v4 (JWT + WooCommerce JWT) |
| State | Redux Toolkit + Zustand + React Context |
| Forms | React Hook Form + Joi validation |
| HTTP | Axios |
| Backend | WordPress + WooCommerce REST API (wc/v3) |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # REST API handlers (auth, cart, checkout, user)
│   ├── products/         # Product listing & detail pages
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout page
│   └── dashboard/        # User dashboard (profile, orders, password)
├── components/           # Reusable UI components
├── context/              # CartContext
├── hooks/                # useProducts, useProduct
├── lib/                  # WooCommerce client, auth config, validation
├── store/                # Redux store & slices
├── styles/               # globals.scss
└── types/                # TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- WordPress with WooCommerce installed and REST API enabled
- [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) plugin
- [BD Better Password Reset](https://wordpress.org/plugins/bdvs-password-reset/) plugin (for password reset)

### 1. Clone & Install

```bash
git clone <repo-url>
cd wp-ecommerce-nextjs
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
# WooCommerce API
WOOCOMMERCE_URL=http://localhost/your-wp-site
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# JWT
JWT_SECRET=<your-jwt-secret>
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
```

---

## Features

- 🛍️ Product listing with search, sort & pagination
- 🔍 Product detail page with variations & attributes
- 🛒 Cart management (add, remove, update quantity)
- 💳 Checkout with form validation
- 🔐 Authentication (login, register, forgot/reset password)
- 👤 User dashboard (profile, orders, change password)
- 🎨 MUI + Tailwind CSS + SCSS styling
- ⚡ Turbopack for fast dev builds
- 🔒 JWT-based session management

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset password with code |
| GET/PUT | `/api/user/profile` | Get / update profile |
| POST | `/api/user/change-password` | Change password |
| GET | `/api/user/orders` | Get user orders |
| GET/POST/DELETE | `/api/cart` | Cart operations |
| POST | `/api/checkout` | Place order |
| GET | `/api/products` | List products |
| GET | `/api/products/[slug]` | Get product by slug |

---

## Deployment

```bash
npm run build
npm run start
```

For cloud deployment, set all environment variables on your hosting platform and ensure your WordPress instance is publicly accessible.
