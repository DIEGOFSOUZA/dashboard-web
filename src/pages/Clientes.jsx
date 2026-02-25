import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, AppBar, Toolbar, IconButton, Container, CircularProgress, Chip, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useState, useEffect } from 'react';

function Clientes() {
  const navigate = useNavigate();
  
  // Estados de dados
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLista, setLoadingLista] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dados da API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/clientes');
      const result = await response.json();

      // Carrega dados de cache para a pagina, mas lista sera atualizada em tempo real
      setData({
        ...result,
        lista_clientes: []
      });
      setLoadingLista(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erro ao buscar dados');
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListaClientes = async () => {
    try {
      setLoadingLista(true);
      const response = await fetch('/api/clientes/latest');
      const result = await response.json();

      if (response.ok) {
        setData((prev) => ({
          ...(prev || {}),
          lista_clientes: result.lista_clientes || []
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar ultimos clientes:', err);
    } finally {
      setLoadingLista(false);
    }
  };

  // Função para tentar recarregar dados em caso de erro
  const handleRefresh = () => {
    setError(null);
    fetchData();
    fetchListaClientes();
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchData();
    fetchListaClientes();
  }, []);

  // Dados padrão enquanto carrega
  const kpis = data?.kpis
    ? [
        {
          label: 'Total de Clientes',
          value: data.kpis.total_clientes.toLocaleString('pt-BR'),
          icon: <PeopleIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
        },
        {
          label: 'Novos Clientes',
          value: data.kpis.novos_clientes.toLocaleString('pt-BR'),
          icon: <PersonAddAltIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)',
        },
        {
          label: 'Clientes Ativos',
          value: data.kpis.clientes_ativos.toLocaleString('pt-BR'),
          icon: <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
        },
        {
          label: 'Clientes Inativos',
          value: data.kpis.clientes_inativos.toLocaleString('pt-BR'),
          icon: <PersonOffIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #ff7043 0%, #ff5722 100%)',
        },
      ]
    : [
        {
          label: 'Total de Clientes',
          value: '...',
          icon: <PeopleIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
        },
        {
          label: 'Novos Clientes',
          value: '...',
          icon: <PersonAddAltIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)',
        },
        {
          label: 'Clientes Ativos',
          value: '...',
          icon: <TrendingUpIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
        },
        {
          label: 'Clientes Inativos',
          value: '...',
          icon: <PersonOffIcon sx={{ fontSize: 32, opacity: 0.5, ml: 1 }} />,
          gradient: 'linear-gradient(90deg, #ff7043 0%, #ff5722 100%)',
        },
      ];
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#fff' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <IconButton 
            size="large" 
            edge="start" 
            color="inherit" 
            aria-label="home" 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/')}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DASHBOARD DE CLIENTES
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Alerta de Erro */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          <strong>Erro ao carregar dados:</strong> {error}
          <Box sx={{ mt: 1 }}>
            <button 
              onClick={handleRefresh}
              style={{ 
                padding: '4px 12px',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Tentar Novamente
            </button>
          </Box>
        </Alert>
      )}

      <Container maxWidth={false} sx={{ px: 2, mt: 4 }}>
        {/* KPIs */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {kpis.map((kpi, idx) => (
            <Card key={idx}
              sx={{
                flex: 1,
                background: kpi.gradient,
                color: '#fff',
                borderRadius: 2,
                boxShadow: 3,
                minHeight: 120,
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
        <Box sx={{ display: 'flex', gap: 3, mb: 4, width: '100%', flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 calc(60% - 12px)', minWidth: 300, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Clientes por Região</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.por_regiao || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="regiao" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="clientes" fill="#7ecbff" name="Clientes" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
          <Card sx={{ flex: '1 1 calc(40% - 12px)', minWidth: 300, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Evolução de Novos Clientes</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.evolucao_mensal || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="novos" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Box>
        {/* Tabela de Clientes */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Novos Clientes
            </Typography>
          </Box>
          {loadingLista ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : data?.lista_clientes && data.lista_clientes.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Nome</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>E-mail</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Data de Cadastro</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.lista_clientes.map((row, idx) => (
                    <TableRow 
                      key={idx}
                      sx={{ 
                        '&:nth-of-type(odd)': { background: 'rgba(0, 0, 0, 0.02)' },
                        '&:hover': { background: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <TableCell>{row.nome}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          color={row.status === 'Ativo' ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{row.cadastro}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              Nenhum cliente encontrado
            </Alert>
          )}
        </Card>
      </Container>
    </Box>
  );
}

export default Clientes;
