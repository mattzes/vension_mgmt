import { useContext } from 'react';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { AlertContext } from '@/context/AlertContext';

export function Alert() {
  const { alertHandleClose, alertData } = useContext(AlertContext);

  return (
    <Snackbar open={true} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <MuiAlert onClose={alertHandleClose} severity={alertData.type} variant="filled">
        {alertData.message}
      </MuiAlert>
    </Snackbar>
  );
}
