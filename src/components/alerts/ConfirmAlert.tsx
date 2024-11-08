import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
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
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{confirmAlertData.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmAlertHandleConfirm}>Ok</Button>
        <Button onClick={confirmAlertHandleCancel} autoFocus>
          Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
