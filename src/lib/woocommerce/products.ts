import WooCommerce from './client';
import { Product } from '@/types';

export const getProducts = async (
  page = 1,
  perPage = 12,
  search = '',
  orderby = 'date',
  order = 'desc'
) => {
  try {
    const response = await WooCommerce.get('products', {
      page,
      per_page: perPage,
      ...(search && { search }),
      orderby,
      order,
    });
    const totalPages = Number(response.headers?.['x-wp-totalpages']) || 1;
    const products = Array.isArray(response.data) ? response.data as Product[] : [];
    return { products, totalPages };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await WooCommerce.get('products', {
      slug,
    });
    return data[0] as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: number, page = 1, perPage = 12) => {
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
};

export const searchProducts = async (query: string) => {
  try {
    const { data } = await WooCommerce.get('products', {
      search: query,
    });
    return data as Product[];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};