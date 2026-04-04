import { NextRequest, NextResponse } from 'next/server';
import WooCommerce from '@/lib/woocommerce/client';
import { validate } from '@/lib/validation/validate';
import { registerSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { error, value } = validate(registerSchema, body);
  if (error) return NextResponse.json({ errors: error }, { status: 400 });

  try {
    const { data } = await WooCommerce.post('customers', {
      email: value.email,
      password: value.password,
      first_name: value.firstName,
      last_name: value.lastName,
      username: value.email,
    });
    return NextResponse.json({ id: data.id, email: data.email }, { status: 201 });
  } catch (err) {
    const msg =
      (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Registration failed';
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}
