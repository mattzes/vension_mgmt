import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from '@mui/material';
import { AlertContext } from '@/context/AlertContext';

export function ConfirmAlert() {
  const { openConfirmAlert, confirmAlertHandleConfirm, confirmAlertHandleCancel, confirmAlertData } =
    useContext(AlertContext);

  return (
    <Dialog
      open={openConfirmAlert}
      onClose={confirmAlertHandleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{confirmAlertData.title}</DialogTitle>
      {confirmAlertData.message ? (
        <DialogContent>
          <Alert severity="warning" variant="outlined">
            {confirmAlertData.message}
          </Alert>
        </DialogContent>
      ) : null}
      <DialogActions
        style={{
          paddingRight: '1em',
          paddingBottom: '1em',
        }}>
        <Button onClick={confirmAlertHandleCancel}>Abbrechen</Button>
        <Button variant="contained" color="error" onClick={confirmAlertHandleConfirm} autoFocus>
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
