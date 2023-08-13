import React from 'react';
import { AppBar, Box, Button, Container, Link, Toolbar } from '@mui/material';
import NextLink from 'next/link';

export default function NavBar() {
  const pages = {
    Inventar: '/inventory',
    Preise: '/pricing',
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { sm: 'none', md: 'flex', gap: 10 } }}>
            {Object.entries(pages).map(([page, url]) => (
              <Link component={NextLink} key={page} href={`${url}`}>
                <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
