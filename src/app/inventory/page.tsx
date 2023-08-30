import Inventory from '@/components/inventory/Inventory';
import { Container } from '@mui/material';
import * as React from 'react';

export default function Home() {
  const freezers: string[] = [
    'Gefrierschrank 1',
    'Gefrierschrank 2',
    'Gefrierschrank 3',
    'Gefrierschrank 4',
    'Gefrierschrank 5',
    'Geftierschrank 6',
  ];

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
