import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WooCommerce from '@/lib/woocommerce/client';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { newPassword } = await req.json();

  try {
    await WooCommerce.put(`customers/${userId}`, { password: newPassword });
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch {
    return NextResponse.json({ message: 'Failed to update password' }, { status: 500 });
  }
}
