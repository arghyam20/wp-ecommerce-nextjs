import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WooCommerce from '@/lib/woocommerce/client';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;

  try {
    const { data } = await WooCommerce.get(`orders/${id}`);
    // Ensure the order belongs to this customer
    if (String(data.customer_id) !== String(userId)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
}
