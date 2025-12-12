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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import PercentIcon from '@mui/icons-material/Percent';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, FunnelChart, Funnel, LabelList } from 'recharts';

function ComercialDashboard() {
  // KPIs
  const kpis = [
    {
      label: 'Pedidos em Aberto',
      value: '120',
      icon: <AssignmentIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Pedidos Bloqueados',
      value: '8',
      icon: <CreditCardOffIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
    },
    {
      label: 'Previsão de Faturamento',
      value: 'R$ 320.000',
      icon: <PaidIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
    },
    {
      label: 'Margem Média',
      value: '18,5%',
      icon: <PercentIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #1976d2 0%, #7ecbff 100%)',
    },
    {
      label: 'Meta vs Realizado',
      value: 'R$ 400.000 / R$ 320.000',
      icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #7ed957 0%, #1e466e 100%)',
    },
  ];

  // Funil de vendas (etapas do pedido)
  const funilData = [
    { etapa: 'Proposta', valor: 200 },
    { etapa: 'Aprovado', valor: 150 },
    { etapa: 'Faturado', valor: 120 },
    { etapa: 'Entregue', valor: 100 },
  ];

  // Pedidos por vendedor (barras)
  const pedidosVendedor = [
    { vendedor: 'João', pedidos: 40 },
    { vendedor: 'Maria', pedidos: 35 },
    { vendedor: 'Carlos', pedidos: 25 },
    { vendedor: 'Ana', pedidos: 20 },
  ];

  // Meta vs realizado (linha)
  const metaRealizado = [
    { mes: 'Jan', meta: 30000, realizado: 28000 },
    { mes: 'Fev', meta: 35000, realizado: 32000 },
    { mes: 'Mar', meta: 40000, realizado: 39000 },
    { mes: 'Abr', meta: 42000, realizado: 41000 },
    { mes: 'Mai', meta: 45000, realizado: 42000 },
    { mes: 'Jun', meta: 50000, realizado: 47000 },
    { mes: 'Jul', meta: 52000, realizado: 48000 },
    { mes: 'Ago', meta: 55000, realizado: 50000 },
    { mes: 'Set', meta: 60000, realizado: 54000 },
    { mes: 'Out', meta: 65000, realizado: 60000 },
    { mes: 'Nov', meta: 70000, realizado: 65000 },
    { mes: 'Dez', meta: 75000, realizado: 70000 },
  ];

  // Pedidos por status (tabela)
  const pedidosStatus = [
    { status: 'Aguardando Aprovação', quantidade: 30 },
    { status: 'Aprovado', quantidade: 50 },
    { status: 'Faturado', quantidade: 25 },
    { status: 'Entregue', quantidade: 15 },
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
            DASHBOARD COMERCIAL
          </Typography>
          {/* Ícones removidos conforme solicitado */}
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ px: 2, mt: 4 }}>
        {/* KPIs */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          {kpis.map((kpi, idx) => (
            <Card key={idx}
              sx={{
                flex: 1,
                maxWidth: '100%',
                background: kpi.gradient,
                color: '#fff',
                borderRadius: 2,
                boxShadow: 3,
                minHeight: 120,
                height: 120,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
                px: 3,
                mb: { xs: 2, md: 0 },
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', fontSize: 13 }}>{kpi.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, whiteSpace: 'pre-line' }}>{kpi.value}</Typography>
              </Box>
              {kpi.icon}
            </Card>
          ))}
        </Box>
        {/* Gráficos */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4, width: '100%' }}>
          <Card sx={{ flex: 1.5, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340, mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Funil de Vendas</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="valor" data={funilData} isAnimationActive>
                  <LabelList dataKey="etapa" position="right" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pedidos por Vendedor</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pedidosVendedor} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="vendedor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pedidos" fill="#1976d2" name="Pedidos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Meta vs Realizado</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={metaRealizado} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="meta" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} name="Meta" />
                <Line type="monotone" dataKey="realizado" stroke="#43a047" strokeWidth={3} dot={{ r: 5 }} name="Realizado" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Box>
        {/* Tabelas */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pedidos por Status</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Quantidade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidosStatus.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.quantidade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default ComercialDashboard;
