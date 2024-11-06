import React, { useContext, useState, useEffect } from 'react';
import { FreezerContext } from '../../context/FreezerContext';
import InventoryCard from './InventoryCard';
import { Typography } from '@mui/material';

export default function Inventory() {
  const { freezers } = useContext(FreezerContext);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const fetchAnimals = async () => {
      const animals = await fetch('/api/animal').then(res => res.json());
      setAnimals(animals);
    };

    fetchAnimals();
  }, []);
  return (
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
