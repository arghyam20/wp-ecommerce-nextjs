export interface Product {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  sku: string;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  manage_stock: boolean;
  weight: string;
  average_rating: string;
  rating_count: number;
  review_count: number;
  images: Array<{ id: number; src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
    variation: boolean;
  }>;
  variations?: number[];
  related_ids?: number[];
}

export interface ProductVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock";
  stock_quantity: number | null;
  attributes: Array<{ id: number; name: string; option: string }>;
  image?: { src: string; alt: string };
}

export interface ProductReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_avatar_urls: Record<string, string>;
  verified: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: "percent" | "fixed_cart" | "fixed_product";
  amount: string;
  description: string;
  minimum_amount: string;
  maximum_amount: string;
  usage_count: number;
  usage_limit: number | null;
}

export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  price: string;
  line_total: string;
  image?: {
    src: string;
    alt: string;
  };
  variation?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  total: string;
  subtotal: string;
  currency: string;
  item_count: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  billing?: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  shipping?: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

export interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  date_modified: string;
  total: string;
  subtotal: string;
  total_tax: string;
  shipping_total: string;
  discount_total: string;
  currency: string;
  currency_symbol: string;
  customer_note: string;
  payment_method: string;
  payment_method_title: string;
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    price: number;
    sku: string;
    image?: { src: string };
  }>;
  shipping_lines: Array<{
    id: number;
    method_title: string;
    total: string;
  }>;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  paymentMethod: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  image?: { src: string; alt: string };
  parent: number;
}
