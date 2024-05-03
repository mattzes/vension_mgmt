import React, { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef, type MRT_Row } from 'material-react-table';
import { Box, Button, IconButton, MenuItem, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RecordForm } from './RecordForm';
import { animals, meats, prices } from '../../mocked_general_data';
import { Freezer, Price, BasicEntity } from '@/general_types';

export const data: Vension[] = [
  {
    id: 1,
    freezer_id: 1,
    drawer_number: 'Nicht zugewiesen',
    animal_id: 1,
    meat_id: 2,
    weight: 380,
    count: 2,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 1,
    reserved_for: '',
  },
  {
    id: 8,
    freezer_id: 1,
    drawer_number: 'Nicht zugewiesen',
    animal_id: 1,
    meat_id: 2,
    weight: 600,
    count: 2,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 3,
    reserved_for: '',
  },
  {
    id: 9,
    freezer_id: 1,
    drawer_number: 4,
    animal_id: 2,
    meat_id: 1,
    weight: 1100,
    count: 1,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 1,
    reserved_for: 'Hans',
  },
  {
    id: 10,
    freezer_id: 1,
    drawer_number: 1,
    animal_id: 1,
    meat_id: 4,
    weight: 340,
    count: 3,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 2,
    reserved_for: '',
  },
  {
    id: 11,
    freezer_id: 1,
    drawer_number: 3,
    animal_id: 2,
    meat_id: 2,
    weight: 850,
    count: 2,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 4,
    reserved_for: '',
  },
  {
    id: 12,
    freezer_id: 1,
    drawer_number: 5,
    animal_id: 1,
    meat_id: 1,
    weight: 920,
    count: 1,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 5,
    reserved_for: 'Silke',
  },
  {
    id: 13,
    freezer_id: 1,
    drawer_number: 2,
    animal_id: 2,
    meat_id: 4,
    weight: 380,
    count: 4,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 3,
    reserved_for: 'Hans',
  },
  {
    id: 14,
    freezer_id: 1,
    drawer_number: 6,
    animal_id: 1,
    meat_id: 2,
    weight: 550,
    count: 2,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 2,
    reserved_for: '',
  },
  {
    id: 15,
    freezer_id: 1,
    drawer_number: 'Nicht zugewiesen',
    animal_id: 2,
    meat_id: 1,
    weight: 1050,
    count: 1,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 1,
    reserved_for: 'Silke',
  },
  {
    id: 16,
    freezer_id: 1,
    drawer_number: 4,
    animal_id: 1,
    meat_id: 4,
    weight: 310,
    count: 3,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 3,
    reserved_for: '',
  },
  {
    id: 17,
    freezer_id: 1,
    drawer_number: 1,
    animal_id: 2,
    meat_id: 2,
    weight: 820,
    count: 2,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 2,
    reserved_for: 'Hans',
  },
  {
    id: 18,
    freezer_id: 1,
    drawer_number: 3,
    animal_id: 1,
    meat_id: 1,
    weight: 900,
    count: 1,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 1,
    reserved_for: 'Silke',
  },
  {
    id: 19,
    freezer_id: 1,
    drawer_number: 5,
    animal_id: 2,
    meat_id: 4,
    weight: 400,
    count: 4,
    date: new Date().toISOString().split('T')[0].split('-').slice(0, 2).join('-'),
    price_id: 4,
    reserved_for: '',
  },
];

export type Vension = {
  id: number;
  freezer_id: number;
  drawer_number: number | string;
  animal_id: BasicEntity['id'];
  meat_id: BasicEntity['id'];
  weight: number;
  count: number;
  date: string;
  price_id: Price['id'];
  reserved_for: string;
};

export type MuiTextFieldProps = {
  type: 'number' | 'text' | 'month';
  select?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
};

export type MyColumnDef = MRT_ColumnDef<Vension> & {
  accessorKey: 'drawer_number' | 'animal_id' | 'meat_id' | 'weight' | 'count' | 'date' | 'price_id' | 'reserved_for';
  showInForm?: boolean;
  muiTextFieldProps?: () => MuiTextFieldProps;
};

const InventoryTable = ({ freezer, fullscreen }: { freezer: Freezer; fullscreen: boolean }) => {
  const drawer_numbers: Array<string | number> = ['Nicht zugewiesen'];
  for (let i = 1; i <= freezer.drawer_numbers; i++) {
    drawer_numbers.push(i);
  }
  const [createRecordOpen, setRecordFormOpen] = useState(false);
  const [tableData, setTableData] = useState<Vension[]>(data);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<Vension> | null>(null);

  const columns = useMemo<MyColumnDef[]>(
    () => [
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

  const handleCreateRecord = (values: Vension) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

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
      tableData[rowToEdit.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
    } else {
      throw new Error("Can't save edits, no row to edit");
    }
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Vension>) => {
      if (!confirm('Bist du sicher, dass du diesen Eintrag löschen möchtest?')) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={tableData}
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
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
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
        onClose={handleOnCloseForm}
        onUpdate={handleSaveRowEdits}
        onSubmit={handleCreateRecord}
      />
    </>
  );
};

export default InventoryTable;
