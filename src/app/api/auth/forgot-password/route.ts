import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ message: 'Email is required' }, { status: 400 });

  try {
    await axios.post(`${process.env.WOOCOMMERCE_URL}/wp-json/bdpwr/v1/reset-password`, { email });
  } catch {
    // Always return success to avoid email enumeration
  }
  return NextResponse.json({ message: 'Reset email sent' });
}
