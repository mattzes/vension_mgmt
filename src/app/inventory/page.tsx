import Inventory from '@/components/inventory/Inventory';
import { Container } from '@mui/material';
import * as React from 'react';
import { freezers } from '../../mocked_general_data';
import { FreezerContextProvider } from '../context/FreezerContext';

export default function Home() {
  return (
    <Container>
      <>
        <FreezerContextProvider data={freezers}>
          {freezers.map(freezer => (
            <Inventory freezer={freezer} />
          ))}
        </FreezerContextProvider>
      </>
    </Container>
  );
}
