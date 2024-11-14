'use client';

import Inventory from '@/components/inventory/Inventory';
import { Container } from '@mui/material';
import * as React from 'react';
import { InventoryContextProvider } from '@/context/InventoryContext';
import withAuth from '@/hoc/withAuth';

function Home() {
  return (
    <Container disableGutters>
      <InventoryContextProvider>
        <Inventory />
      </InventoryContextProvider>
    </Container>
  );
}

export default withAuth(Home);
