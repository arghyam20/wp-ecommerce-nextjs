"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/common/DashboardLayout";
import {
  Typography,
  Chip,
  Box,
  Paper,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Order } from "@/types";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { ROUTES, ORDER_STATUS_COLORS, API_ROUTES } from "@/lib/constants";

export default function OrderDetailClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    if (status === "unauthenticated")
      router.push(ROUTES.LOGIN_WITH_CALLBACK(ROUTES.DASHBOARD_ORDERS));
    if (status === "authenticated") {
      axios
        .get(`${API_ROUTES.USER.ORDERS}/${id}`)
        .then((r) => setOrder(r.data))
        .catch(() => setError("Order not found."))
        .finally(() => setLoading(false));
    }
  }, [status, router, id]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await axios.post("/api/user/orders/cancel", { orderId: order.id });
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to cancel order.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    if (!order) return;
    let added = 0;
    for (const item of order.line_items) {
      try {
        await addToCart(
          item.id,
          item.quantity,
          undefined,
          item.name,
          String(item.price),
          item.image ? { src: item.image.src, alt: item.name } : undefined,
        );
        added++;
      } catch {
        /* skip unavailable items */
      }
    }
    if (added > 0) {
      toast.success(`${added} item(s) added to cart.`);
      router.push(ROUTES.CART);
    } else {
      toast.error("Could not add items to cart.");
    }
  };

  const canCancel = order && ["pending", "on-hold"].includes(order.status);

  if (status === "loading" || !session) return null;

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Order Details
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {order && (
            <>
              <Button variant="outlined" size="small" onClick={handleReorder}>
                Reorder
              </Button>
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
            </>
          )}
          <Link href={ROUTES.DASHBOARD_ORDERS} passHref>
            <Button variant="outlined" size="small">
              ← Back to Orders
            </Button>
          </Link>
        </Box>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {order && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Order Meta */}
          <Paper sx={{ p: 3 }} elevation={1}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Order Number
                </Typography>
                <Typography fontWeight="bold">#{order.number}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Date
                </Typography>
                <Typography>
                  {new Date(order.date_created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box mt={0.5}>
                  <Chip
                    label={
                      order.status.charAt(0).toUpperCase() +
                      order.status.slice(1).replace("-", " ")
                    }
                    color={ORDER_STATUS_COLORS[order.status] ?? "default"}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment
                </Typography>
                <Typography>{order.payment_method_title}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total
                </Typography>
                <Typography fontWeight="bold">
                  {order.currency_symbol}
                  {order.total}
                </Typography>
              </Box>
            </Box>
            {order.customer_note && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Order Note
                </Typography>
                <Typography variant="body2">{order.customer_note}</Typography>
              </Box>
            )}
          </Paper>

          {/* Order Items */}
          <Paper sx={{ p: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Order Items
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        Product
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">
                        Qty
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        Total
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.line_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          {item.image?.src && (
                            <img
                              src={item.image.src}
                              alt={item.name}
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          )}
                          <Box>
                            <Typography variant="body2">{item.name}</Typography>
                            {item.sku && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                SKU: {item.sku}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          × {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {order.currency_symbol}
                          {item.total}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ minWidth: 200 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">
                    {order.currency_symbol}
                    {order.subtotal}
                  </Typography>
                </Box>
                {parseFloat(order.discount_total) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="success.main">
                      Discount
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -{order.currency_symbol}
                      {order.discount_total}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="body2">
                    {parseFloat(order.shipping_total) === 0
                      ? "Free"
                      : `${order.currency_symbol}${order.shipping_total}`}
                  </Typography>
                </Box>
                {parseFloat(order.total_tax) > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Tax
                    </Typography>
                    <Typography variant="body2">
                      {order.currency_symbol}
                      {order.total_tax}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography fontWeight="bold">
                    {order.currency_symbol}
                    {order.total}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Addresses */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3 }} elevation={1}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Billing Address
                </Typography>
                <Typography variant="body2">
                  {order.billing.first_name} {order.billing.last_name}
                </Typography>
                <Typography variant="body2">
                  {order.billing.address_1}
                </Typography>
                {order.billing.address_2 && (
                  <Typography variant="body2">
                    {order.billing.address_2}
                  </Typography>
                )}
                <Typography variant="body2">
                  {order.billing.city}, {order.billing.state}{" "}
                  {order.billing.postcode}
                </Typography>
                <Typography variant="body2">{order.billing.country}</Typography>
                <Typography variant="body2" mt={1}>
                  {order.billing.email}
                </Typography>
                {order.billing.phone && (
                  <Typography variant="body2">{order.billing.phone}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 3 }} elevation={1}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Shipping Address
                </Typography>
                <Typography variant="body2">
                  {order.shipping.first_name} {order.shipping.last_name}
                </Typography>
                <Typography variant="body2">
                  {order.shipping.address_1}
                </Typography>
                {order.shipping.address_2 && (
                  <Typography variant="body2">
                    {order.shipping.address_2}
                  </Typography>
                )}
                <Typography variant="body2">
                  {order.shipping.city}, {order.shipping.state}{" "}
                  {order.shipping.postcode}
                </Typography>
                <Typography variant="body2">
                  {order.shipping.country}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </DashboardLayout>
  );
}
