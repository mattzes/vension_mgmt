import { useContext } from 'react';
import { Alert as MuiAlert } from '@mui/material';
import { AlertContext } from '@/context/AlertContext';

export function Alert() {
  const { alertHandleClose, alertData } = useContext(AlertContext);

  return (
    <MuiAlert onClose={alertHandleClose} severity={alertData.type}>
      {alertData.message}
    </MuiAlert>
  );
}
