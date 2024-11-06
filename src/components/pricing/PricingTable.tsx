'use client';
import React, { use, useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';
import { Price } from '../../general_types';

export type MuiTextFieldProps = {
  type: 'number' | 'text';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Price> & {
  accessorKey: 'animal' | 'animalPart' | 'price';
  showInForm?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

export const PricingTable = () => {
  const theme = useTheme();
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Price> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        showInForm: true,
        accessorKey: 'animal',
        header: 'Tierart',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'text',
          defaultValue: '',
          select: true, //change to select for a dropdown
          children: prices.map(price => (
            <MenuItem key={price.animal} value={price.animal}>
              {price.animal}
            </MenuItem>
          )),
        }),
      },
      {
        showInForm: true,
        accessorKey: 'animalPart',
        header: 'Fleischart',
        size: 0,
        muiTextFieldProps: () => ({
          defaultValue: '',
          required: true,
          type: 'text',
          select: true, //change to select for a dropdown
          children: prices.map(price => (
            <MenuItem key={price.animalPart} value={price.animalPart}>
              {price.animalPart}
            </MenuItem>
          )),
        }),
      },
      {
        showInForm: true,
        accessorKey: 'price',
        header: 'Preis',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'number',
        }),
        Cell: ({ row }) => <>{row.original.price?.toString().replace('.', ',')}€</>,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetch('/api/price').then(res => res.json());
      setPrices(prices);
    };

    fetchPrices();
  }, []);

  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = column.muiTextFieldProps?.().defaultValue ?? '';
    acc[column.accessorKey ?? ''] = defaultValue;
    return acc;
  }, {} as any);

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Price>) => {
      if (!confirm('Bist du sicher, dass du diesen Eintrag löschen möchtest?')) {
        return;
      }

      const req = await fetch('/api/price/', {
        method: 'DELETE',
        body: JSON.stringify(row.original),
      });

      if (!req.ok) {
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        return;
      }

      const newTableData = prices.filter((_, index) => index !== row.index);
      setPrices(newTableData);
    },
    [prices]
  );

  const handleOpenCreateRecordForm = () => {
    setRecordFormOpen(true);
  };

  const setEditingRow = (row: MRT_Row<Price>) => {
    setRowToEdit(row);
    setRecordFormOpen(true);
  };

  const handleOnCloseForm = () => {
    setRecordFormOpen(false);
    setRowToEdit(null);
  };

  const handleSaveRowEdits = async (values: Price) => {
    if (rowToEdit) {
      const req = await fetch('/api/price/', {
        method: 'PUT',
        body: JSON.stringify(values),
      });

      if (!req.ok) {
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        return;
      }

      const editedTableData = [...prices];
      editedTableData[rowToEdit.index] = values;
      setPrices(editedTableData);
    } else {
      throw new Error("Can't save edits, no row to edit");
    }
  };

  const handleCreateRecord = async (values: Price) => {
    const req = await fetch('/api/price/', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (!req.ok) {
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      return;
    }

    const editedTableData = [...prices];
    setPrices([...editedTableData, values]);
  };

  return (
    <Container disableGutters={disableGutters}>
      <MaterialReactTable
        columns={columns}
        data={prices}
        editingMode="row"
        enableEditing={true}
        enableColumnDragging={false}
        enableHiding={false}
        enableFilters={false}
        enablePagination={false}
        enableFullScreenToggle={false}
        enableBottomToolbar={false}
        enableDensityToggle={false}
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Bearbeiten">
              <IconButton onClick={() => setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Löschen">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        muiTablePaperProps={{
          elevation: 0,
          variant: 'outlined',
          sx: { mt: disableGutters ? 0 : 3 },
        }}
        renderTopToolbarCustomActions={() => (
          <Button color="secondary" onClick={handleOpenCreateRecordForm} variant="contained" sx={{ mt: 1, ml: 1 }}>
            Neuer Eintrag
          </Button>
        )}
      />
      <RecordForm
        columns={columns}
        rowToEdit={rowToEdit?.original ?? null}
        open={createRecordOpen}
        defaultValues={defaultValues}
        onClose={handleOnCloseForm}
        onUpdate={handleSaveRowEdits}
        onSubmit={handleCreateRecord}
      />
    </Container>
  );
};
