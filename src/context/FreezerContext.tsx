'use client';

import { FreezerWithVensions, Vension, VensionToDB, pepareVensionForDB } from '../general_types';
import { createContext, useEffect, useState } from 'react';

export type FreezerContextType = {
  freezers: FreezerWithVensions[];
  addVension: (newVension: Vension) => void;
  deleteVension: (vension: Vension) => void;
  updateVension: (currentfreezerId: string, updatedVension: Vension) => void;
};

export const FreezerContext = createContext<FreezerContextType>({
  freezers: [],
  addVension: function (newVension: Vension): void {
    throw new Error('Function not implemented.');
  },
  deleteVension: function (vension: Vension): void {
    throw new Error('Function not implemented.');
  },
  updateVension: function (currentfreezerId: string, updatedVension: Vension): void {
    throw new Error('Function not implemented.');
  },
});

export const FreezerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [freezers, setFreezers] = useState<FreezerWithVensions[]>([]);

  useEffect(() => {
    const fetchFreezers = async () => {
      const freezer = await fetch('/api/freezer/withItems').then(res => res.json());
      setFreezers(freezer);
    };

    fetchFreezers();
  }, []);

  const addVensionLocaly = (newVension: Vension) => {
    const updatedFreezers = freezers.map(freezer => {
      if (freezer.id === newVension.freezerId) {
        return { ...freezer, vensions: [...freezer.vensions, newVension] };
      }
      return freezer;
    });
    setFreezers(updatedFreezers);
  };

  const addVension = async (newVension: Vension) => {
    addVensionLocaly(newVension);

    const vensionToDB: VensionToDB = pepareVensionForDB(newVension);
    const req = await fetch('/api/item', {
      method: 'POST',
      body: JSON.stringify(vensionToDB),
    });

    if (!req.ok) {
      deleteVensionlocaly(newVension.freezerId, newVension.id);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } else {
      const { id } = await req.json();
      const updatedFreezers = freezers.map(freezer => {
        if (freezer.id === newVension.freezerId) {
          return { ...freezer, vensions: [...freezer.vensions, { ...newVension, id: id }] };
        }
        return freezer;
      });
      console.log(updatedFreezers);
      setFreezers(updatedFreezers);
    }
  };

  const deleteVensionlocaly = (freezerId: string, vensionId: string) => {
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

  const deleteVension = async (vension: Vension) => {
    if (!confirm('Bist du sicher, dass du diesen Eintrag löschen möchtest?')) {
      return;
    }

    deleteVensionlocaly(vension.freezerId, vension.id);

    const req = await fetch(`/api/item`, {
      method: 'DELETE',
      body: JSON.stringify({ id: vension.id }),
    });

    if (!req.ok) {
      setFreezers(freezers);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    }
  };

  const updateVension = async (currentFreezerId: string, updatedVension: Vension) => {
    const req = await fetch('/api/item', {
      method: 'PUT',
      body: JSON.stringify(pepareVensionForDB(updatedVension)),
    });

    if (!req.ok) {
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      return;
    }

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
