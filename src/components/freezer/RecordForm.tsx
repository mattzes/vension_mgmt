'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { validateFreezer } from '@/validation';
import { MyColumnDef, Freezer } from './FreezerTable';

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
  rowToEdit: Freezer | null;
  defaultValues: Freezer;
  onClose: () => void;
  onUpdate: (values: Freezer) => void;
  onSubmit: (values: Freezer) => void;
}) => {
  const [values, setValues] = useState<Freezer>(() => {
    if (rowToEdit) return rowToEdit;
    else return defaultValues;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const theme = useTheme();
  const isFullscreen = useMediaQuery(() => theme.breakpoints.down('sm'));

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
    const errors = validateFreezer(values);

    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
    } else {
      if (rowToEdit) onUpdate(values);
      else onSubmit(values);

      onClose();
      setErrors({});
    }
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancle = () => {
    onClose();
    setErrors({});
  };

  return (
    <Dialog open={open} onKeyUp={handleKeypress} fullScreen={isFullscreen}>
      <DialogTitle textAlign="center">{rowToEdit ? 'Eintrag Bearbeiten' : 'Neuen Eintrag erstellen'}</DialogTitle>
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

              const textFieldProps = column.muiTextFieldProps ? column.muiTextFieldProps() : {};

              return (
                <TextField
                  {...textFieldProps}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  label={column.header}
                  variant="outlined"
                  onChange={handleChange}
                  error={!!errors[column.accessorKey]}
                  helperText={errors[column.accessorKey]}
                  defaultValue={rowToEdit ? rowToEdit[column.accessorKey] : defaultValues[column.accessorKey]}
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancle}>Abbrechen</Button>
        <Button type="submit" color="secondary" onClick={handleSubmit} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};
