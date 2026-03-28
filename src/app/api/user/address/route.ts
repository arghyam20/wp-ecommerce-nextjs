import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WooCommerce from '@/lib/woocommerce/client';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { billing, shipping } = await req.json();

  try {
    await WooCommerce.put(`customers/${userId}`, {
      billing: {
        address_1: billing.address1,
        address_2: billing.address2,
        city: billing.city,
        state: billing.state,
        postcode: billing.postcode,
        country: billing.country,
        phone: billing.phone,
      },
      shipping: {
        address_1: shipping.address1,
        address_2: shipping.address2,
        city: shipping.city,
        state: shipping.state,
        postcode: shipping.postcode,
        country: shipping.country,
      },
    });
    return NextResponse.json({ message: 'Addresses updated successfully' });
  } catch {
    return NextResponse.json({ message: 'Failed to update addresses' }, { status: 500 });
  }
}
