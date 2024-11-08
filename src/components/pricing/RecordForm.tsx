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
import { validatePrice } from '@/validation';
import { MyColumnDef } from './PricingTable';
import { Price } from '@/general_types';

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
  rowToEdit: Price | null;
  defaultValues: Price;
  onClose: () => void;
  onUpdate: (values: Price) => void;
  onSubmit: (values: Price) => void;
}) => {
  const [values, setValues] = useState<Price>(() => {
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
    const errors = validatePrice(values);

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
    const type = columns.find(column => column.accessorKey === e.target.name)?.muiTextFieldProps?.type;
    if (type === 'number') {
      setValues(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    } else {
      setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
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
              if (column.showInForm === false) return null;

              let textFieldProps = column.muiTextFieldProps ? column.muiTextFieldProps : {};

              if (!rowToEdit && (column.accessorKey === 'animal' || column.accessorKey === 'animalPart')) {
                if ('select' in textFieldProps) textFieldProps.select = false;
              } else if (rowToEdit && (column.accessorKey === 'animal' || column.accessorKey === 'animalPart')) {
                textFieldProps = { ...textFieldProps, disabled: true };
              }

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
