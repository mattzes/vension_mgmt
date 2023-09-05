import Inventory from '@/components/inventory/Inventory';
import { Container } from '@mui/material';
import * as React from 'react';
import { freezers } from '../../mocked_general_data';

export default function Home() {
  return (
    <Container>
      <>
        {freezers.map(freezer => (
          <Inventory freezer={freezer} />
        ))}
      </>
    </Container>
  );
}
