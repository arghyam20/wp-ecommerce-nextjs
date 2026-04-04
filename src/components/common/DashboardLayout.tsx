"use client";

import Layout from "@/components/common/Layout";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { DASHBOARD_NAV, SITE_NAME } from "@/lib/constants";

const NAV_ICONS: Record<string, React.ReactNode> = {
  "/dashboard": <DashboardIcon fontSize="small" />,
  "/dashboard/orders": <ShoppingBagIcon fontSize="small" />,
  "/dashboard/addresses": <LocationOnIcon fontSize="small" />,
  "/dashboard/profile": <PersonIcon fontSize="small" />,
  "/dashboard/change-password": <LockIcon fontSize="small" />,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Layout>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 6, width: "100%" }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          {SITE_NAME} — My Account
        </Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Sidebar */}
          <Paper sx={{ width: 220, flexShrink: 0 }} elevation={2}>
            {session?.user && (
              <>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Hello,
                  </Typography>
                  <Typography fontWeight="bold">
                    {session.user.name || session.user.email}
                  </Typography>
                </Box>
                <Divider />
              </>
            )}
            <List disablePadding>
              {DASHBOARD_NAV.map(({ label, href }) => (
                <ListItemButton
                  key={href}
                  href={href}
                  selected={pathname === href}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {NAV_ICONS[href]}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
              ))}
              <Divider />
              <ListItemButton onClick={() => signOut({ callbackUrl: "/" })}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItemButton>
            </List>
          </Paper>

          {/* Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>{children}</Box>
        </Box>
      </Box>
    </Layout>
  );
}
