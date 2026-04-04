import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WooCommerce from '@/lib/woocommerce/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  try {
    const { data } = await WooCommerce.get(`customers/${userId}`);
    return NextResponse.json({
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      avatarUrl: data.avatar_url,
      billing: {
        address1: data.billing?.address_1 ?? '',
        address2: data.billing?.address_2 ?? '',
        city: data.billing?.city ?? '',
        state: data.billing?.state ?? '',
        postcode: data.billing?.postcode ?? '',
        country: data.billing?.country ?? '',
        phone: data.billing?.phone ?? '',
      },
      shipping: {
        address1: data.shipping?.address_1 ?? '',
        address2: data.shipping?.address_2 ?? '',
        city: data.shipping?.city ?? '',
        state: data.shipping?.state ?? '',
        postcode: data.shipping?.postcode ?? '',
        country: data.shipping?.country ?? '',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { firstName, lastName, email } = await req.json();
  try {
    const { data } = await WooCommerce.put(`customers/${userId}`, {
      first_name: firstName,
      last_name: lastName,
      email,
    });
    return NextResponse.json({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
    });
  } catch {
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
