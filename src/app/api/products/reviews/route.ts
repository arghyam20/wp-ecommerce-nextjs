import { NextRequest, NextResponse } from "next/server";
import {
  getProductReviews,
  createProductReview,
} from "@/lib/woocommerce/products";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const productId = Number(req.nextUrl.searchParams.get("product_id"));
  if (!productId)
    return NextResponse.json(
      { message: "product_id required" },
      { status: 400 },
    );
  const reviews = await getProductReviews(productId);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { product_id, review, rating } = body;

  if (!product_id || !review || !rating) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const data = await createProductReview({
      product_id,
      review,
      rating: Number(rating),
      reviewer: session?.user?.name || "Guest",
      reviewer_email: session?.user?.email || body.reviewer_email || "",
    });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to submit review" },
      { status: 500 },
    );
  }
}
