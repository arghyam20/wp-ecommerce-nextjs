"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Divider,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ProductReview } from "@/types";
import { API_ROUTES } from "@/lib/constants";

interface Props {
  productId: number;
}

export default function ProductReviews({ productId }: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [review, setReview] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  useEffect(() => {
    axios
      .get(`${API_ROUTES.PRODUCTS}/reviews?product_id=${productId}`)
      .then((r) => setReviews(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !review.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_ROUTES.PRODUCTS}/reviews`, {
        product_id: productId,
        review: review.trim(),
        rating,
        reviewer_email: session?.user?.email || reviewerEmail,
      });
      setReviews((prev) => [data, ...prev]);
      setReview("");
      setRating(5);
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box mt={6}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </Typography>

      {/* Review List */}
      {loading ? (
        <CircularProgress size={24} />
      ) : reviews.length === 0 ? (
        <Typography color="text.secondary" mb={3}>
          No reviews yet. Be the first to review this product!
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          {reviews.map((r) => (
            <Paper key={r.id} sx={{ p: 3 }} elevation={1}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Avatar
                  src={r.reviewer_avatar_urls?.["48"]}
                  sx={{ width: 40, height: 40 }}
                >
                  {r.reviewer?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold" variant="body2">
                    {r.reviewer}
                    {r.verified && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="success.main"
                        ml={1}
                      >
                        ✓ Verified
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(r.date_created).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
                <Rating
                  value={r.rating}
                  readOnly
                  size="small"
                  sx={{ ml: "auto" }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
                dangerouslySetInnerHTML={{ __html: r.review }}
              />
            </Paper>
          ))}
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Submit Review */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Write a Review
      </Typography>
      {submitted ? (
        <Alert severity="success">
          Thank you! Your review has been submitted and is pending approval.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 560,
            }}
          >
            <Box>
              <Typography variant="body2" mb={0.5}>
                Your Rating *
              </Typography>
              <Rating
                value={rating}
                onChange={(_, val) => setRating(val)}
                size="large"
              />
            </Box>
            {!session && (
              <>
                <TextField
                  fullWidth
                  size="small"
                  label="Your Name *"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Your Email *"
                  type="email"
                  required
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                />
              </>
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review *"
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !rating || !review.trim()}
              sx={{ alignSelf: "flex-start", px: 4 }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
