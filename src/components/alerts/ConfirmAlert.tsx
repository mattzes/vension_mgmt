import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { ConfirmAlertContext } from '@/context/ConfirmAlertContext';

export function ConfirmAlert() {
  const { open, confirmAlertHandleConfirm, confirmAlertHandleCancel, confirmAlertData } = useContext(ConfirmAlertContext);

  return (
    <Dialog
      open={open}
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
