import React, { useState, useContext } from 'react';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table';
import { Box, Button, IconButton, MenuItem, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from '@/components/inventory/RecordForm';
import { Animal, FreezerWithVensions, Vension } from '@/general_types';
import { FreezerContext } from '@/context/FreezerContext';

export type MuiTextFieldProps = {
  type: 'number' | 'text' | 'month';
  select?: boolean;
  children?: React.ReactNode;
  required?: boolean;
  onChange?: any;
  disabled?: boolean;
  value?: any;
};

export type MyColumnDef = MRT_ColumnDef<Vension> & {
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
  defaultValue?: any;
  muiTextFieldProps?: Partial<MuiTextFieldProps>;
};

const InventoryTable = ({
  freezerId,
  fullscreen,
  animals,
}: {
  freezerId: string;
  fullscreen: boolean;
  animals: Animal[];
}) => {
  const { freezers, addVension, deleteVension, updateVension } = useContext(FreezerContext);
  const freezer = freezers.find(freezer => freezer.id === freezerId) ?? { id: '0', drawerCount: 0, vensions: [] };
  const drawerCount: Array<string | number> = ['Nicht zugewiesen'];
  for (let i = 1; freezer && i <= freezer.drawerCount; i++) {
    drawerCount.push(i);
  }
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Vension> | null>(null);

  const defaultColumns: MyColumnDef[] = [
    {
      accessorKey: 'freezerId',
      header: 'Gefrierschrank',
      size: 0,
      muiTextFieldProps: {
        required: true,
        type: 'text',
        select: true, //change to select for a dropdown
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
      defaultValue: 'Nicht zugewiesen',
      muiTextFieldProps: {
        required: true,
        type: 'number',
        disabled: true,
        select: true, //change to select for a dropdown
        children: (
          <MenuItem key={'Nicht zugewiesen'} value={'Nicht zugewiesen'}>
            {'Nicht zugewiesen'}
          </MenuItem>
        ),
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
      defaultValue: '',
      muiTextFieldProps: {
        required: true,
        type: 'text',
        select: true, //change to select for a dropdown
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
      defaultValue: '',
      muiTextFieldProps: {
        required: true,
        type: 'text',
        disabled: true,
        select: true, //change to select for a dropdown
        children: <MenuItem></MenuItem>,
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
      defaultValue: 1,
      muiTextFieldProps: {
        required: true,
        type: 'number',
      },
    },
    {
      accessorKey: 'date',
      header: 'Datum',
      size: 130,
      defaultValue: new Date().toISOString().substring(0, 7),
      muiTextFieldProps: {
        required: true,
        type: 'month',
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
  ];
  const [columns, setColumns] = useState<MyColumnDef[]>(defaultColumns);

  const updateDropDowns = ({ freezerId = '', animalName = '' }: { freezerId?: string; animalName?: string }) => {
    let newSelectedFreezer: FreezerWithVensions | undefined = { id: '', name: '', drawerCount: 0, vensions: [] };
    let currentDrawerCount: Array<string | number> = ['Nicht zugewiesen'];
    if (freezerId) {
      newSelectedFreezer = freezers.find(freezer => freezer.id == freezerId);
      if (newSelectedFreezer) {
        for (let i = 1; i <= newSelectedFreezer.drawerCount; i++) {
          currentDrawerCount.push(i);
        }
      }
    }

    const animal = animals.find(animal => animal.name === animalName);
    const animalParts: Array<string> = animal && animal.parts ? Object.keys(animal.parts) : [];

    setColumns(
      columns.map(column => {
        if (column.accessorKey === 'drawerNumber' && freezerId) {
          return {
            ...column,
            muiTextFieldProps: {
              ...column.muiTextFieldProps,
              disabled: false,
              children: currentDrawerCount.map(drawerNumber => (
                <MenuItem key={drawerNumber} value={drawerNumber}>
                  {drawerNumber}
                </MenuItem>
              )),
            },
          };
        }
        if (column.accessorKey === 'animalPart' && animalName) {
          return {
            ...column,
            muiTextFieldProps: {
              ...column.muiTextFieldProps,
              disabled: false,
              children: animalParts.map(animalPart => (
                <MenuItem key={animalPart} value={animalPart}>
                  {animalPart}
                </MenuItem>
              )),
            },
          };
        }
        return column;
      })
    );
  };

  const defaultValues = columns.reduce((acc, column) => {
    const defaultValue = column?.defaultValue ?? '';
    acc[column.accessorKey ?? ''] = defaultValue;
    return acc;
  }, {} as any);
  defaultValues.freezer_id = freezer.id;

  const setDefaultColumns = () => {
    setColumns(defaultColumns);
  };

  const handleOnCloseForm = () => {
    setRecordFormOpen(false);
    setRowToEdit(null);
    setDefaultColumns();
  };

  const handleOpenCreateRecordForm = () => {
    setRecordFormOpen(true);
  };

  const setEditingRow = (row: MRT_Row<Vension>) => {
    const rowNew = {
      ...row,
      original: {
        ...row.original,
        date: new Date(row.original.date).toISOString().substring(0, 7),
      },
    };
    setRowToEdit(rowNew);
    updateDropDowns({ freezerId: rowNew.original.freezerId, animalName: rowNew.original.animal });
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
        updateDropDowns={updateDropDowns}
        setDefaultColumns={setDefaultColumns}
      />
    </>
  );
};

export default InventoryTable;
