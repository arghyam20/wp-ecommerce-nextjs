export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  variations?: number[];
  stock_status: 'instock' | 'outofstock';
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
  total: string;
  currency: string;
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    image?: { src: string };
  }>;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
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