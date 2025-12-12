
import React from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function Financeiro() {
  // KPIs
  const kpis = [
    {
      label: 'Total em Atrasos',
      value: 'R$ 85.000',
      gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Total Pago no Período',
      value: 'R$ 210.000',
      gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)',
    },
    {
      label: 'Índice de Inadimplência',
      value: '8.5%',
      gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)',
    },
    {
      label: 'Limites Utilizados',
      value: 'R$ 120.000',
      gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
    },
  ];

  // Contas a receber/pagar por faixa
  const contasReceber = [
    { faixa: 'Vencido', valor: 85000 },
    { faixa: 'Hoje', valor: 25000 },
    { faixa: 'A Vencer', valor: 140000 },
  ];
  const contasPagar = [
    { faixa: 'Vencido', valor: 20000 },
    { faixa: 'Hoje', valor: 15000 },
    { faixa: 'A Vencer', valor: 110000 },
  ];

  // Gráfico de barras: valores por vencimento
  const barData = [
    { faixa: 'Vencido', Receber: 85000, Pagar: 20000 },
    { faixa: 'Hoje', Receber: 25000, Pagar: 15000 },
    { faixa: 'A Vencer', Receber: 140000, Pagar: 110000 },
  ];

  // Gráfico de pizza: distribuição por carteira
  const carteiras = [
    { name: 'Carteira A', value: 40000 },
    { name: 'Carteira B', value: 60000 },
    { name: 'Carteira C', value: 80000 },
    { name: 'Carteira D', value: 20000 },
  ];
  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800'];

  // Títulos vencidos (tabela)
  const titulosVencidos = [
    { titulo: '12345', cliente: 'Cliente A', vencimento: '2025-12-01', valor: 'R$ 15.000', status: 'Vencido' },
    { titulo: '12346', cliente: 'Cliente B', vencimento: '2025-12-02', valor: 'R$ 20.000', status: 'Vencido' },
    { titulo: '12347', cliente: 'Cliente C', vencimento: '2025-12-03', valor: 'R$ 25.000', status: 'Vencido' },
    { titulo: '12348', cliente: 'Cliente D', vencimento: '2025-12-04', valor: 'R$ 25.000', status: 'Vencido' },
  ];

  // Bancos/carteiras com maior saldo (tabela)
  const bancosCarteiras = [
    { nome: 'Banco XPTO', saldo: 'R$ 80.000' },
    { nome: 'Banco ABC', saldo: 'R$ 60.000' },
    { nome: 'Carteira A', saldo: 'R$ 40.000' },
    { nome: 'Carteira B', saldo: 'R$ 30.000' },
  ];

  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#fff' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/') }>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard de Financeiro
          </Typography>
          {/* Ícones removidos conforme solicitado */}
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

        {/* Linha: Gráfico de barras (valores por vencimento) e pizza (carteiras) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Valores por Vencimento</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Receber" fill="#7ecbff" radius={[8, 8, 0, 0]} name="A Receber" />
                <Bar dataKey="Pagar" fill="#43a047" radius={[8, 8, 0, 0]} name="A Pagar" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Distribuição por Carteira</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={carteiras} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {carteiras.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        {/* Linha: Tabelas (títulos vencidos e bancos/carteiras) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Títulos Vencidos</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulosVencidos.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.titulo}</TableCell>
                      <TableCell>{row.cliente}</TableCell>
                      <TableCell>{row.vencimento}</TableCell>
                      <TableCell>{row.valor}</TableCell>
                      <TableCell sx={{ color: '#d32f2f', fontWeight: 700 }}>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Bancos/Carteiras com Maior Saldo</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bancosCarteiras.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.saldo}</TableCell>
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

export default Financeiro;
