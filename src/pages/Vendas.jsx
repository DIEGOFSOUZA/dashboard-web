
import React from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';

function Vendas() {
  // KPIs
  const kpis = [
    {
      label: 'Total Vendido no Mês',
      value: 'R$ 150.000',
      gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Total Vendido na Semana',
      value: 'R$ 38.000',
      gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)',
    },
    {
      label: 'Total Vendido no Dia',
      value: 'R$ 7.500',
      gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)',
    },
    {
      label: 'Ticket Médio',
      value: 'R$ 250',
      gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
    },
    {
      label: 'Pedidos Emitidos',
      value: '600',
      gradient: 'linear-gradient(90deg, #7ed957 0%, #1e466e 100%)',
    },
  ];

  // Evolução do faturamento (linha)
  const faturamentoData = [
    { data: '01/12', valor: 7000 },
    { data: '02/12', valor: 9000 },
    { data: '03/12', valor: 8000 },
    { data: '04/12', valor: 12000 },
    { data: '05/12', valor: 11000 },
    { data: '06/12', valor: 9500 },
    { data: '07/12', valor: 7500 },
  ];

  // Produtos mais vendidos (barras)
  const produtosVendidos = [
    { produto: 'Produto A', vendas: 120 },
    { produto: 'Produto B', vendas: 90 },
    { produto: 'Produto C', vendas: 60 },
    { produto: 'Produto D', vendas: 40 },
    { produto: 'Produto E', vendas: 30 },
  ];

  // Marcas mais vendidas (tabela)
  const marcasVendidas = [
    { marca: 'Marca X', vendas: 300 },
    { marca: 'Marca Y', vendas: 220 },
    { marca: 'Marca Z', vendas: 180 },
  ];

  // Vendas por canal (pizza)
  const canais = [
    { name: 'Loja', value: 40000 },
    { name: 'E-commerce', value: 35000 },
    { name: 'Representante', value: 30000 },
    { name: 'Atacado', value: 25000 },
  ];
  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800'];

  // Vendas por vendedor (tabela)
  const vendedores = [
    { vendedor: 'João', vendas: 40000 },
    { vendedor: 'Maria', vendas: 35000 },
    { vendedor: 'Carlos', vendas: 30000 },
    { vendedor: 'Ana', vendas: 25000 },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#fff' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard de Vendas
          </Typography>
          <Box>
            <IconButton color="inherit"><StoreIcon /></IconButton>
            <IconButton color="inherit"><PaidIcon /></IconButton>
            <IconButton color="inherit"><InventoryIcon /></IconButton>
            <IconButton color="inherit"><PeopleIcon /></IconButton>
            <IconButton color="inherit"><BusinessCenterIcon /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ px: 2, mt: 4 }}>
        {/* KPIs */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {kpis.map((kpi, idx) => (
            <Card key={idx}
              sx={{
                flex: 1,
                maxWidth: '100%',
                background: kpi.gradient,
                color: '#fff',
                borderRadius: 2,
                boxShadow: 3,
                minHeight: 100,
                height: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{kpi.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{kpi.value}</Typography>
            </Card>
          ))}
        </Box>

        {/* Linha: Gráfico de linha (faturamento) e pizza (canais) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Evolução do Faturamento</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={faturamentoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Canal</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={canais} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {canais.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        {/* Linha: Barras (produtos) e tabela (marcas/vendedores) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Produtos Mais Vendidos</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={produtosVendidos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#4caf50" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Marcas Mais Vendidas</Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Marca</TableCell>
                  <TableCell>Vendas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marcasVendidas.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.marca}</TableCell>
                    <TableCell>{row.vendas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Vendedor</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Vendedor</TableCell>
                  <TableCell>Vendas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendedores.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.vendedor}</TableCell>
                    <TableCell>{row.vendas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default Vendas;
