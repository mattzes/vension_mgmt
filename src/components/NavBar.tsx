'use client';
import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Toolbar,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Kitchen as KitchenIcon,
  EuroSymbolRounded as EuroSymbolRoundedIcon,
  RestaurantRounded as RestaurantRoundedIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';
import UserButton from '@/components/auth/UserButton';

export default function NavBar() {
  const pages = {
    Inventar: {
      path: '/inventory',
      icon: <RestaurantRoundedIcon />,
    },
    Preise: {
      path: '/pricing',
      icon: <EuroSymbolRoundedIcon />,
    },
    Gefriertruhen: {
      path: '/freezer',
      icon: <KitchenIcon />,
    },
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static">
      <Container disableGutters>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', m: 0.5 }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {Object.entries(pages).map(([key, value]) => (
              <Link
                component={NextLink}
                key={key}
                href={`${value.path}`}
                style={{ textDecoration: 'none' }}
                onClick={toggleDrawer}>
                <ListItem key={key} disablePadding>
                  <ListItemButton>
                    <ListItemIcon style={{ minWidth: '40px' }}>{pages[key as keyof typeof pages].icon}</ListItemIcon>
                    <ListItemText primary={key} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
        <Toolbar disableGutters sx={{ pl: 3 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, ...(drawerOpen && { display: 'none' }) }}
            onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', gap: 10 } }}>
            {Object.entries(pages).map(([key, value]) => (
              <Link component={NextLink} key={key} href={`${value.path}`}>
                <Button key={key} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {key}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <UserButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
