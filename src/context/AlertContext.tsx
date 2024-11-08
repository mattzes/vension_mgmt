'use client';

import { createContext, useEffect, useState } from 'react';
import { ConfirmAlert } from '@/components/alerts/ConfirmAlert';
import { Alert } from '@/components/alerts/Alert';

export type AlertContextType = {
  alertHandleClose: () => void;
  alertData: AlertDataProviderData;
  setAlertData: (data: AlertDataProviderData) => void;
  openConfirmAlert: boolean;
  confirmAlertHandleConfirm: () => void;
  confirmAlertHandleCancel: () => void;
  confirmAlertData: ConfirmAlertProviderData;
  setConfirmAlertData: (data: ConfirmAlertProviderData) => void;
};

export type AlertDataProviderData = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

export type ConfirmAlertProviderData = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const defautlConfirmAlertData = {
  title: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

const defautlAlertData = {
  message: '',
  type: 'info' as 'success' | 'error' | 'info' | 'warning',
};

export const AlertContext = createContext<AlertContextType>({
  alertHandleClose: () => {},
  alertData: defautlAlertData,
  setAlertData: (data: AlertDataProviderData) => {},
  openConfirmAlert: false,
  confirmAlertHandleConfirm: () => {},
  confirmAlertHandleCancel: () => {},
  confirmAlertData: defautlConfirmAlertData,
  setConfirmAlertData: (data: ConfirmAlertProviderData) => {},
});

export const ConfirmAlertContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [openConfirmAlert, setConfirmAlertOpen] = useState(false);
  const [openAlert, setAlertOpen] = useState(false);
  const [confirmAlertData, setConfirmAlertData] = useState<ConfirmAlertProviderData>(defautlConfirmAlertData);
  const [alertData, setAlertData] = useState<AlertDataProviderData>(defautlAlertData);

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

  const alertHandleClose = () => {
    setAlertData(defautlAlertData);
    setAlertOpen(false);
  };

  useEffect(() => {
    if (confirmAlertData !== defautlConfirmAlertData) {
      setConfirmAlertOpen(true);
    }
  }, [confirmAlertData]);

  useEffect(() => {
    if (alertData !== defautlAlertData) {
      setAlertOpen(true);
      setTimeout(() => {
        setAlertData(defautlAlertData);
        setAlertOpen(false);
      }, 5000);
    }
  }, [alertData]);

  return (
    <AlertContext.Provider
      value={{
        alertHandleClose,
        alertData,
        setAlertData,
        openConfirmAlert,
        confirmAlertHandleConfirm,
        confirmAlertHandleCancel,
        confirmAlertData,
        setConfirmAlertData,
      }}>
      <ConfirmAlert />
      {openAlert ? <Alert /> : null}
      {children}
    </AlertContext.Provider>
  );
};
