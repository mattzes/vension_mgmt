'use client';

import { freezers as test_data } from '../mocked_general_data';
import { Freezer, Vension } from '../general_types';
import { createContext, useState } from 'react';

export type FreezerContextType = {
  freezers: Freezer[];
  addVension: (newVension: Vension) => void;
  deleteVension: (freezerId: number, vensionId: number) => void;
  updateVension: (currentfreezerId: number, updatedVension: Vension) => void;
};

export const FreezerContext = createContext<FreezerContextType>({
  freezers: [],
  addVension: function (newVension: Vension): void {
    throw new Error('Function not implemented.');
  },
  deleteVension: function (freezerId: number, vensionId: number): void {
    throw new Error('Function not implemented.');
  },
  updateVension: function (currentfreezerId: number, updatedVension: Vension): void {
    throw new Error('Function not implemented.');
  },
});

export const FreezerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [freezers, setFreezers] = useState<Freezer[]>(test_data); // test_data is the mocked data

  const addVension = (newVension: Vension) => {
    const updatedFreezers = freezers.map(freezer => {
      if (freezer.id === newVension.freezer_id) {
        return { ...freezer, vensions: [...freezer.vensions, newVension] };
      }
      return freezer;
    });
    setFreezers(updatedFreezers);
  };

  const deleteVension = (freezerId: number, vensionId: number) => {
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

  const updateVension = (currentFreezerId: number, updatedVension: Vension) => {
    const updatedFreezers = freezers.map(freezer => {
      if (currentFreezerId === updatedVension.freezer_id && freezer.id === updatedVension.freezer_id) {
        // if the vension is updated in the current freezer, update the vension in the current freezer
        const updatedVensions = freezer.vensions.map(vension =>
          vension.id === updatedVension.id ? updatedVension : vension
        );
        return { ...freezer, vensions: updatedVensions };
      } else if (currentFreezerId !== updatedVension.freezer_id && freezer.id === currentFreezerId) {
        // if the vension is moved to another freezer and the current freezer is not the updated freezer, remove the vension from the current freezer
        const updatedVensions = freezer.vensions.filter(vension => vension.id !== updatedVension.id);
        return { ...freezer, vensions: updatedVensions };
      } else if (currentFreezerId !== updatedVension.freezer_id && freezer.id === updatedVension.freezer_id) {
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
