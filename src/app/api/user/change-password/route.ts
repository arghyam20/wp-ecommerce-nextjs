import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WooCommerce from '@/lib/woocommerce/client';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword)
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });

  try {
    // Verify current password via JWT auth
    await axios.post(`${process.env.WOOCOMMERCE_URL}/wp-json/jwt-auth/v1/token`, {
      username: session.user?.email,
      password: currentPassword,
    });
  } catch {
    return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
  }

  try {
    await WooCommerce.put(`customers/${userId}`, { password: newPassword });
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch {
    return NextResponse.json({ message: 'Failed to update password' }, { status: 500 });
  }
}
