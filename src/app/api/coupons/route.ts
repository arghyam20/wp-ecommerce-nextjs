import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/woocommerce/products";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code)
    return NextResponse.json(
      { message: "Coupon code required" },
      { status: 400 },
    );

  const coupon = await validateCoupon(code.trim().toLowerCase());
  if (!coupon) {
    return NextResponse.json(
      { message: "Invalid or expired coupon code" },
      { status: 404 },
    );
  }
  return NextResponse.json(coupon);
}
