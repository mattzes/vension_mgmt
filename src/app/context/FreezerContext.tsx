'use client';

import { Freezer } from '../../general_types';
import { createContext } from 'react';

export const FreezerContext = createContext<Freezer[]>([]);

export const FreezerContextProvider = ({ data, children }: { data: Freezer[]; children: React.ReactNode }) => {
  return <FreezerContext.Provider value={data}>{children}</FreezerContext.Provider>;
};
