import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import WooCommerce from "@/lib/woocommerce/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();
  if (!orderId)
    return NextResponse.json({ message: "Order ID required" }, { status: 400 });

  const userId = (session.user as { id: string }).id;

  try {
    // Verify ownership
    const { data: order } = await WooCommerce.get(`orders/${orderId}`);
    if (String(order.customer_id) !== String(userId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (!["pending", "on-hold"].includes(order.status)) {
      return NextResponse.json(
        { message: "Order cannot be cancelled" },
        { status: 400 },
      );
    }
    await WooCommerce.put(`orders/${orderId}`, { status: "cancelled" });
    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch {
    return NextResponse.json(
      { message: "Failed to cancel order" },
      { status: 500 },
    );
  }
}
