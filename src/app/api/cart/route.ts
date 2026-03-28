import { NextRequest, NextResponse } from 'next/server';
import WooCommerce from '@/lib/woocommerce/client';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('woocommerce_cart')?.value;

  if (!session) {
    return NextResponse.json({ items: [], total: '0.00', item_count: 0 });
  }
  try {
    const { data } = await WooCommerce.get('cart', { cart_token: session });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { productId, quantity, variation } = await req.json();
  try {
    const { data } = await WooCommerce.post('cart/add', { product_id: productId, quantity, variation });
    const res = NextResponse.json(data);
    if (data.cart_token) {
      res.cookies.set('woocommerce_cart', data.cart_token, { httpOnly: true, path: '/' });
    }
    return res;
  } catch {
    return NextResponse.json({ message: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { itemKey, quantity } = await req.json();
  try {
    const { data } = await WooCommerce.put(`cart/item/${itemKey}`, { quantity });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { itemKey } = await req.json();
  try {
    const { data } = await WooCommerce.delete(`cart/item/${itemKey}`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Failed to remove item' }, { status: 500 });
  }
}
