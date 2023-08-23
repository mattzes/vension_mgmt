'use client';
import React, { useEffect, useState } from 'react';
import { MyColumnDef, Vension } from './FreezerTable';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

export const RecordForm = ({
  open,
  columns,
  rowToEdit,
  defaultValues,
  onClose,
  onUpdate,
  onSubmit,
}: {
  open: boolean;
  columns: MyColumnDef[];
  rowToEdit: Vension | null;
  defaultValues: Vension;
  onClose: () => void;
  onUpdate: (values: Vension) => void;
  onSubmit: (values: Vension) => void;
}) => {
  const [values, setValues] = useState<Vension>(() => {
    if (rowToEdit) return rowToEdit;
    else return defaultValues;
  });

  useEffect(() => {
    if (open) {
      if (rowToEdit) {
        setValues(rowToEdit);
      } else {
        setValues(defaultValues);
      }
    }
  }, [open]);

  const handleSubmit = () => {
    //put your validation logic here

    if (rowToEdit) onUpdate(values);
    else onSubmit(values);

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancle = () => {
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{rowToEdit ? 'Eintrag Bearbeiten' : 'Neuen Eintrag erstellena'}</DialogTitle>
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
              if (column.editable === false) return null;

              const textFieldProps = column.muiTextFieldProps();

              return (
                <TextField
                  {...textFieldProps}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  label={column.header}
                  variant="outlined"
                  onChange={handleChange}
                  defaultValue={rowToEdit ? rowToEdit[column.accessorKey] : defaultValues[column.accessorKey]}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancle}>Abbrechen</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};
