'use client';
import React, { use, useState } from 'react';
import { MyColumnDef, Vension } from './FreezerTable';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

export const RecordForm = ({
  open,
  columns,
  onClose,
  onSubmit,
}: {
  columns: MyColumnDef[];
  onClose: () => void;
  onSubmit: (values: Vension) => void;
  open: boolean;
}) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any)
  );

  const handleSubmit = () => {
    //put your validation logic here

    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Neuen Eintrag erstellen</DialogTitle>
      <DialogContent>
        <form onSubmit={e => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: 3,
              mt: 1,
            }}>
            {columns.map(column => {
              if (!column.editable) return null;

              const textFieldProps = column.muiTextFieldProps();

              return (
                <TextField
                  key={column.accessorKey}
                  name={column.accessorKey}
                  label={column.header}
                  variant="outlined"
                  onChange={e => setValues({ ...values, [e.target.name]: e.target.value })}
                  {...textFieldProps}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};
