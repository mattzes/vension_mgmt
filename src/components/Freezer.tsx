import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

export default function Home({ freezer }: { freezer: string }) {
  return (
    <>
      <Card sx={{ m: 3, display: 'flex' }} elevation={7}>
        <Box sx={{ p: 2, display: 'flex', width: '100%' }}>
          <Box>
            <Typography variant="h5">Freezer Icon</Typography>
          </Box>
          <Box>
            <Typography variant="h5">{freezer}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Typography variant="h5">Collapse Icon</Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
}
