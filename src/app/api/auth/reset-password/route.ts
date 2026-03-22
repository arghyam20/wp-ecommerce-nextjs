import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { email, code, password } = await req.json();
  if (!email || !code || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    await axios.post(`${process.env.WOOCOMMERCE_URL}/wp-json/bdpwr/v1/set-password`, { email, code, password });
    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    return NextResponse.json({ message: (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Reset failed' }, { status: 400 });
  }
}
