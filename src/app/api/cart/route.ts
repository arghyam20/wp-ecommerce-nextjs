import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    items: [],
    total: '0.00',
    subtotal: '0.00',
    currency: 'USD',
    item_count: 0,
  });
}
