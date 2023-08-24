'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_Row, type MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, IconButton, Paper, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export type Price = {
  animal_type: string;
  meat_type: string;
  price: number;
};

export const PricingTable = () => {
  const data: Price[] = [
    {
      animal_type: 'Reh',
      meat_type: 'Rücken',
      price: 10.0,
    },
    {
      animal_type: 'Hirsch',
      meat_type: 'Keule',
      price: 15.0,
    },
    {
      animal_type: 'Wildschwein',
      meat_type: 'Schulter',
      price: 8.5,
    },
    {
      animal_type: 'Fasan',
      meat_type: 'Brust',
      price: 5.0,
    },
    {
      animal_type: 'Wildente',
      meat_type: 'Keule',
      price: 7.5,
    },
  ];

  const theme = useTheme();
  const [tableData, setTableData] = useState<Price[]>(data);
  const disableGutters = useMediaQuery(() => theme.breakpoints.down('md'));

  const columns = useMemo<MRT_ColumnDef<Price>[]>(
    () => [
      {
        accessorKey: 'animal_type',
        header: 'Tierart',
        size: 0,
        enableEditing: false,
      },
      {
        accessorKey: 'meat_type',
        header: 'Fleischart',
        size: 0,
        enableEditing: false,
      },
      {
        editable: false,
        accessorKey: 'price',
        header: 'Preis',
        size: 0,
        muiTextFieldProps: () => ({
          type: 'number',
        }),
        Cell: ({ row }) => <>{row.original.price?.toString().replace('.', ',')}€</>,
      },
    ],
    []
  );

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
              <IconButton>
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
          variant: 'outlined',
          sx: { mt: disableGutters ? 0 : 3 },
        }}
        renderTopToolbarCustomActions={() => (
          <Button color="secondary" variant="contained" sx={{ mt: 1, ml: 1 }}>
            Neuer Eintrag
          </Button>
        )}
      />
    </Container>
  );
};
