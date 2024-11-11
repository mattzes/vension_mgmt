'use client';

import { FreezerWithVensions, Vension, Animal, VensionToDB, pepareVensionForDB } from '../general_types';
import { createContext, useContext, useEffect, useState } from 'react';
import { AlertContext } from './AlertContext';
import { AuthContext } from './AuthContext';

export type InventoryContextType = {
  freezers: FreezerWithVensions[];
  loadingFreezers: boolean;
  animals: Animal[];
  addVension: (newVension: Vension) => void;
  deleteVension: (vension: Vension) => void;
  updateVension: (currentfreezerId: string, updatedVension: Vension) => void;
};

export const InventoryContext = createContext<InventoryContextType>({
  freezers: [],
  loadingFreezers: true,
  animals: [],
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

export const InventoryContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [freezers, setFreezers] = useState<FreezerWithVensions[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingFreezers, setLoadingFreezers] = useState(true);
  const { setConfirmAlertData, handleRequestError } = useContext(AlertContext);
  const { fetchWithToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const freezers = await fetchWithToken(`${process.env.NEXT_PUBLIC_BASE_URL}/api/freezer/withItems`, 'GET').then(res =>
        res.json()
      );
      setFreezers(freezers);
      const animals = await fetchWithToken(`${process.env.NEXT_PUBLIC_BASE_URL}/api/animal`, 'GET').then(res => res.json());
      setAnimals(animals);
      setLoadingFreezers(false);
    };

    fetchData();
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

  const handleAddVension = async (newVension: Vension) => {
    addVensionLocaly(newVension);

    const vensionToDB: VensionToDB = pepareVensionForDB(newVension);
    const req = await fetchWithToken(`${process.env.NEXT_PUBLIC_BASE_URL}/api/item`, 'POST', vensionToDB);

    if (!req.ok) {
      deleteVensionlocaly(newVension.freezerId, newVension.id);
      handleRequestError(req);
      return;
    } else {
      const { item } = await req.json();
      const updatedFreezers = freezers.map(freezer => {
        if (freezer.id === newVension.freezerId) {
          return { ...freezer, vensions: [...freezer.vensions, item] };
        }
        return freezer;
      });
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
    deleteVensionlocaly(vension.freezerId, vension.id);

    const req = await fetchWithToken(`${process.env.NEXT_PUBLIC_BASE_URL}/api/item`, 'DELETE', { id: vension.id });

    if (!req.ok) {
      setFreezers(freezers);
      handleRequestError(req);
    }
  };

  const handleDeleteVension = async (vension: Vension) => {
    setConfirmAlertData({
      title: 'Eintrag löschen?',
      message: 'Das Löschen ist unwiderruflich. Bist du sicher, dass du diesen Eintrag löschen möchtest?',
      onConfirm: () => deleteVension(vension),
    });
  };

  const handleUpdateVension = async (currentFreezerId: string, updatedVension: Vension) => {
    const req = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/item`,
      'PUT',
      pepareVensionForDB(updatedVension)
    );

    if (!req.ok) {
      handleRequestError(req);
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
    <InventoryContext.Provider
      value={{
        freezers,
        loadingFreezers,
        animals,
        addVension: handleAddVension,
        deleteVension: handleDeleteVension,
        updateVension: handleUpdateVension,
      }}>
      {children}
    </InventoryContext.Provider>
  );
};
