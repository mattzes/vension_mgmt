import React, { useContext } from 'react';
import { FreezerContext } from '../../app/context/FreezerContext';
import InventoryCard from './InventoryCard';

export default function Inventory() {
  const { freezers } = useContext(FreezerContext);

  return (
    <>
      {freezers.map(freezer => (
        <InventoryCard key={freezer.id} freezer={freezer} />
      ))}
    </>
  );
}
