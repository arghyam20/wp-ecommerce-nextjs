'use client';

import Layout from '@/components/common/Layout';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Orders', href: '/dashboard/orders', icon: <ShoppingBagIcon fontSize="small" /> },
  { label: 'Addresses', href: '/dashboard/addresses', icon: <LocationOnIcon fontSize="small" /> },
  { label: 'Account Details', href: '/dashboard/profile', icon: <PersonIcon fontSize="small" /> },
  {
    label: 'Change Password',
    href: '/dashboard/change-password',
    icon: <LockIcon fontSize="small" />,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Layout>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 6, width: '100%' }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          My Account
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
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
              {navItems.map(({ label, href, icon }) => (
                <ListItemButton
                  key={href}
                  href={href}
                  selected={pathname === href}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' },
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              ))}
              <Divider />
              <ListItemButton onClick={() => signOut({ callbackUrl: '/' })}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2' }} />
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
