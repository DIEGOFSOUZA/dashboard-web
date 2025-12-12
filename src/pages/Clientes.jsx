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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOffIcon from '@mui/icons-material/PersonOff';

function Clientes() {
  // KPIs
  const kpis = [
    {
      label: 'Total de Clientes',
      value: '2.500',
      icon: <PeopleIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
      gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Novos Clientes',
      value: '120',
      icon: <PersonAddAltIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
      gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)',
    },
    {
      label: 'Clientes Ativos',
      value: '2.100',
      icon: <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
      gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
    },
    {
      label: 'Clientes Inativos',
      value: '400',
      icon: <PersonOffIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
      gradient: 'linear-gradient(90deg, #1e6e5c 0%, #1e466e 100%)',
    },
  ];

  // Gráfico de barras - Clientes por Região
  const barData = [
    { regiao: 'Sudeste', clientes: 1200 },
    { regiao: 'Sul', clientes: 600 },
    { regiao: 'Nordeste', clientes: 400 },
    { regiao: 'Centro-Oeste', clientes: 200 },
    { regiao: 'Norte', clientes: 100 },
  ];

  // Gráfico de linha - Evolução de Novos Clientes
  const lineData = [
    { mes: 'Jan', novos: 10 },
    { mes: 'Fev', novos: 15 },
    { mes: 'Mar', novos: 20 },
    { mes: 'Abr', novos: 18 },
    { mes: 'Mai', novos: 22 },
    { mes: 'Jun', novos: 25 },
    { mes: 'Jul', novos: 30 },
    { mes: 'Ago', novos: 28 },
    { mes: 'Set', novos: 35 },
    { mes: 'Out', novos: 40 },
    { mes: 'Nov', novos: 45 },
    { mes: 'Dez', novos: 50 },
  ];

  // Tabela de clientes
  const clientes = [
    { nome: 'João Silva', email: 'joao@email.com', status: 'Ativo', cadastro: '2023-01-10' },
    { nome: 'Maria Souza', email: 'maria@email.com', status: 'Ativo', cadastro: '2023-02-15' },
    { nome: 'Carlos Lima', email: 'carlos@email.com', status: 'Inativo', cadastro: '2022-11-20' },
    { nome: 'Ana Paula', email: 'ana@email.com', status: 'Ativo', cadastro: '2023-03-05' },
    { nome: 'Fernanda Dias', email: 'fernanda@email.com', status: 'Inativo', cadastro: '2022-09-30' },
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
            DASHBOARD DE CLIENTES
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
                minHeight: 120,
                height: 120,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
                px: 3,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{kpi.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{kpi.value}</Typography>
              </Box>
              {kpi.icon}
            </Card>
          ))}
        </Box>
        {/* Gráficos */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, width: '100%' }}>
          <Card sx={{ flex: 1.5, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Clientes por Região</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="regiao" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clientes" fill="#7ecbff" name="Clientes" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Evolução de Novos Clientes</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="novos" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Box>
        {/* Tabela */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Lista de Clientes</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data de Cadastro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell sx={{ color: row.status === 'Ativo' ? '#43a047' : '#d32f2f', fontWeight: 700 }}>{row.status}</TableCell>
                    <TableCell>{row.cadastro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Box>
  );
}

export default Clientes;
