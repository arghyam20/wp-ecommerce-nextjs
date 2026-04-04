# 🛒 WP Ecommerce — Next.js + WooCommerce

A full-stack ecommerce storefront built with **Next.js 16**, **WooCommerce REST API**, **MUI**, and **NextAuth.js**.

---

## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)      |
| Styling    | Tailwind CSS v4 + SCSS + MUI v7         |
| Auth       | NextAuth.js v4 (JWT + WooCommerce JWT)  |
| State      | Redux Toolkit + Zustand + React Context |
| Forms      | React Hook Form + Joi validation        |
| HTTP       | Axios                                   |
| Backend    | WordPress + WooCommerce REST API (wc/v3)|
| Formatting | Prettier + ESLint                       |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages & API routes
│   ├── api/                    # REST API handlers
│   ├── about/                  # About Us page
│   ├── cart/                   # Cart page
│   ├── checkout/               # Checkout page
│   ├── contact/                # Contact page
│   ├── dashboard/              # My Account (auth protected)
│   │   ├── addresses/          # Billing & Shipping addresses
│   │   ├── change-password/    # Change password
│   │   ├── orders/             # Order list + [id] detail
│   │   └── profile/            # Account details
│   ├── forgot-password/        # Forgot password
│   ├── login/                  # Sign in
│   ├── order-confirmation/     # Order success
│   ├── privacy/                # Privacy Policy
│   ├── products/               # Shop + [slug] detail
│   ├── reset-password/         # Reset password
│   ├── signup/                 # Register
│   ├── terms/                  # Terms & Conditions
│   ├── wishlist/               # Wishlist
│   ├── not-found.tsx           # 404 page
│   ├── loading.tsx             # Global loading bar
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── sitemap.ts              # Dynamic sitemap
│   └── robots.ts               # Robots.txt
├── components/
│   ├── checkout/
│   │   └── CheckoutForm.tsx
│   ├── common/
│   │   ├── DashboardLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── MiniCart.tsx
│   │   └── Navbar.tsx
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductDetails.tsx
│       └── ProductGrid.tsx
├── context/
│   └── CartContext.tsx
├── hooks/
│   └── useProducts.ts
├── lib/
│   ├── validation/
│   │   ├── schemas.ts
│   │   └── validate.ts
│   ├── woocommerce/
│   │   ├── client.ts
│   │   └── products.ts
│   └── auth.ts
├── store/
│   ├── cartSlice.ts
│   ├── wishlistSlice.ts
│   └── index.ts
├── styles/
│   └── globals.scss
└── types/
    └── index.ts
