import React, { useContext } from 'react';
import { FreezerContext } from '../../context/FreezerContext';
import InventoryCard from './InventoryCard';
import { Typography } from '@mui/material';

export default function Inventory() {
  const { freezers } = useContext(FreezerContext);

  return (
    <>
      {freezers.length === 0 ? (
        <Typography variant="h6" align="center" mt={5}>
          Derzeit sind keine Gefriertruhen angelegt.
        </Typography>
      ) : (
        freezers.map(freezer => <InventoryCard key={freezer.id} freezer={freezer} />)
      )}
    </>
  );
}
