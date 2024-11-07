import React, { useContext } from 'react';
import { FreezerContext } from '../../context/FreezerContext';
import InventoryCard from './InventoryCard';
import { CircularProgress, Typography, Box } from '@mui/material';

export default function Inventory() {
  const { freezers, animals, loadingFreezers } = useContext(FreezerContext);

  return loadingFreezers ? (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <CircularProgress size="3rem" />
    </Box>
  ) : (
    <>
      {freezers.length === 0 || animals.length === 0 ? (
        <Typography variant="h6" align="center" mt={5}>
          Derzeit sind keine Gefriertruhen oder Preiskombinationen angelegt.
        </Typography>
      ) : (
        freezers.map(freezer => <InventoryCard key={freezer.id} freezer={freezer} animals={animals} />)
      )}
    </>
  );
}
