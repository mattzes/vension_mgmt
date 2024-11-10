import { Typography, Container, Box } from '@mui/material';

export default function Home() {
  return (
    <Container disableGutters>
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <Typography variant="h6" align="center" mt={5}>
          Bitt melde dich an, um die Seite zu nutzen.
        </Typography>
      </Box>
    </Container>
  );
}
