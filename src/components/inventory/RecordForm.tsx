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
  setColumnsState,
}: {
  open: boolean;
  columns: MyColumnDef[];
  rowToEdit: Vensions | null;
  defaultValues: Vensions;
  freezers: FreezerWithVensions[];
  onClose: () => void;
  onUpdate: (values: Vensions) => void;
  onSubmit: (values: Vensions) => void;
  setColumnsState: (columns: MyColumnDef[]) => void;
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
      const animal = animals.find(animal => animal.name === String(e.target.value));
      const animalParts: AnimalParts[] = animal ? animal?.parts : [];
      setColumnsState(
        columns.map(column => {
          if (column.accessorKey === 'animalPart') {
            return {
              ...column,
              muiTextFieldProps: {
                ...column.muiTextFieldProps,
                children: animalParts.map(animalPart => (
                  <MenuItem key={animalPart.part} value={animalPart.part}>
                    {animalPart.part}
                  </MenuItem>
                )),
              },
            };
          }
          return column;
        })
      );
    }
    if (e.target.name == 'freezerId') {
      const freezer = freezers.find(freezer => freezer.id === String(e.target.value));
      const drawer_numbers: Array<string | number> = ['Nicht zugewiesen'];
      for (let i = 1; freezer && i <= freezer.drawerNumbers; i++) {
        drawer_numbers.push(i);
      }
      setColumnsState(
        columns.map(column => {
          if (column.accessorKey === 'drawerNumber') {
            return {
              ...column,
              muiTextFieldProps: {
                ...column.muiTextFieldProps,
                children: drawer_numbers.map(drawer_number => (
                  <MenuItem key={drawer_number} value={drawer_number}>
                    {drawer_number}
                  </MenuItem>
                )),
              },
            };
          }
          return column;
        })
      );
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