```

---

## Pages Reference

### Public Pages

| Route | File | Type | Components Used |
|---|---|---|---|
| `/` | `app/page.tsx` | Server ISR | `Layout`, `ProductGrid` |
| `/products` | `app/products/page.tsx` | Server ISR | `Layout`, `ProductGrid`, `ProductsFilters`, `ProductsPagination` |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | Server ISR + Static | `Layout`, `ProductDetails`, `ProductGrid` (related) |
| `/about` | `app/about/page.tsx` | Server | `Layout`, `AboutValues` |
| `/contact` | `app/contact/contact-client.tsx` | Client | `Layout` |
| `/privacy` | `app/privacy/page.tsx` | Server | `Layout` |
| `/terms` | `app/terms/page.tsx` | Server | `Layout` |
| `*` | `app/not-found.tsx` | Server | `Layout` |

### Cart & Checkout

| Route | File | Type | Components Used |
|---|---|---|---|
| `/cart` | `app/cart/cart-client.tsx` | Client | `Layout` |
| `/checkout` | `app/checkout/checkout-client.tsx` | Client | `Layout`, `CheckoutForm` |
| `/order-confirmation` | `app/order-confirmation/page.tsx` | Server | `Layout` |
| `/wishlist` | `app/wishlist/wishlist-client.tsx` | Client | `Layout` |

### Auth Pages

| Route | File | Type | Components Used |
|---|---|---|---|
| `/login` | `app/login/login-client.tsx` | Client | `Layout` |
| `/signup` | `app/signup/signup-client.tsx` | Client | `Layout` |
| `/forgot-password` | `app/forgot-password/forgot-password-client.tsx` | Client | `Layout` |
| `/reset-password` | `app/reset-password/reset-password-client.tsx` | Client | `Layout` |

### My Account (Auth Protected)

| Route | File | Type | Components Used |
|---|---|---|---|
| `/dashboard` | `app/dashboard/dashboard-client.tsx` | Client | `DashboardLayout` |
| `/dashboard/orders` | `app/dashboard/orders/orders-client.tsx` | Client | `DashboardLayout` |
| `/dashboard/orders/[id]` | `app/dashboard/orders/[id]/order-detail-client.tsx` | Client | `DashboardLayout` |
| `/dashboard/addresses` | `app/dashboard/addresses/addresses-client.tsx` | Client | `DashboardLayout` |
| `/dashboard/profile` | `app/dashboard/profile/profile-client.tsx` | Client | `DashboardLayout` |
| `/dashboard/change-password` | `app/dashboard/change-password/change-password-client.tsx` | Client | `DashboardLayout` |

---

## Components Reference

### Common

| Component | File | Description |
|---|---|---|
| `Layout` | `components/common/Layout.tsx` | Wraps every page — `Navbar` + `main` + `Footer` |
| `Navbar` | `components/common/Navbar.tsx` | Sticky AppBar — logo, nav links, wishlist badge, cart icon (opens MiniCart), user avatar menu |
| `MiniCart` | `components/common/MiniCart.tsx` | Right-side drawer — cart items, qty stepper, subtotal, View Cart + Checkout buttons |
| `Footer` | `components/common/Footer.tsx` | 4-column footer — brand, Shop links, My Account links, Information links |
| `DashboardLayout` | `components/common/DashboardLayout.tsx` | My Account wrapper — sidebar nav + content area |

### Products

| Component | File | Description |
|---|---|---|
| `ProductGrid` | `components/products/ProductGrid.tsx` | Responsive MUI Grid of `ProductCard` components |
| `ProductCard` | `components/products/ProductCard.tsx` | Product tile — image, sale badge, wishlist button, name, price, Add to Cart with Added! state |
| `ProductDetails` | `components/products/ProductDetails.tsx` | Full product page — image gallery, thumbnails, price, variations, qty stepper, Add to Cart, wishlist, breadcrumb, related products |

### Checkout

| Component | File | Description |
|---|---|---|
| `CheckoutForm` | `components/checkout/CheckoutForm.tsx` | Billing form — pre-fills from saved address, ship-to-different-address toggle, order notes, coupon field, payment method radio buttons |

### Shop Page Sub-components

| Component | File | Description |
|---|---|---|
| `ProductsFilters` | `app/products/filters.tsx` | Search input + sort dropdown, updates URL params |
| `ProductsPagination` | `app/products/pagination.tsx` | Page number buttons with ellipsis logic |
| `AboutValues` | `app/about/about-values.tsx` | 3-column feature cards (Quality, Shipping, Support) |

---

## State Management

| Slice | File | Storage | Description |
|---|---|---|---|
| `cartSlice` | `store/cartSlice.ts` | localStorage | Add, remove, update qty, clear — recalculates totals |
| `wishlistSlice` | `store/wishlistSlice.ts` | localStorage | Toggle products in/out of wishlist |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new WooCommerce customer |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with code |
| GET | `/api/cart` | Returns empty cart stub |
| POST | `/api/checkout` | Create WooCommerce order |
| GET | `/api/products` | List products |
| GET | `/api/products/[slug]` | Get product by slug |
| GET/PUT | `/api/user/profile` | Get / update profile + addresses |
| PUT | `/api/user/address` | Update billing & shipping address |
| POST | `/api/user/change-password` | Verify old password + update |
| GET | `/api/user/orders` | Get customer orders |
| GET | `/api/user/orders/[id]` | Get single order (ownership verified) |

---

## Special Files

| File | Description |
|---|---|
| `app/loading.tsx` | Global top-bar loading indicator (LinearProgress) |
| `app/products/loading.tsx` | Products page skeleton loader (12 card skeletons) |
| `app/not-found.tsx` | Custom 404 page |
| `app/sitemap.ts` | Dynamic XML sitemap — static routes + all product slugs |
| `app/robots.ts` | Robots.txt — allows public pages, blocks dashboard/api |
| `app/layout.tsx` | Root layout — imports SCSS, ThemeRegistry, Providers |
| `app/providers.tsx` | Redux Provider + SessionProvider + CartProvider + WishlistInit + Toaster |
| `app/theme-registry.tsx` | MUI Emotion cache for SSR |

---

## Getting Started

### Prerequisites

- Node.js 18+
- WordPress with WooCommerce installed and REST API enabled
- [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) plugin
- [BD Better Password Reset](https://wordpress.org/plugins/bdvs-password-reset/) plugin

### 1. Clone & Install

```bash
git clone <repo-url>
cd wp-ecommerce-nextjs
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
WOOCOMMERCE_URL=http://localhost/your-wp-site
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
JWT_SECRET=<your-jwt-secret>
```

### 3. Run Development Server

```bash
npm run dev
```

---

## Available Scripts

```bash
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format all files with Prettier
npm run format:check  # Check formatting (CI)
```

---

## Features

- 🛍️ Product listing with search, sort, category filter & pagination
- 🔍 Product detail with image gallery, variations & related products
- 🛒 Cart management (add, remove, update qty) — localStorage based
- ❤️ Wishlist — save products, add to cart from wishlist
- 🛒 Mini cart drawer in navbar
- 💳 Checkout with billing form, ship-to-different-address, order notes
- 🔐 Authentication (login, register, forgot/reset password)
- 👤 My Account (dashboard, orders, order detail, addresses, profile, change password)
- 🎨 MUI + Tailwind CSS + SCSS styling
- ⚡ Turbopack for fast dev builds
- 🔒 JWT-based session management
- 🗺️ Dynamic sitemap + robots.txt
- 🎯 Custom 404 page
- ✨ Prettier + ESLint code formatting

---

## Deployment

```bash
npm run build
npm run start
```

For cloud deployment, set all environment variables on your hosting platform and ensure your WordPress instance is publicly accessible.
