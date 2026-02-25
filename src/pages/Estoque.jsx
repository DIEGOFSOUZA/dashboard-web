import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, AppBar, Toolbar, IconButton, Container, Tooltip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
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
import { useState, useEffect } from 'react';
import axios from 'axios';

function Estoque() {
  const navigate = useNavigate();
  
  // Estados para dados do backend
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [estoqueDeposito, setEstoqueDeposito] = useState([]);
  const [produtosCriticos, setProdutosCriticos] = useState([]);

  // Buscar dados do backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/estoque');
      const data = response.data;

      // Montar KPIs
      const kpisData = [
        {
          label: 'Total em Estoque',
          value: data.kpis.total_estoque || 'R$ 0',
          icon: <InventoryIcon sx={{ fontSize: 36, color: '#fff' }} />,
          gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
        },
        {
          label: 'Produtos Abaixo do Mínimo',
          value: data.kpis.produtos_abaixo_minimo || 0,
          icon: <WarningAmberIcon sx={{ fontSize: 36, color: '#fff' }} />,
          gradient: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
        },
        {
          label: 'Giro de Estoque',
          value: data.kpis.giro_estoque || '0x / 30 dias',
          icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#fff' }} />,
          gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
        },
        {
          label: 'Produtos Parados',
          value: data.kpis.produtos_parados || 0,
          icon: <AccessTimeIcon sx={{ fontSize: 36, color: '#fff' }} />,
          gradient: 'linear-gradient(90deg, #607d8b 0%, #90a4ae 100%)',
        },
      ];

      setKpis(kpisData);
      setBarData(data.estoque_por_categoria || []);
      setLineData(data.evolucao_giro || []);
      setEstoqueDeposito(data.estoque_por_deposito || []);
      setProdutosCriticos(data.produtos_criticos || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados de estoque:', error);
      setLoading(false);
    }
  };

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
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Atualizar Dados">
              <IconButton
                color="inherit"
                aria-label="Atualizar Dados"
                onClick={fetchData}
                sx={{ ml: 1, p: 1, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', transition: 'background 0.2s', '&:hover': { background: 'rgba(255,255,255,0.18)' } }}
                size="large"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
                  <path d="M1 14a9 9 0 0 0 14.13 3.36L23 14" />
                </svg>
              </IconButton>
            </Tooltip>
          </Box>
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
                <RechartsTooltip />
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
                <RechartsTooltip />
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
