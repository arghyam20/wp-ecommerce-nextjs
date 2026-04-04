"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginSchema } from "@/lib/validation/schemas";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import Layout from "@/components/common/Layout";
import { ROUTES } from "@/lib/constants";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const result = await signIn("credentials", { ...data, redirect: false });
    setLoading(false);
    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push(searchParams.get("callbackUrl") || ROUTES.DASHBOARD);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          px: 2,
        }}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }} elevation={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Sign In
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Box textAlign="right">
                <Link href={ROUTES.FORGOT_PASSWORD} style={{ fontSize: 14 }}>
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          </form>
          <Divider sx={{ my: 2 }} />
          <Typography textAlign="center" variant="body2">
            Don&apos;t have an account?{" "}
            <Link href={ROUTES.SIGNUP}>Create one</Link>
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
