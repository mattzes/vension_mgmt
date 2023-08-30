'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';

export const animal_types = ['Reh', 'Wildschwein'];
export const meat_types = ['Rücken', 'Keule', 'Für Wurst'];

export type Freezer = {
  id: number;
  name: string;
  drawer_numbers: number;
};

export type MuiTextFieldProps = {
  type: 'number' | 'text';
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Freezer> & {
  accessorKey: 'id' | 'name' | 'drawer_numbers';
  editable?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

export const FreezerTable = () => {
  const data: Freezer[] = [
    {
      id: 1,
      name: 'Gefrierschrank 1',
      drawer_numbers: 10,
    },
    {
      id: 2,
      name: 'Gefrierschrank 2',
      drawer_numbers: 15,
    },
    {
      id: 3,
      name: 'Gefrierschrank 3',
      drawer_numbers: 8,
    },
  ];

  const theme = useTheme();
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [tableData, setTableData] = useState<Freezer[]>(data);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Freezer> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        editable: true,
        accessorKey: 'name',
        header: 'Name',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'text',
          defaultValue: '',
        }),
      },
      {
        editable: true,
        accessorKey: 'drawer_numbers',
        header: 'Anzahl Schubladen',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'number',
        }),
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
    (row: MRT_Row<Freezer>) => {
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

  const setEditingRow = (row: MRT_Row<Freezer>) => {
    setRowToEdit(row);
    setRecordFormOpen(true);
  };

  const handleOnCloseForm = () => {
    setRecordFormOpen(false);
    setRowToEdit(null);
  };

  const handleSaveRowEdits = (values: Freezer) => {
    if (rowToEdit) {
      tableData[rowToEdit.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
    } else {
      throw new Error("Can't save edits, no row to edit");
    }
  };

  const handleCreateRecord = (values: Freezer) => {
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
