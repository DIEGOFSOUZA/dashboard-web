
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, Container } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const modules = [
  { name: 'Vendas', path: '/vendas', icon: <StoreIcon sx={{ fontSize: 40, color: '#fff' }} /> },
  { name: 'Financeiro', path: '/financeiro', icon: <PaidIcon sx={{ fontSize: 40, color: '#fff' }} /> },
  { name: 'Estoque', path: '/estoque', icon: <InventoryIcon sx={{ fontSize: 40, color: '#fff' }} /> },
  { name: 'Clientes', path: '/clientes', icon: <PeopleIcon sx={{ fontSize: 40, color: '#fff' }} /> },
  { name: 'Comercial', path: '/comercial', icon: <BusinessCenterIcon sx={{ fontSize: 40, color: '#fff' }} /> },
];

const gradients = [
  'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
  'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
  'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
  'linear-gradient(90deg, #1976d2 0%, #7ecbff 100%)',
  'linear-gradient(90deg, #607d8b 0%, #90a4ae 100%)',
];

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#f5f7fa' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            DASHBOARD CORPORATIVO
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: '#22336b' }}>
          Bem-vindo ao Dashboard
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Escolha um módulo para acessar:
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {modules.map((mod, idx) => (
            <Grid item key={mod.name} xs={12} sm={6} md={4} lg={2}>
              <Card
                sx={{
                  minWidth: 180,
                  minHeight: 180,
                  background: gradients[idx % gradients.length],
                  color: '#fff',
                  borderRadius: 3,
                  boxShadow: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 8 },
                }}
              >
                <CardActionArea component={Link} to={mod.path} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Box sx={{ mb: 2 }}>{mod.icon}</Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: '#fff' }}>
                      {mod.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
