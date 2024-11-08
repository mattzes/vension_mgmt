import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert, Grid } from '@mui/material';
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
        {confirmAlertData.alert ? (
          <Alert severity={confirmAlertData.alert.type} variant="outlined">
            {confirmAlertData.alert.message}
          </Alert>
        ) : null}
        {confirmAlertData.message && confirmAlertData.alert ? <br /> : null}
        {confirmAlertData.message ? (
          <DialogContentText id="alert-dialog-description">{confirmAlertData.message}</DialogContentText>
        ) : null}
      </DialogContent>
      <DialogActions
        style={{
          paddingRight: '1.5em',
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
