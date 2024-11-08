'use client';
import React, { useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';
import { Price } from '../../general_types';
import { AlertContext } from '@/context/AlertContext';

export type MuiTextFieldProps = {
  type: 'number' | 'text';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Price> & {
  accessorKey: 'animal' | 'animalPart' | 'price';
  showInForm?: boolean;
  muiTextFieldProps?: MuiTextFieldProps;
};

export const PricingTable = () => {
  const theme = useTheme();
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Price> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setConfirmAlertData } = useContext(AlertContext);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        showInForm: true,
        accessorKey: 'animal',
        header: 'Tierart',
        size: 0,
        muiTextFieldProps: {
          required: true,
          type: 'text',
          defaultValue: '',
          select: false, //change to select for a dropdown
        },
      },
      {
        showInForm: true,
        accessorKey: 'animalPart',
        header: 'Fleischart',
        size: 0,
        muiTextFieldProps: {
          defaultValue: '',
          required: true,
          type: 'text',
          select: false, //change to select for a dropdown
        },
      },
      {
        showInForm: true,
        accessorKey: 'price',
        header: 'Preis',
        size: 0,
        muiTextFieldProps: {
          required: true,
          type: 'number',
        },
        Cell: ({ row }) => <>{row.original.price?.toString().replace('.', ',')}€</>,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/price/all`).then(res => res.json());
      setPrices(prices);
      setIsLoading(false);
    };

    fetchPrices();
  }, []);

  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = column.muiTextFieldProps?.defaultValue ?? '';
    acc[column.accessorKey ?? ''] = defaultValue;
    return acc;
  }, {} as any);

  const deleteRow = async (row: MRT_Row<Price>) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/price`, {
      method: 'DELETE',
      body: JSON.stringify(row.original),
    });

    if (!req.ok) {
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      return;
    }

    const newTableData = prices.filter((_, index) => index !== row.index);
    setPrices(newTableData);
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Price>) => {
      setConfirmAlertData({
        title: 'Eintrag löschen?',
        alert: {
          message: 'Es werden keine Gegenstände gelöscht, die mit diesem Eintrag verknüpft sind.',
          type: 'info',
        },
        message: 'Das Löschen ist unwiderruflich. Bist du sicher, dass du diesen Eintrag löschen möchtest?',
        onConfirm: () => deleteRow(row),
        onCancel: () => {},
      });
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
      const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/price`, {
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
    const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/price`, {
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
        state={{ isLoading: isLoading }}
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
