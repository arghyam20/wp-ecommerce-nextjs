import { NextRequest, NextResponse } from 'next/server';
import WooCommerce from '@/lib/woocommerce/client';
import { validateAsync } from '@/lib/validation/validate';
import { checkoutSchema } from '@/lib/validation/schemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CartItem } from '@/types';

const PAYMENT_TITLES: Record<string, string> = {
  cod: 'Cash on Delivery',
  bank_transfer: 'Direct Bank Transfer',
  card: 'Credit Card',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, ...formData }: { items: CartItem[] } & Record<string, unknown> = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const validatedData = await validateAsync(checkoutSchema, formData);

    // Attach customer ID if logged in
    const session = await getServerSession(authOptions);
    const customerId = session?.user ? (session.user as { id: string }).id : undefined;

    const { data } = await WooCommerce.post('orders', {
      ...(customerId && { customer_id: Number(customerId) }),
      payment_method: validatedData.paymentMethod,
      payment_method_title: PAYMENT_TITLES[validatedData.paymentMethod] ?? validatedData.paymentMethod,
      set_paid: false,
      status: 'pending',
      billing: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        address_1: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        postcode: validatedData.postcode,
        country: validatedData.country,
      },
      shipping: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        address_1: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        postcode: validatedData.postcode,
        country: validatedData.country,
      },
      line_items: items.map((item: CartItem) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    });

    return NextResponse.json({ orderId: data.id, orderNumber: data.number });
  } catch (error) {
    if (typeof error === 'object' && error !== null && !('message' in error)) {
      return NextResponse.json({ errors: error }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to process checkout' }, { status: 500 });
  }
}
