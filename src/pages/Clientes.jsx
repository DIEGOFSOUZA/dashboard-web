import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, AppBar, Toolbar, IconButton, Container, CircularProgress, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useState, useEffect } from 'react';

function fmtTimestamp(ts) {
  if (!ts) return '';
  const [datePart = '', timePart = ''] = ts.split('T');
  const [y, m, d] = datePart.split('-');
  return `${d}/${m}/${y} ${timePart.slice(0, 5)}`;
}

function Clientes() {
  const navigate = useNavigate();
  
  // Estados de dados
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLista, setLoadingLista] = useState(true);
  const [error, setError] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

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

      // Buscar timestamp do cache
      try {
        const cacheResp = await fetch('/api/cache/clientes_dashboard.json');
        if (cacheResp.ok) {
          const cacheJson = await cacheResp.json();
          setCacheTimestamp(cacheJson.timestamp || null);
        }
      } catch (_) {}
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
  const handleRetry = () => {
    setError(null);
    fetchData();
    fetchListaClientes();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const resp = await fetch('/api/cache/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'clientes' }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    } catch (err) {
      console.error('[Clientes] Erro ao atualizar cache:', err);
    } finally {
      setRefreshing(false);
      fetchData();
      fetchListaClientes();
    }
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
          {cacheTimestamp && (
            <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
              Atualizado: {fmtTimestamp(cacheTimestamp)}
            </Typography>
          )}
          <IconButton color="inherit" onClick={handleRefresh} disabled={refreshing} size="small" title="Atualizar dados" sx={{ ml: 0.5 }}>
            {refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon fontSize="small" />}
          </IconButton>
          <IconButton color="inherit" onClick={() => setInfoOpen(true)} size="small" title="Como os dados são calculados" sx={{ ml: 0.5 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Alerta de Erro */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          <strong>Erro ao carregar dados:</strong> {error}
          <Box sx={{ mt: 1 }}>
            <button 
              onClick={handleRetry}
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
      {/* Dialog: Como os dados são calculados */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)', color: '#fff', fontWeight: 700 }}>
          Como os dados são calculados
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List disablePadding>
            <ListItem sx={{ px: 2, pt: 2, pb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>KPIs Principais</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Total de Clientes" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Número total de clientes cadastrados e ativos no ERP Totvs Moda." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Novos Clientes" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Clientes com registro de primeira compra nos últimos 90 dias. Indica a entrada de novos compradores na carteira." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Clientes Inadimplentes" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Clientes que possuem pelo menos um título de cobrança vencido e ainda não pago no sistema financeiro." />
            </ListItem>
            <ListItem sx={{ px: 2, pt: 2, pb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>Gráficos e Tabela</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Novos × Inadimplentes" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Comparativo mensal mostrando a evolução de clientes novos e clientes que entraram em inadimplência em cada mês." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Curva ABC" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Classifica os clientes pelo volume de compras: A (top 20%, maior faturamento), B (30% seguintes), C (50% restantes). Ajuda a priorizar a carteira." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2, pb: 2 }}>
              <ListItemText primary="Lista de Clientes" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Relação completa dos clientes com valor total comprado no período e status de adimplência. Atualizada em tempo real a cada acesso." />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 2 }}>
          <Button onClick={() => setInfoOpen(false)} variant="contained" sx={{ background: '#1e466e', '&:hover': { background: '#0f2239' } }}>Fechar</Button>
        </DialogActions>
      </Dialog>
      {refreshing && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6, minWidth: 320, textAlign: 'center' }}>
            <CircularProgress size={52} thickness={4} sx={{ color: '#1e466e' }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>Atualizando dados de clientes</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Isso pode levar até 90 segundos...</Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Clientes;
