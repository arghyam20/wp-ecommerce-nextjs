'use client';

import Layout from '@/components/common/Layout';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'My Orders', href: '/dashboard/orders', icon: <ShoppingBagIcon /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <PersonIcon /> },
  { label: 'Change Password', href: '/dashboard/change-password', icon: <LockIcon /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Layout>
      <Box sx={{ display: 'flex', gap: 3, maxWidth: 1100, mx: 'auto', px: 2, py: 6, width: '100%' }}>
        <Paper sx={{ width: 220, flexShrink: 0, height: 'fit-content' }} elevation={2}>
          <List disablePadding>
            {navItems.map(({ label, href, icon }) => (
              <ListItemButton
                key={href}
                href={href}
                selected={pathname === href}
                sx={{ '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } } }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Layout>
  );
}
