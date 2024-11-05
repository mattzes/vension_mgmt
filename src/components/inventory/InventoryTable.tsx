import React, { useState, useContext } from 'react';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table';
import { Box, Button, IconButton, MenuItem, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from '@/components/inventory/RecordForm';
import { animals } from '@/mocked_general_data';
import { Vensions } from '@/general_types';
import { FreezerContext } from '@/context/FreezerContext';

export type MuiTextFieldProps = {
  type: 'number' | 'text' | 'month';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
  required?: boolean;
  onChange?: any;
};

export type MyColumnDef = MRT_ColumnDef<Vensions> & {
  accessorKey:
    | 'freezerId'
    | 'drawerNumber'
    | 'animal'
    | 'animalPart'
    | 'weight'
    | 'count'
    | 'date'
    | 'price'
    | 'reservedFor';
  showInForm?: boolean;
  muiTextFieldProps?: Partial<MuiTextFieldProps>;
};

const InventoryTable = ({ freezerId, fullscreen }: { freezerId: string; fullscreen: boolean }) => {
  const { freezers, addVension, deleteVension, updateVension } = useContext(FreezerContext);
  const freezer = freezers.find(freezer => freezer.id === freezerId) ?? { id: '0', drawerNumbers: 0, vensions: [] };
  const drawerNumbers: Array<string | number> = ['Nicht zugewiesen'];
  for (let i = 1; freezer && i <= freezer.drawerNumbers; i++) {
    drawerNumbers.push(i);
  }
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Vensions> | null>(null);

  const [columns, setColums] = useState<MyColumnDef[]>([
    {
      accessorKey: 'freezerId',
      header: 'Gefrierschrank',
      size: 0,
      muiTextFieldProps: {
        type: 'text',
        select: true, //change to select for a dropdown
        defaultValue: 'Nicht zugewiesen',
        children: freezers.map(freezer => (
          <MenuItem key={freezer.id} value={freezer.id}>
            {freezer.name}
          </MenuItem>
        )),
      },
      Cell: ({ row }) => <>{freezers.find(freezer => freezer.id === row.original.freezerId)?.name}</>,
    },
    {
      accessorKey: 'drawerNumber',
      header: 'Schublade',
      size: 0,
      muiTextFieldProps: {
        type: 'number',
        select: true, //change to select for a dropdown
        defaultValue: 'Nicht zugewiesen',
        children: drawerNumbers.map(drawerNumber => (
          <MenuItem key={drawerNumber} value={drawerNumber}>
            {drawerNumber}
          </MenuItem>
        )),
      },
      GroupedCell: ({ row }) => (
        <>{typeof row.original.drawerNumber === 'number' ? row.original.drawerNumber : 'Nicht zugewiesen'}</>
      ),
      Cell: ({ row }) => (
        <>{typeof row.original.drawerNumber === 'number' ? row.original.drawerNumber : 'Nicht zugewiesen'}</>
      ),
    },
    {
      accessorKey: 'animal',
      header: 'Tierart',
      size: 0,
      muiTextFieldProps: {
        required: true,
        type: 'text',
        select: true, //change to select for a dropdown
        defaultValue: '',
        children: animals.map(animal => (
          <MenuItem key={animal.name} value={animal.name}>
            {animal.name}
          </MenuItem>
        )),
      },
    },
    {
      accessorKey: 'animalPart',
      header: 'Fleischart',
      size: 0,
      muiTextFieldProps: {
        defaultValue: '',
        required: true,
        type: 'text',
        select: true, //change to select for a dropdown
        children: (
          <MenuItem key={'Rücken'} value={'Rücken'}>
            {'Rücken'}
          </MenuItem>
        ),
      },
    },
    {
      accessorKey: 'weight',
      header: 'Gewicht',
      size: 0,
      muiTextFieldProps: {
        required: true,
        type: 'number',
      },
      Cell: ({ row }) => <>{row.original.weight}g</>,
    },
    {
      accessorKey: 'count',
      header: 'Anzahl',
      size: 0,
      muiTextFieldProps: {
        required: true,
        type: 'number',
        defaultValue: 1,
      },
    },
    {
      accessorKey: 'date',
      header: 'Datum',
      size: 130,
      muiTextFieldProps: {
        required: true,
        type: 'month',
        defaultValue: `${new Date().getFullYear()}-${new Date().toLocaleString('de-DE', { month: '2-digit' })}`,
      },
      Cell: ({ row }) => {
        const currentDate = new Date(row.original.date);
        const monthNames = [
          'Januar',
          'Februar',
          'März',
          'April',
          'Mai',
          'Juni',
          'July',
          'August',
          'September',
          'Oktober',
          'November',
          'Dezember',
        ];
        const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        return <>{formattedDate}</>;
      },
    },
    {
      showInForm: false,
      accessorKey: 'price',
      header: 'Preis',
      size: 0,
      Cell: ({ row }) => {
        const displayPrice = row.original.price.toString().replace('.', ',');
        return <>{displayPrice}€</>;
      },
    },
    {
      accessorKey: 'reservedFor',
      header: 'Reserviert',
      size: 0,
      muiTextFieldProps: {
        type: 'text',
      },
    },
  ]);

  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = column.muiTextFieldProps?.defaultValue ?? '';
    acc[column.accessorKey ?? ''] = defaultValue;
    return acc;
  }, {} as any);
  defaultValues.freezer_id = freezer.id;

  const handleOnCloseForm = () => {
    setRecordFormOpen(false);
    setRowToEdit(null);
  };

  const handleOpenCreateRecordForm = () => {
    setRecordFormOpen(true);
  };

  const setEditingRow = (row: MRT_Row<Vensions>) => {
    setRowToEdit(row);
    setRecordFormOpen(true);
  };

  const handleSaveRowEdits = (values: Vensions) => {
    if (rowToEdit) {
      updateVension(freezer.id, values);
    }
  };

  const setColumsFromForm = (columns: MyColumnDef[]) => {
    setColums(columns);
  };

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={freezer.vensions}
        editingMode="modal"
        enableGrouping
        enableEditing
        enableColumnDragging={false}
        enableFilters={false}
        enablePagination={false}
        enableHiding={false}
        enableDensityToggle={false}
        positionToolbarAlertBanner="none"
        enableBottomToolbar={false}
        enableFullScreenToggle={true}
        muiTablePaperProps={{
          elevation: 0,
        }}
        initialState={{
          density: 'compact',
          expanded: true, //expand all groups by default
          grouping: ['drawerNumber'], //an array of columns to group by by default (can be multiple)
          sorting: [{ id: 'drawerNumber', desc: false }], //sort by state by default
          isFullScreen: fullscreen,
          columnVisibility: { freezerId: false },
        }}
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Bearbeiten">
              <IconButton
                onClick={() => {
                  setEditingRow(row);
                }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Löschen">
              <IconButton color="error" onClick={() => deleteVension(freezerId, row.original.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button color="secondary" onClick={handleOpenCreateRecordForm} variant="contained" sx={{ ml: 1 }}>
            Neuer Eintrag
          </Button>
        )}
      />
      <RecordForm
        columns={columns}
        rowToEdit={rowToEdit?.original ?? null}
        defaultValues={defaultValues}
        open={createRecordOpen}
        freezers={freezers}
        onClose={handleOnCloseForm}
        onUpdate={handleSaveRowEdits}
        onSubmit={addVension}
        setColumnsState={setColumsFromForm}
      />
    </>
  );
};

export default InventoryTable;
