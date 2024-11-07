'use client';

import { createContext, useEffect, useState } from 'react';
import { ConfirmAlert } from '@/components/alerts/ConfirmAlert';

export type ConfirmAlertContextType = {
  open: boolean;
  confirmAlertHandleConfirm: () => void;
  confirmAlertHandleCancel: () => void;
  confirmAlertData: ConfirmAlertProviderData;
  setConfirmAlertData: (data: ConfirmAlertProviderData) => void;
};

export type ConfirmAlertProviderData = {
  titel: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const defautlConfirmAlertData = {
  titel: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

export const ConfirmAlertContext = createContext<ConfirmAlertContextType>({
  open: false,
  confirmAlertHandleConfirm: () => {},
  confirmAlertHandleCancel: () => {},
  confirmAlertData: defautlConfirmAlertData,
  setConfirmAlertData: (data: ConfirmAlertProviderData) => {},
});

export const ConfirmAlertContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setConfirmAlertOpen] = useState(false);
  const [confirmAlertData, setConfirmAlertData] = useState<ConfirmAlertProviderData>(defautlConfirmAlertData);

  const confirmAlertHandleConfirm = () => {
    setConfirmAlertOpen(false);
    confirmAlertData.onConfirm();
    setConfirmAlertData(defautlConfirmAlertData);
  };

  const confirmAlertHandleCancel = () => {
    setConfirmAlertOpen(false);
    confirmAlertData.onCancel();
    setConfirmAlertData(defautlConfirmAlertData);
  };

  useEffect(() => {
    if (confirmAlertData !== defautlConfirmAlertData) {
      setConfirmAlertOpen(true);
    }
  }, [confirmAlertData]);

  return (
    <ConfirmAlertContext.Provider
      value={{ open, confirmAlertHandleConfirm, confirmAlertHandleCancel, confirmAlertData, setConfirmAlertData }}>
      <ConfirmAlert />
      {children}
    </ConfirmAlertContext.Provider>
  );
};
