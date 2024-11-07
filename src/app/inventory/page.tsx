'use client';

import Inventory from '@/components/inventory/Inventory';
import { Container } from '@mui/material';
import * as React from 'react';
import { InventoryContextProvider } from '@/context/InventoryContext';

export default function Home() {
  return (
    <Container>
      <>
        <InventoryContextProvider>
          <Inventory />
        </InventoryContextProvider>
      </>
    </Container>
  );
}
