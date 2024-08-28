'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';
import { animals, meats } from '../../mocked_general_data';
import { Price } from '../../general_types';
import { prices } from '../../mocked_general_data';

export type MuiTextFieldProps = {
  type: 'number' | 'text';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Price> & {
  accessorKey: 'id' | 'animal_id' | 'meat_id' | 'price';
  showInForm?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

export const PricingTable = () => {
  const theme = useTheme();
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [tableData, setTableData] = useState<Price[]>(prices);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Price> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        showInForm: true,
        accessorKey: 'animal_id',
        header: 'Tierart',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'text',
          defaultValue: '',
          select: true, //change to select for a dropdown
          children: animals.map(animal => (
            <MenuItem key={animal.id} value={animal.id}>
              {animal.name}
            </MenuItem>
          )),
        }),
        Cell: ({ row }) => <>{animals.find(animal => animal.id === row.original.animal_id)?.name}</>,
      },
      {
        showInForm: true,
        accessorKey: 'meat_id',
        header: 'Fleischart',
        size: 0,
        muiTextFieldProps: () => ({
          defaultValue: '',
          required: true,
          type: 'text',
          select: true, //change to select for a dropdown
          children: meats.map(meat => (
            <MenuItem key={meat.id} value={meat.id}>
              {meat.name}
            </MenuItem>
          )),
        }),
        Cell: ({ row }) => <>{meats.find(meat => meat.id === row.original.animal_id)?.name}</>,
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
      const newTableData = tableData.filter((_, index) => index !== row.index);
      setTableData(newTableData);
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
      //send/receive api updates here, then refetch or update local table data for re-render
      const editedTableData = [...tableData];
      editedTableData[rowToEdit.index] = values;
      setTableData(editedTableData);
    } else {
      throw new Error("Can't save edits, no row to edit");
    }
  };

  const handleCreateRecord = (values: Price) => {
    const editedTableData = [...tableData];
    setTableData([...editedTableData, values]);
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
