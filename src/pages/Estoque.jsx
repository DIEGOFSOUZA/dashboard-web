import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Estoque() {
  // KPIs principais
  const kpis = [
    {
      label: 'Total em Estoque',
      value: 'R$ 1.500.000',
      icon: <InventoryIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Produtos Abaixo do Mínimo',
      value: '18',
      icon: <WarningAmberIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
    },
    {
      label: 'Giro de Estoque',
      value: '2.1x / 30 dias',
      icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
    },
    {
      label: 'Produtos Parados',
      value: '7',
      icon: <AccessTimeIcon sx={{ fontSize: 36, color: '#fff' }} />,
      gradient: 'linear-gradient(90deg, #607d8b 0%, #90a4ae 100%)',
    },
  ];

  // Gráfico de barras - Estoque por Categoria
  const barData = [
    { categoria: 'Eletrônicos', atual: 1100000, minimo: 1050000 },
    { categoria: 'Roupas', atual: 800000, minimo: 780000 },
    { categoria: 'Alimentos', atual: 550000, minimo: 520000 },
    { categoria: 'Bebidas', atual: 300000, minimo: 280000 },
  ];

  // Gráfico de linha - Evolução do Giro de Estoque
  const lineData = [
    { mes: 'Jan', giro: 0.5 },
    { mes: 'Fev', giro: 0.7 },
    { mes: 'Mar', giro: 0.9 },
    { mes: 'Abr', giro: 1.1 },
    { mes: 'Mai', giro: 1.3 },
    { mes: 'Jun', giro: 1.5 },
    { mes: 'Jul', giro: 1.7 },
    { mes: 'Ago', giro: 1.9 },
    { mes: 'Set', giro: 2.1 },
    { mes: 'Out', giro: 2.2 },
    { mes: 'Nov', giro: 2.4 },
    { mes: 'Dez', giro: 2.6 },
  ];

  // Tabela Estoque por Depósito / Loja
  const estoqueDeposito = [
    { loja: 'Loja A', quantidade: 60, valor: 'R$ 1.500.000' },
    { loja: 'Depósito 1', quantidade: 100, valor: 'R$ 2.000.000' },
    { loja: 'Depósito 2', quantidade: 90, valor: 'R$ 1.000.000' },
    { loja: 'Loja B', quantidade: 10, valor: 'R$ 500.000' },
  ];

  // Tabela Produtos com Estoque Abaixo do Mínimo
  const produtosCriticos = [
    { produto: 'Produto 1', categoria: 'Eletrônicos', atual: 25, minimo: 30, status: 'Crítico' },
    { produto: 'Produto 2', categoria: 'Roupas', atual: 25, minimo: 30, status: 'Crítico' },
    { produto: 'Produto 3', categoria: 'Alimentos', atual: 20, minimo: 25, status: 'Crítico' },
    { produto: 'Produto 4', categoria: 'Bebidas', atual: 15, minimo: 15, status: 'Crítico' },
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
            DASHBOARD DE ESTOQUE
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
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Estoque por Categoria</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="atual" fill="#1976d2" name="Atual" radius={[8, 8, 0, 0]} />
                <Bar dataKey="minimo" fill="#43a047" name="Mínimo" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Evolução do Giro de Estoque</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="giro" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Box>
        {/* Tabelas */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Estoque por Depósito / Loja</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Loja</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estoqueDeposito.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.loja}</TableCell>
                      <TableCell>{row.quantidade}</TableCell>
                      <TableCell>{row.valor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Produtos com Estoque Abaixo do Mínimo</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Estoque Atual</TableCell>
                    <TableCell>Mínimo</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produtosCriticos.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.produto}</TableCell>
                      <TableCell>{row.categoria}</TableCell>
                      <TableCell>{row.atual}</TableCell>
                      <TableCell>{row.minimo}</TableCell>
                      <TableCell sx={{ color: '#d32f2f', fontWeight: 700 }}>{row.status}</TableCell>
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

export default Estoque;
