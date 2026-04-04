import WooCommerce from './client';
import { cache } from 'react';
import { Product, Category } from '@/types';

export const getProducts = cache(
  async (page = 1, perPage = 12, search = '', orderby = 'date', order = 'desc', category = '') => {
    try {
      const response = await WooCommerce.get('products', {
        page,
        per_page: perPage,
        ...(search && { search }),
        ...(category && { category }),
        orderby,
        order,
      });
      const totalPages = Number(response.headers?.['x-wp-totalpages']) || 1;
      const products = Array.isArray(response.data) ? (response.data as Product[]) : [];
      return { products, totalPages };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
);

export const getProductBySlug = cache(async (slug: string) => {
  try {
    const { data } = await WooCommerce.get('products', { slug });
    return data[0] as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
});

export const getRelatedProducts = cache(async (productId: number, categoryId: number) => {
  try {
    const { data } = await WooCommerce.get('products', {
      category: categoryId,
      exclude: [productId],
      per_page: 4,
    });
    return Array.isArray(data) ? (data as Product[]) : [];
  } catch {
    return [];
  }
});

export const getCategories = cache(async () => {
  try {
    const { data } = await WooCommerce.get('products/categories', {
      per_page: 50,
      hide_empty: true,
      orderby: 'count',
      order: 'desc',
    });
    return Array.isArray(data) ? (data as Category[]) : [];
  } catch {
    return [];
  }
});

export const getProductsByCategory = cache(async (categoryId: number, page = 1, perPage = 12) => {
  try {
    const { data } = await WooCommerce.get('products', {
      category: categoryId,
      page,
      per_page: perPage,
    });
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
});

export const searchProducts = cache(async (query: string) => {
  try {
    const { data } = await WooCommerce.get('products', { search: query });
    return data as Product[];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
});
