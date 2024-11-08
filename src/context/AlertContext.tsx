'use client';

import { createContext, useEffect, useState } from 'react';
import { ConfirmAlert } from '@/components/alerts/ConfirmAlert';
import { Alert } from '@/components/alerts/Alert';

export type AlertContextType = {
  alertHandleClose: () => void;
  alertData: AlertData;
  setAlertData: (data: AlertData) => void;
  handleRequestError: (req: Response) => void;
  openConfirmAlert: boolean;
  confirmAlertHandleConfirm: () => void;
  confirmAlertHandleCancel: () => void;
  confirmAlertData: ConfirmAlertProviderDataLocal;
  setConfirmAlertData: (data: ConfirmAlertProviderData) => void;
};

export type AlertData = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

export type ConfirmAlertProviderDataLocal = {
  title: string;
  alert: AlertData;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export type ConfirmAlertProviderData = {
  title: string;
  alert?: AlertData;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const defautlConfirmAlertData = {
  title: '',
  message: '',
  alert: {
    message: '',
    type: 'info' as 'success' | 'error' | 'info' | 'warning',
  },
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
  setAlertData: (data: AlertData) => {},
  handleRequestError: () => {},
  openConfirmAlert: false,
  confirmAlertHandleConfirm: () => {},
  confirmAlertHandleCancel: () => {},
  confirmAlertData: defautlConfirmAlertData,
  setConfirmAlertData: (data: ConfirmAlertProviderData) => {},
});

export const ConfirmAlertContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [openConfirmAlert, setConfirmAlertOpen] = useState(false);
  const [openAlert, setAlertOpen] = useState(false);
  const [confirmAlertData, setConfirmAlertDataLocal] = useState<ConfirmAlertProviderDataLocal>(defautlConfirmAlertData);
  const [alertData, setAlertData] = useState<AlertData>(defautlAlertData);

  const confirmAlertHandleConfirm = () => {
    setConfirmAlertOpen(false);
    confirmAlertData.onConfirm();
    setConfirmAlertDataLocal(defautlConfirmAlertData);
  };

  const confirmAlertHandleCancel = () => {
    setConfirmAlertOpen(false);
    confirmAlertData.onCancel();
    setConfirmAlertDataLocal(defautlConfirmAlertData);
  };

  const alertHandleClose = () => {
    setAlertData(defautlAlertData);
    setAlertOpen(false);
  };

  const setConfirmAlertData = (data: ConfirmAlertProviderData) => {
    setConfirmAlertDataLocal({
      ...defautlConfirmAlertData,
      ...data,
    });
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

  const handleRequestError = async (req: Response) => {
    let message = 'Ein unbekanter Fehler ist aufgetreten. Bitte versuche es später erneut.';
    try {
      const body = await req.json();
      message = body.message;
    } catch (e) {}
    setAlertData({
      message: message,
      type: 'error',
    });
  };

  return (
    <AlertContext.Provider
      value={{
        alertHandleClose,
        alertData,
        setAlertData,
        handleRequestError,
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
