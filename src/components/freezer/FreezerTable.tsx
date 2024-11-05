'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';
import { Freezer } from '../../general_types';

export type MuiTextFieldProps = {
  type: 'number' | 'text';
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Freezer> & {
  accessorKey: 'id' | 'name' | 'drawerNumbers';
  showInForm?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

export const FreezerTable = () => {
  const theme = useTheme();
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [tableData, setTableData] = useState<Freezer[]>([]);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Freezer> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        showInForm: true,
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
        showInForm: true,
        accessorKey: 'drawerNumbers',
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

  useEffect(() => {
    const fetchFreezers = async () => {
      const freezers = await fetch('/api/freezer').then(res => res.json());
      setTableData(freezers);
    };

    fetchFreezers();
  }, []);

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Freezer>) => {
      if (!confirm('Bist du sicher, dass du diesen Eintrag löschen möchtest?')) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      const editedTableData = tableData.filter((_, index) => index !== row.index);
      setTableData(editedTableData);
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
      const editedTableData = [...tableData];
      editedTableData[rowToEdit.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData(editedTableData);
    } else {
      throw new Error("Can't save edits, no row to edit");
    }
  };

  const handleCreateRecord = (values: Freezer) => {
    setTableData([...tableData, values]);
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
