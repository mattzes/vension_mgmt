import React, { useCallback, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export type Vension = {
  id: number;
  drawer_number: number | null;
  animal_type: string;
  meat_type: string;
  weight: number;
  count: number;
  date: string;
  price: number;
  reserved_for: string;
};

export const data: Vension[] = [
  {
    id: 1,
    drawer_number: null,
    animal_type: 'Reh',
    meat_type: 'Rücken',
    weight: 380,
    count: 2,
    date: new Date().toISOString().split('T')[0],
    price: 17.8,
    reserved_for: '',
  },
  {
    id: 8,
    drawer_number: null,
    animal_type: 'Reh',
    meat_type: 'Rücken',
    weight: 600,
    count: 2,
    date: new Date().toISOString().split('T')[0],
    price: 13.5,
    reserved_for: '',
  },
  {
    id: 9,
    drawer_number: 4,
    animal_type: 'Wildschwein',
    meat_type: 'Keule',
    weight: 1100,
    count: 1,
    date: new Date().toISOString().split('T')[0],
    price: 19.0,
    reserved_for: 'Hans',
  },
  {
    id: 10,
    drawer_number: 1,
    animal_type: 'Reh',
    meat_type: 'Für Wurst',
    weight: 340,
    count: 3,
    date: new Date().toISOString().split('T')[0],
    price: 9.8,
    reserved_for: '',
  },
  {
    id: 11,
    drawer_number: 3,
    animal_type: 'Wildschwein',
    meat_type: 'Rücken',
    weight: 850,
    count: 2,
    date: new Date().toISOString().split('T')[0],
    price: 14.2,
    reserved_for: '',
  },
  {
    id: 12,
    drawer_number: 5,
    animal_type: 'Reh',
    meat_type: 'Keule',
    weight: 920,
    count: 1,
    date: new Date().toISOString().split('T')[0],
    price: 15.8,
    reserved_for: 'Silke',
  },
  {
    id: 13,
    drawer_number: 2,
    animal_type: 'Wildschwein',
    meat_type: 'Für Wurst',
    weight: 380,
    count: 4,
    date: new Date().toISOString().split('T')[0],
    price: 10.5,
    reserved_for: 'Hans',
  },
  {
    id: 14,
    drawer_number: 6,
    animal_type: 'Reh',
    meat_type: 'Rücken',
    weight: 550,
    count: 2,
    date: new Date().toISOString().split('T')[0],
    price: 12.9,
    reserved_for: '',
  },
  {
    id: 15,
    drawer_number: null,
    animal_type: 'Wildschwein',
    meat_type: 'Keule',
    weight: 1050,
    count: 1,
    date: new Date().toISOString().split('T')[0],
    price: 18.5,
    reserved_for: 'Silke',
  },
  {
    id: 16,
    drawer_number: 4,
    animal_type: 'Reh',
    meat_type: 'Für Wurst',
    weight: 310,
    count: 3,
    date: new Date().toISOString().split('T')[0],
    price: 9.1,
    reserved_for: '',
  },
  {
    id: 17,
    drawer_number: 1,
    animal_type: 'Wildschwein',
    meat_type: 'Rücken',
    weight: 820,
    count: 2,
    date: new Date().toISOString().split('T')[0],
    price: 13.7,
    reserved_for: 'Hans',
  },
  {
    id: 18,
    drawer_number: 3,
    animal_type: 'Reh',
    meat_type: 'Keule',
    weight: 900,
    count: 1,
    date: new Date().toISOString().split('T')[0],
    price: 16.0,
    reserved_for: 'Silke',
  },
  {
    id: 19,
    drawer_number: 5,
    animal_type: 'Wildschwein',
    meat_type: 'Für Wurst',
    weight: 400,
    count: 4,
    date: new Date().toISOString().split('T')[0],
    price: 10.8,
    reserved_for: '',
  },
];

export const animal_types = ['Reh', 'Wildschwein'];
export const meat_types = ['Rücken', 'Keule', 'Für Wurst'];
export const drawer_numbers = [1, 2, 3, 4, 5, 6];

const FreezerTable = ({
  fullscreen,
  onExpandedChange,
}: {
  fullscreen: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) => {
  const [tableData, setTableData] = useState<Vension[]>(() => data);


  const handleSaveRowEdits: MaterialReactTableProps<Vension>['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal

  const handleExpandedChange = () => {
    onExpandedChange?.(false);
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

  const columns = useMemo<MRT_ColumnDef<Vension>[]>(
    () => [
      {
        accessorKey: 'drawer_number',
        header: 'Schublade',
        size: 0,
        muiTableBodyCellEditTextFieldProps: () => ({
          select: true, //change to select for a dropdown
          children: drawer_numbers.map(drawer_number => (
            <MenuItem key={drawer_number} value={drawer_number}>
              {drawer_number}
            </MenuItem>
          )),
        }),
        GroupedCell: ({ row }) => <>{row.original.drawer_number ? row.original.drawer_number : 'Nicht zugewiesen'}</>,
        Cell: ({ row }) => <>{row.original.drawer_number ? row.original.drawer_number : 'Nicht zugewiesen'}</>,
      },
      {
        accessorKey: 'animal_type',
        header: 'Tierart',
        size: 0,
        muiTableBodyCellEditTextFieldProps: () => ({
          select: true, //change to select for a dropdown
          children: animal_types.map(animal_type => (
            <MenuItem key={animal_type} value={animal_type}>
              {animal_type}
            </MenuItem>
          )),
        }),
      },
      {
        accessorKey: 'meat_type',
        header: 'Fleischart',
        size: 0,
        muiTableBodyCellEditTextFieldProps: () => ({
          select: true, //change to select for a dropdown
          children: meat_types.map(meat_type => (
            <MenuItem key={meat_type} value={meat_type}>
              {meat_type}
            </MenuItem>
          )),
        }),
      },
      {
        accessorKey: 'weight',
        header: 'Gewicht',
        size: 0,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          type: 'number',
        }),
        Cell: ({ row }) => <>{row.original.weight}g</>,
      },
      {
        accessorKey: 'count',
        header: 'Anzahl',
        size: 0,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          type: 'number',
        }),
      },
      {
        accessorKey: 'date',
        header: 'Datum',
        size: 130,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          type: 'date',
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
        accessorKey: 'price',
        header: 'Preis',
        size: 0,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          type: 'number',
        }),
        Cell: ({ row }) => <>{row.original.price.toString().replace('.', ',')}€</>,
      },
      {
        accessorKey: 'reserved_for',
        header: 'Reserviert für',
        size: 0,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        }),
      },
    ],
    []
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
        onEditingRowSave={handleSaveRowEdits}
        onIsFullScreenChange={handleExpandedChange}
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Bearbeiten">
              <IconButton onClick={() => table.setEditingRow(row)}>
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
      />
    </>
  );
};
}


export default FreezerTable;
