'use client';

import { Typography, Container, Box } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.back();
    }
  }, [user]);

  return (
    <Container disableGutters>
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <Typography variant="h6" align="center" mt={5}>
          Bitte melde dich an, um die Seite zu nutzen.
        </Typography>
      </Box>
    </Container>
  );
}
