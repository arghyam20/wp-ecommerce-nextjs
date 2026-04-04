"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { registerSchema } from "@/lib/validation/schemas";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import Layout from "@/components/common/Layout";
import { ROUTES, API_ROUTES } from "@/lib/constants";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: joiResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await axios.post(API_ROUTES.AUTH.REGISTER, data);
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      toast.success("Account created successfully!");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Registration failed",
      );
    } finally {
      setLoading(false);
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
          py: 4,
        }}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 480 }} elevation={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Create Account
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Box>
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
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Box>
          </form>
          <Divider sx={{ my: 2 }} />
          <Typography textAlign="center" variant="body2">
            Already have an account? <Link href={ROUTES.LOGIN}>Sign in</Link>
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
