'use client';
import React, { useEffect, useState } from 'react';
import { MyColumnDef } from './InventoryTable';
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
  MenuItem,
} from '@mui/material';
import { Vensions, FreezerWithVensions, AnimalParts } from '@/general_types';
import { validateVension } from '@/validation';
import { animals } from '@/mocked_general_data';

export const RecordForm = ({
  open,
  columns,
  rowToEdit,
  defaultValues,
  freezers,
  onClose,
  onUpdate,
  onSubmit,
  updateDropDowns,
}: {
  open: boolean;
  columns: MyColumnDef[];
  rowToEdit: Vensions | null;
  defaultValues: Vensions;
  freezers: FreezerWithVensions[];
  onClose: () => void;
  onUpdate: (values: Vensions) => void;
  onSubmit: (values: Vensions) => void;
  updateDropDowns: ({ freezerId, animalName }: { freezerId?: string; animalName?: string }) => void;
}) => {
  const [values, setValues] = useState<Vensions>(() => {
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
    const errors = validateVension(values);

    const freezer_drawer_numbers = freezers.find(freezer => freezer.id === values.freezerId)?.drawerNumbers;
    if (freezer_drawer_numbers) {
      if (values.drawerNumber !== 'Nicht zugewiesen' && Number(values.drawerNumber) > freezer_drawer_numbers!) {
        errors.drawer_number = 'Diese Schublade existiert nicht';
      }
    }

    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
    } else {
      if (rowToEdit) onUpdate(values);
      else onSubmit(values);

      onClose();
      setValues(defaultValues);
      setErrors({});
    }
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update drawer number menu items if freezer_id changes
    if (e.target.name == 'animal') {
      updateDropDowns({ animalName: String(e.target.value) });
    }
    if (e.target.name == 'freezerId') {
      updateDropDowns({ freezerId: String(e.target.value) });
    }

    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancle = () => {
    onClose();
    setValues(defaultValues);
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

              const textFieldProps = column.muiTextFieldProps ? column.muiTextFieldProps : {};

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
