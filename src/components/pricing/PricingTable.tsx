'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';

export const animal_types = ['Reh', 'Wildschwein'];
export const meat_types = ['Rücken', 'Keule', 'Für Wurst'];

export type Price = {
  id: number;
  animal_type: string;
  meat_type: string;
  price: number;
};

export type MuiTextFieldProps = {
  type: 'number' | 'text';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Price> & {
  accessorKey: 'id' | 'animal_type' | 'meat_type' | 'price';
  editable?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

export const PricingTable = () => {
  const data: Price[] = [
    {
      id: 1,
      animal_type: 'Reh',
      meat_type: 'Rücken',
      price: 10.0,
    },
    {
      id: 2,
      animal_type: 'Hirsch',
      meat_type: 'Keule',
      price: 15.0,
    },
    {
      id: 3,
      animal_type: 'Wildschwein',
      meat_type: 'Schulter',
      price: 8.5,
    },
    {
      id: 4,
      animal_type: 'Fasan',
      meat_type: 'Brust',
      price: 5.0,
    },
    {
      id: 5,
      animal_type: 'Wildente',
      meat_type: 'Keule',
      price: 7.5,
    },
  ];

  const theme = useTheme();
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [tableData, setTableData] = useState<Price[]>(data);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Price> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        editable: true,
        accessorKey: 'animal_type',
        header: 'Tierart',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'text',
          defaultValue: '',
          select: true, //change to select for a dropdown
          children: animal_types.map(animal_type => (
            <MenuItem key={animal_type} value={animal_type}>
              {animal_type}
            </MenuItem>
          )),
        }),
      },
      {
        editable: true,
        accessorKey: 'meat_type',
        header: 'Fleischart',
        size: 0,
        muiTextFieldProps: () => ({
          defaultValue: '',
          required: true,
          type: 'text',
          select: true, //change to select for a dropdown
          children: meat_types.map(meat_type => (
            <MenuItem key={meat_type} value={meat_type}>
              {meat_type}
            </MenuItem>
          )),
        }),
      },
      {
        editable: true,
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

  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = column.muiTextFieldProps?.().defaultValue ?? '';
    acc[column.accessorKey ?? ''] = defaultValue;
    return acc;
  }, {} as any);

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Price>) => {
      if (!confirm('Bist du sicher, dass du diesen Eintrag löschen möchtest?')) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
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

  const handleSaveRowEdits = (values: Price) => {
    if (rowToEdit) {
      tableData[rowToEdit.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
    } else {
      throw new Error("Can't save edits, no row to edit");
    }
  };

  const handleCreateRecord = (values: Price) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  return (
    <Container disableGutters={disableGutters}>
      <MaterialReactTable
        columns={columns}
        data={tableData}
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
