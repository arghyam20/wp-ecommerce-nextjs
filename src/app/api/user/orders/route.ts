import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WooCommerce from '@/lib/woocommerce/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  try {
    const { data } = await WooCommerce.get('orders', { customer: userId, per_page: 20 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}
