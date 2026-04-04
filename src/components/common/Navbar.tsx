'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MiniCart from './MiniCart';

export default function Navbar() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const itemCount = cart?.item_count ?? 0;
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
            prefetch={true}
          >
            <Typography variant="h6" fontWeight="bold">
              MyStore
            </Typography>
          </Link>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {[
              ['Products', '/products'],
              ['About', '/about'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <Link key={href} href={href} prefetch={true}>
                <Button color="inherit">{label}</Button>
              </Link>
            ))}

            {/* Wishlist */}
            <Link href="/wishlist" prefetch={true}>
              <IconButton color="inherit">
                <Badge badgeContent={wishlistCount} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Link>

            {/* Cart — opens mini cart drawer */}
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {session ? (
              <>
                <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0, ml: 1 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 16 }}>
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchor}
                  open={Boolean(anchor)}
                  onClose={() => setAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {session.user?.name || session.user?.email}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem component={Link} href="/dashboard" onClick={() => setAnchor(null)}>
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href="/dashboard/orders"
                    onClick={() => setAnchor(null)}
                  >
                    My Orders
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href="/dashboard/profile"
                    onClick={() => setAnchor(null)}
                  >
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      setAnchor(null);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href="/login" passHref>
                <Button
                  color="inherit"
                  variant="outlined"
                  sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
