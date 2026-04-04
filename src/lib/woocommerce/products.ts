import WooCommerce from "./client";
import { cache } from "react";
import { Product, Category, ProductVariation, ProductReview } from "@/types";
import {
  PRODUCTS_PER_PAGE,
  CATEGORIES_PER_PAGE,
  ORDERS_PER_PAGE,
} from "@/lib/constants";

export { PRODUCTS_PER_PAGE, ORDERS_PER_PAGE };

export const getProducts = cache(
  async (
    page = 1,
    perPage = 12,
    search = "",
    orderby = "date",
    order = "desc",
    category = "",
  ) => {
    try {
      const response = await WooCommerce.get("products", {
        page,
        per_page: perPage,
        ...(search && { search }),
        ...(category && { category }),
        orderby,
        order,
      });
      const totalPages = Number(response.headers?.["x-wp-totalpages"]) || 1;
      const products = Array.isArray(response.data)
        ? (response.data as Product[])
        : [];
      return { products, totalPages };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
);

export const getProductBySlug = cache(async (slug: string) => {
  try {
    const { data } = await WooCommerce.get("products", { slug });
    return data[0] as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
});

export const getRelatedProducts = cache(
  async (productId: number, categoryId: number) => {
    try {
      const { data } = await WooCommerce.get("products", {
        category: categoryId,
        exclude: [productId],
        per_page: 4,
      });
      return Array.isArray(data) ? (data as Product[]) : [];
    } catch {
      return [];
    }
  },
);

export const getCategories = cache(async () => {
  try {
    const { data } = await WooCommerce.get("products/categories", {
      per_page: CATEGORIES_PER_PAGE,
      hide_empty: true,
      orderby: "count",
      order: "desc",
    });
    return Array.isArray(data) ? (data as Category[]) : [];
  } catch {
    return [];
  }
});

export const getProductsByCategory = cache(
  async (categoryId: number, page = 1, perPage = 12) => {
    try {
      const { data } = await WooCommerce.get("products", {
        category: categoryId,
        page,
        per_page: perPage,
      });
      return data as Product[];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },
);

export const searchProducts = cache(async (query: string) => {
  try {
    const { data } = await WooCommerce.get("products", { search: query });
    return data as Product[];
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
});

export const getProductVariations = cache(async (productId: number) => {
  try {
    const { data } = await WooCommerce.get(`products/${productId}/variations`, {
      per_page: 100,
    });
    return Array.isArray(data) ? (data as ProductVariation[]) : [];
  } catch {
    return [];
  }
});

export const getProductReviews = cache(async (productId: number) => {
  try {
    const { data } = await WooCommerce.get("products/reviews", {
      product: [productId],
      per_page: 10,
      status: "approved",
    });
    return Array.isArray(data) ? (data as ProductReview[]) : [];
  } catch {
    return [];
  }
});

export const createProductReview = async (review: {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
}) => {
  const { data } = await WooCommerce.post("products/reviews", review);
  return data;
};

export const validateCoupon = async (code: string) => {
  try {
    const { data } = await WooCommerce.get("coupons", { code });
    if (Array.isArray(data) && data.length > 0) return data[0];
    return null;
  } catch {
    return null;
  }
};
