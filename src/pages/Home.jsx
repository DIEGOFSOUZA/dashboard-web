import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';

const modules = [
  { name: 'Vendas', path: '/vendas' },
  { name: 'Financeiro', path: '/financeiro' },
  { name: 'Estoque', path: '/estoque' },
  { name: 'Clientes', path: '/clientes' },
  { name: 'Comercial', path: '/comercial' },
];

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Bem-vindo ao Dashboard
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        Escolha um módulo para acessar:
      </Typography>
      <Grid container spacing={4} justifyContent="center" style={{ marginTop: '2rem' }}>
        {modules.map((mod) => (
          <Grid item key={mod.name} xs={12} sm={6} md={4} lg={2}>
            <Card sx={{ minWidth: 180, boxShadow: 3 }}>
              <CardActionArea component={Link} to={mod.path} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" align="center" color="primary">
                    {mod.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
