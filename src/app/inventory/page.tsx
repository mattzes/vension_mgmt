'use client';

import Inventory from '@/components/inventory/Inventory';
import { Container } from '@mui/material';
import * as React from 'react';
import { FreezerContextProvider } from '@/context/FreezerContext';

export default function Home() {
  return (
    <Container>
      <>
        <FreezerContextProvider>
          <Inventory />
        </FreezerContextProvider>
      </>
    </Container>
  );
}
