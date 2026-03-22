import { NextRequest, NextResponse } from 'next/server';
import WooCommerce from '@/lib/woocommerce/client';
import { validateAsync } from '@/lib/validation/validate';
import { checkoutSchema } from '@/lib/validation/schemas';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = await validateAsync(checkoutSchema, body);

    const cookieStore = await cookies();
    const session = cookieStore.get('woocommerce_cart')?.value;
    if (!session) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const { data } = await WooCommerce.post('checkout', { ...validatedData, cart_token: session });

    const res = NextResponse.json(data);
    res.cookies.set('woocommerce_cart', '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (error) {
    if (typeof error === 'object' && error !== null && !('message' in error)) {
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to process checkout' }, { status: 500 });
  }
}
