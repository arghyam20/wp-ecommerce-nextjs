import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/woocommerce/products';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
