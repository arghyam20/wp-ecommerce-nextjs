// ─── Site ────────────────────────────────────────────────────────────────────
export const SITE_NAME = "MyStore";
export const SITE_DESCRIPTION =
  "Your one-stop shop for quality products at great prices. Fast shipping, easy returns.";
export const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
export const SUPPORT_EMAIL = "support@mystore.com";
export const SUPPORT_PHONE = "+1 (555) 123-4567";
export const SUPPORT_ADDRESS = "123 Store St, New York, NY 10001";

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 20;
export const CATEGORIES_PER_PAGE = 50;

// ─── Cache / Revalidation ─────────────────────────────────────────────────────
export const REVALIDATE_HOUR = 3600;
export const REVALIDATE_DAY = 86400;

// ─── localStorage Keys ────────────────────────────────────────────────────────
export const CART_STORAGE_KEY = "wp_cart";
export const WISHLIST_STORAGE_KEY = "wp_wishlist";

// ─── Countries ────────────────────────────────────────────────────────────────
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "IN", name: "India" },
  { code: "BD", name: "Bangladesh" },
  { code: "PK", name: "Pakistan" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

// ─── Payment Methods ──────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    desc: "Pay with cash upon delivery.",
  },
  {
    value: "bank_transfer",
    label: "Direct Bank Transfer",
    desc: "Make your payment directly into our bank account. Please use your Order ID as the payment reference.",
  },
] as const;

export const PAYMENT_TITLES: Record<string, string> = {
  cod: "Cash on Delivery",
  bank_transfer: "Direct Bank Transfer",
  card: "Credit Card",
};

// ─── Order Status ─────────────────────────────────────────────────────────────
export const ORDER_STATUS_COLORS: Record<
  string,
  "default" | "warning" | "success" | "error" | "info" | "primary"
> = {
  pending: "warning",
  processing: "info",
  "on-hold": "default",
  completed: "success",
  cancelled: "error",
  refunded: "default",
  failed: "error",
};

// ─── Sort Options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { label: "Newest", value: "date-desc" },
  { label: "Oldest", value: "date-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A–Z", value: "title-asc" },
  { label: "Name: Z–A", value: "title-desc" },
  { label: "Popularity", value: "popularity-desc" },
  { label: "Rating", value: "rating-desc" },
] as const;

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
  ],
  "My Account": [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: "Addresses", href: "/dashboard/addresses" },
    { label: "Account Details", href: "/dashboard/profile" },
  ],
  Information: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;

export const DASHBOARD_NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Addresses", href: "/dashboard/addresses" },
  { label: "Account Details", href: "/dashboard/profile" },
  { label: "Change Password", href: "/dashboard/change-password" },
] as const;

// ─── API Routes ───────────────────────────────────────────────────────────────
export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  CART: "/api/cart",
  CHECKOUT: "/api/checkout",
  PRODUCTS: "/api/products",
  USER: {
    PROFILE: "/api/user/profile",
    ADDRESS: "/api/user/address",
    ORDERS: "/api/user/orders",
    CHANGE_PASSWORD: "/api/user/change-password",
  },
} as const;

// ─── Page Routes ─────────────────────────────────────────────────────────────
export const ROUTES = {
  // Public
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT: (slug: string) => `/products/${slug}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY: "/privacy",
  TERMS: "/terms",

  // Cart & Checkout
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: (orderNumber?: string) =>
    orderNumber
      ? `/order-confirmation?order=${orderNumber}`
      : "/order-confirmation",
  WISHLIST: "/wishlist",

  // Auth
  LOGIN: "/login",
  LOGIN_WITH_CALLBACK: (callbackUrl: string) =>
    `/login?callbackUrl=${callbackUrl}`,
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: (email: string, code: string) =>
    `/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,

  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_ORDERS: "/dashboard/orders",
  DASHBOARD_ORDER: (id: number | string) => `/dashboard/orders/${id}`,
  DASHBOARD_ADDRESSES: "/dashboard/addresses",
  DASHBOARD_PROFILE: "/dashboard/profile",
  DASHBOARD_CHANGE_PASSWORD: "/dashboard/change-password",
} as const;

// ─── Currency ─────────────────────────────────────────────────────────────────
export const DEFAULT_CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";
