import React from 'react';
import { Card, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

function Vendas() {
    // Dados de exemplo para o gráfico Vendas por Período
    const salesData = [
      { date: '2025-12-01', vendas: 9000, meta: 7000 },
      { date: '2025-12-02', vendas: 11500, meta: 8000 },
      { date: '2025-12-03', vendas: 8000, meta: 7500 },
      { date: '2025-12-04', vendas: 14500, meta: 6000 },
      { date: '2025-12-05', vendas: 6000, meta: 4000 },
      { date: '2025-12-06', vendas: 7500, meta: 3500 },
    ];
  // KPIs do dashboard
  const kpis = [
    {
      label: 'Total de Vendas',
      value: 'R$ 150.000',
      gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Ticket Médio',
      value: 'R$ 250',
      gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)',
    },
    {
      label: 'Pedidos',
      value: '600',
      gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)',
    },
    {
      label: 'Crescimento (%)',
      value: '12.5%',
      gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
    },
  ];
  // Dados de exemplo para o gráfico Vendas por Canal
  const channelData = [
    { name: 'Representantes', value: 35000 },
    { name: 'E-Commerce', value: 30000 },
    { name: 'Direto', value: 25000 },
    { name: 'Loja Prudente', value: 20000 },
    { name: 'Loja Marilia', value: 15000 },
    { name: 'Loja Rio', value: 10000 },
  ];
  // Ajustar as cores do gráfico de pizza para 6 canais
  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800', '#e91e63', '#00bcd4'];

  // Dados de exemplo para o gráfico Top Produtos
  const topProductsData = [
    { name: 'SD40', quantidade: 120 },
    { name: 'IF22', quantidade: 90 },
    { name: 'A023', quantidade: 60 },
    { name: 'KC01', quantidade: 40 },
    { name: 'F15556', quantidade: 10 },
  ];

  // Dados de exemplo para a tabela detalhada de períodos
  const detailedTableData = [
    { periodo: 'Carmasta X', valor: 120, quantiticada: '00', quanticade: 'R$ 6300' },
    { periodo: 'Calça Y', valor: 3, quantiticada: '00', quanticade: 'R$ 6800' },
    { periodo: 'Tibna Z', valor: 3, quantiticada: '00', quanticade: 'R$ 5000' },
  ];

  // Dados de exemplo para a tabela detalhada de canais
  const detailedChannelData = [
    { canal: 'Loja', valor: 'R$ 90 000', quantidade: 400 },
    { canal: 'E-commerce', valor: 'R$ 60 000', quantidade: 200 },
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
        {/* Gráficos e Tabelas */}
        {/* Linha: Vendas por Período e Vendas por Canal */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Período</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#22336b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Canal</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {channelData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>
        {/* Linha: Top Produtos e Tabelas Detalhadas */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Top Produtos</Typography>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topProductsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#4caf50" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Tabelas Detalhadas</Typography>
            <Box sx={{ flex: 1, overflow: 'auto', maxHeight: 140, mb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Período</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Quantiticada</TableCell>
                    <TableCell>Quanticade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailedTableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.periodo}</TableCell>
                      <TableCell>{row.valor}</TableCell>
                      <TableCell>{row.quantiticada}</TableCell>
                      <TableCell>{row.quanticade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', maxHeight: 100 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Canal</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Quantidade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailedChannelData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.canal}</TableCell>
                      <TableCell>{row.valor}</TableCell>
                      <TableCell>{row.quantidade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default Vendas;
