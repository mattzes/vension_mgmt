import React, { useCallback, useMemo, useState, useContext } from 'react';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table';
import { Box, Button, IconButton, MenuItem, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from '@/components/inventory/RecordForm';
import { animals, meats, prices } from '@/mocked_general_data';
import { Vension } from '@/general_types';
import { FreezerContext } from '@/context/FreezerContext';

export type MuiTextFieldProps = {
  type: 'number' | 'text' | 'month';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Vension> & {
  accessorKey:
    | 'freezer_id'
    | 'drawer_number'
    | 'animal_id'
    | 'meat_id'
    | 'weight'
    | 'count'
    | 'date'
    | 'price_id'
    | 'reserved_for';
  showInForm?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

const InventoryTable = ({ freezerId, fullscreen }: { freezerId: number; fullscreen: boolean }) => {
  const { freezers, addVension, deleteVension, updateVension } = useContext(FreezerContext);
  const freezer = freezers.find(freezer => freezer.id === freezerId) ?? { id: 0, drawer_numbers: 0, vensions: [] };
  const drawer_numbers: Array<string | number> = ['Nicht zugewiesen'];
  for (let i = 1; freezer && i <= freezer.drawer_numbers; i++) {
    drawer_numbers.push(i);
  }
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Vension> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
      {
        accessorKey: 'freezer_id',
        header: 'Gefrierschrank',
        size: 0,
        muiTextFieldProps: () => ({
          type: 'text',
          select: true, //change to select for a dropdown
          defaultValue: 'Nicht zugewiesen',
          children: freezers.map(freezer => (
            <MenuItem key={freezer.id} value={freezer.id}>
              {freezer.name}
            </MenuItem>
          )),
        }),
        Cell: ({ row }) => <>{freezers.find(freezer => freezer.id === row.original.freezer_id)?.name}</>,
      },
      {
        accessorKey: 'drawer_number',
        header: 'Schublade',
        size: 0,
        muiTextFieldProps: () => ({
          type: 'number',
          select: true, //change to select for a dropdown
          defaultValue: 'Nicht zugewiesen',
          children: drawer_numbers.map(drawer_number => (
            <MenuItem key={drawer_number} value={drawer_number}>
              {drawer_number}
            </MenuItem>
          )),
        }),
        GroupedCell: ({ row }) => (
          <>{typeof row.original.drawer_number === 'number' ? row.original.drawer_number : 'Nicht zugewiesen'}</>
        ),
        Cell: ({ row }) => (
          <>{typeof row.original.drawer_number === 'number' ? row.original.drawer_number : 'Nicht zugewiesen'}</>
        ),
      },
      {
        accessorKey: 'animal_id',
        header: 'Tierart',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'text',
          select: true, //change to select for a dropdown
          defaultValue: '',
          children: animals.map(animal => (
            <MenuItem key={animal.id} value={animal.id}>
              {animal.name}
            </MenuItem>
          )),
        }),
        Cell: ({ row }) => <>{animals.find(animal => animal.id === row.original.animal_id)?.name}</>,
      },
      {
        accessorKey: 'meat_id',
        header: 'Fleischart',
        size: 0,
        muiTextFieldProps: () => ({
          defaultValue: '',
          required: true,
          type: 'text',
          select: true, //change to select for a dropdown
          children: meats.map(meats => (
            <MenuItem key={meats.id} value={meats.id}>
              {meats.name}
            </MenuItem>
          )),
        }),
        Cell: ({ row }) => <>{meats.find(meat => meat.id === row.original.animal_id)?.name}</>,
      },
      {
        accessorKey: 'weight',
        header: 'Gewicht',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'number',
        }),
        Cell: ({ row }) => <>{row.original.weight}g</>,
      },
      {
        accessorKey: 'count',
        header: 'Anzahl',
        size: 0,
        muiTextFieldProps: () => ({
          required: true,
          type: 'number',
          defaultValue: 1,
        }),
      },
      {
        accessorKey: 'date',
        header: 'Datum',
        size: 130,
        muiTextFieldProps: () => ({
          required: true,
          type: 'month',
          defaultValue: `${new Date().getFullYear()}-${new Date().toLocaleString('de-DE', { month: '2-digit' })}`,
        }),
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
        accessorKey: 'price_id',
        header: 'Preis',
        size: 0,
        Cell: ({ row }) => {
          const price = prices.find(price => price.id === row.original.price_id);
          const displayPrice = (price ? price.price : '').toString().replace('.', ',');
          return <>{displayPrice}€</>;
        },
      },
      {
        accessorKey: 'reserved_for',
        header: 'Reserviert',
        size: 0,
        muiTextFieldProps: () => ({
          type: 'text',
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
  defaultValues.freezer_id = freezer.id;

  const handleOnCloseForm = () => {
    setRecordFormOpen(false);
    setRowToEdit(null);
  };

  const handleOpenCreateRecordForm = () => {
    setRecordFormOpen(true);
  };

  const setEditingRow = (row: MRT_Row<Vension>) => {
    setRowToEdit(row);
    setRecordFormOpen(true);
  };

  const handleSaveRowEdits = (values: Vension) => {
    if (rowToEdit) {
      updateVension(freezer.id, values);
    }
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
          grouping: ['drawer_number'], //an array of columns to group by by default (can be multiple)
          sorting: [{ id: 'drawer_number', desc: false }], //sort by state by default
          isFullScreen: fullscreen,
          columnVisibility: { freezer_id: false },
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
      />
    </>
  );
};

export default InventoryTable;
