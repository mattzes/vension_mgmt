'use client';

import { FreezerWithVensions, Vensions } from '../general_types';
import { createContext, useEffect, useState } from 'react';

export type FreezerContextType = {
  freezers: FreezerWithVensions[];
  addVension: (newVension: Vensions) => void;
  deleteVension: (freezerId: string, vensionId: string) => void;
  updateVension: (currentfreezerId: string, updatedVension: Vensions) => void;
};

export const FreezerContext = createContext<FreezerContextType>({
  freezers: [],
  addVension: function (newVension: Vensions): void {
    throw new Error('Function not implemented.');
  },
  deleteVension: function (freezerId: string, vensionId: string): void {
    throw new Error('Function not implemented.');
  },
  updateVension: function (currentfreezerId: string, updatedVension: Vensions): void {
    throw new Error('Function not implemented.');
  },
});

export const FreezerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [freezers, setFreezers] = useState<FreezerWithVensions[]>([]);

  useEffect(() => {
    const fetchFreezers = async () => {
      const freezer = await fetch('/api/item/all').then(res => res.json());
      setFreezers(freezer);
    };

    fetchFreezers();
  }, []);

  const addVension = (newVension: Vensions) => {
    const updatedFreezers = freezers.map(freezer => {
      if (freezer.id === newVension.freezerId) {
        return { ...freezer, vensions: [...freezer.vensions, newVension] };
      }
      return freezer;
    });
    setFreezers(updatedFreezers);
  };

  const deleteVension = (freezerId: string, vensionId: string) => {
    const updatedFreezers = freezers.map(freezer => {
      if (freezer.id === freezerId) {
        return {
          ...freezer,
          vensions: freezer.vensions.filter(vension => vension.id !== vensionId),
        };
      }
      return freezer;
    });
    setFreezers(updatedFreezers);
  };

  const updateVension = (currentFreezerId: string, updatedVension: Vensions) => {
    const updatedFreezers = freezers.map(freezer => {
      if (currentFreezerId === updatedVension.freezerId && freezer.id === updatedVension.freezerId) {
        // if the vension is updated in the current freezer, update the vension in the current freezer
        const updatedVensions = freezer.vensions.map(vension =>
          vension.id === updatedVension.id ? updatedVension : vension
        );
        return { ...freezer, vensions: updatedVensions };
      } else if (currentFreezerId !== updatedVension.freezerId && freezer.id === currentFreezerId) {
        // if the vension is moved to another freezer and the current freezer is not the updated freezer, remove the vension from the current freezer
        const updatedVensions = freezer.vensions.filter(vension => vension.id !== updatedVension.id);
        return { ...freezer, vensions: updatedVensions };
      } else if (currentFreezerId !== updatedVension.freezerId && freezer.id === updatedVension.freezerId) {
        // if the vension is moved to another freezer and the current freezer is the updated freezer, add the vension to the updated freezer
        return { ...freezer, vensions: [...freezer.vensions, updatedVension] };
      }

      // only as fallback if none of the above conditions are met
      return freezer;
    });

    setFreezers(updatedFreezers);
  };

  return (
    <FreezerContext.Provider value={{ freezers, addVension, deleteVension, updateVension }}>
      {children}
    </FreezerContext.Provider>
  );
};
