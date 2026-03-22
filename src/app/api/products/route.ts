import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductsByCategory } from '@/lib/woocommerce/products';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 12;
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'date-desc';
  const [orderby, order] = sort.split('-') as [string, string];

  try {
    const result = categoryId
      ? await getProductsByCategory(Number(categoryId), page, perPage)
      : await getProducts(page, perPage, search, orderby, order);
    const products = 'products' in result ? result.products : result;
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
