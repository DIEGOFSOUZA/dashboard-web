import React, { useEffect, useState } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Tooltip as MuiTooltip, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, List, ListItem, ListItemText
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) return '';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('T')[0].split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

const PIE_COLORS = ['#1e466e', '#2979b0', '#43a047', '#ff9800', '#e53935', '#8e24aa'];

function Financeiro() {
  const navigate = useNavigate();

  const [kpisData, setKpisData] = useState({});
  const [barData, setBarData] = useState([]);
  const [carteiras, setCarteiras] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [topFornecedores, setTopFornecedores] = useState([]);
  const [titulosVencidosReceber, setTitulosVencidosReceber] = useState([]);
  const [titulosVencidosPagar, setTitulosVencidosPagar] = useState([]);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // KPIs em tempo real (buscados ao vivo)
  const [kpiHoje, setKpiHoje] = useState({ a_pagar_hoje: null, recebidos_hoje: null });
  const [loadingHoje, setLoadingHoje] = useState(true);
  const [errorHoje, setErrorHoje] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadCacheData = async () => {
      try {
        const url = '/api/cache/financeiro_dashboard.json';
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const cacheContent = await resp.json();

        if (!isMounted) return;

        const data = cacheContent.data || cacheContent;
        setCacheTimestamp(cacheContent.timestamp || null);
        setKpisData(data.kpis || {});
        setBarData(data.barData || []);
        setCarteiras(data.carteiras || []);
        setFornecedores(data.fornecedores || []);
        setTopClientes(data.topClientes || []);
        setTopFornecedores(data.topFornecedores || []);
        setTitulosVencidosReceber(data.titulosVencidosReceber || []);
        setTitulosVencidosPagar(data.titulosVencidosPagar || []);

        console.log('[Financeiro]  Cache carregado:', {
          kpis: Object.keys(data.kpis || {}).length,
          barData: (data.barData || []).length,
          topClientes: (data.topClientes || []).length,
          vencidosReceber: (data.titulosVencidosReceber || []).length,
          vencidosPagar: (data.titulosVencidosPagar || []).length,
        });
      } catch (error) {
        console.error('[Financeiro]  Erro ao carregar cache:', error);
        if (isMounted) {
          setKpisData({});
          setBarData([]);
          setCarteiras([]);
          setFornecedores([]);
          setTopClientes([]);
          setTopFornecedores([]);
          setTitulosVencidosReceber([]);
          setTitulosVencidosPagar([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCacheData();
    return () => { isMounted = false; };
  }, [refreshKey]);

  // Busca em tempo real: KPIs do dia corrente
  useEffect(() => {
    let isMounted = true;
    const loadHoje = async () => {
      try {
        const resp = await fetch('/api/financeiro/hoje');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (isMounted) {
          setKpiHoje({ a_pagar_hoje: data.a_pagar_hoje ?? 0, recebidos_hoje: data.recebidos_hoje ?? 0 });
          setErrorHoje(false);
        }
      } catch (err) {
        console.error('[Financeiro] ❌ Erro ao buscar KPIs do dia:', err);
        if (isMounted) setErrorHoje(true);
      } finally {
        if (isMounted) setLoadingHoje(false);
      }
    };
    loadHoje();
    return () => { isMounted = false; };
  }, [refreshKey]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const resp = await fetch('/api/cache/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'financeiro' }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    } catch (err) {
      console.error('[Financeiro] Erro ao atualizar cache:', err);
    } finally {
      setRefreshing(false);
      setRefreshKey(k => k + 1);
    }
  };

  const mainKpis = [
    {
      label: 'A Receber',
      value: kpisData.a_receber ?? 0,
      tooltip: 'Total de títulos em aberto a receber no mês (não vencidos)',
      gradient: 'linear-gradient(135deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Vencido a Receber',
      value: kpisData.vencido_a_receber ?? kpisData.total_em_atrasos ?? 0,
      tooltip: 'Total de títulos a receber com vencimento anterior a hoje',
      gradient: 'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)',
    },
    {
      label: 'A Pagar',
      value: kpisData.a_pagar ?? 0,
      tooltip: 'Total de duplicatas em aberto a pagar no mês',
      gradient: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
    },
    {
      label: 'Vencido a Pagar',
      value: kpisData.vencido_a_pagar ?? 0,
      tooltip: 'Total de duplicatas a pagar com vencimento anterior a hoje',
      gradient: 'linear-gradient(135deg, #e65100 0%, #ff9800 100%)',
    },
  ];

  const metricKpis = [
    {
      label: 'Inadimplência',
      value: `${(kpisData.inadimplencia ?? 0).toFixed(1)}%`,
      tooltip: 'Percentual do valor vencido a receber sobre o total a receber',
      color: (kpisData.inadimplencia ?? 0) > 20 ? '#e53935' : '#43a047',
    },
    {
      label: 'PMR (dias)',
      value: kpisData.pmr ?? 0,
      tooltip: 'Prazo Médio de Recebimento  média de dias até o vencimento dos títulos a receber em aberto (90 dias)',
      color: '#1e466e',
    },
    {
      label: 'PMP (dias)',
      value: kpisData.pmp ?? 0,
      tooltip: 'Prazo Médio de Pagamento  média de dias até o vencimento das duplicatas a pagar em aberto (90 dias)',
      color: '#388e3c',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 4, minWidth: 320, textAlign: 'center' }}>
          <CircularProgress size={56} thickness={4} sx={{ color: '#1e466e' }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>Carregando dados financeiros</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Aguarde enquanto atualizamos o dashboard.</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#f5f6fa' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/')}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard Financeiro
          </Typography>
          {cacheTimestamp && (
            <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
              Atualizado: {formatDate(cacheTimestamp)} {cacheTimestamp ? cacheTimestamp.split('T')[1]?.slice(0, 5) : ''}
            </Typography>
          )}
          <MuiTooltip title="Atualizar dados" arrow>
            <span>
              <IconButton color="inherit" onClick={() => setConfirmOpen(true)} disabled={refreshing} size="small" sx={{ ml: 0.5 }}>
                {refreshing
                  ? <CircularProgress size={20} color="inherit" />
                  : <RefreshIcon fontSize="small" />}
              </IconButton>
            </span>
          </MuiTooltip>
          <IconButton color="inherit" onClick={() => setInfoOpen(true)} size="small" title="Como os dados são calculados" sx={{ ml: 0.5 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ px: 2, mt: 3 }}>

        {/* Row 1: 4 Main KPI Cards */}
        <Box sx={{ display: 'grid', gap: 2, mb: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
          {mainKpis.map((kpi, idx) => (
            <MuiTooltip key={idx} title={kpi.tooltip} arrow placement="top">
              <Card sx={{
                background: kpi.gradient,
                color: '#fff',
                borderRadius: 2,
                boxShadow: 3,
                p: 2.5,
                textAlign: 'center',
                cursor: 'default',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
              }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.85, fontWeight: 500, mb: 0.5 }}>{kpi.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  {formatCurrency(kpi.value)}
                </Typography>
              </Card>
            </MuiTooltip>
          ))}
        </Box>

        {/* Row 1.5: KPIs Ao Vivo (hoje) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{
            width: 10, height: 10, borderRadius: '50%', background: '#e53935',
            animation: 'pulse 1.4s ease-in-out infinite',
            '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
          }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#e53935', letterSpacing: 1, textTransform: 'uppercase' }}>
            Hoje — Tempo Real
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gap: 2, mb: 3, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(2, 1fr)' } }}>
          {/* A Pagar Hoje */}
          <MuiTooltip title="Duplicatas com vencimento hoje ainda não pagas — atualizado agora" arrow placement="top">
            <Card sx={{
              background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: 3,
              p: 2.5,
              textAlign: 'center',
              cursor: 'default',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.85, fontWeight: 500 }}>A Pagar Hoje</Typography>
                <Chip label="AO VIVO" size="small" sx={{ fontSize: 9, fontWeight: 700, height: 16, background: 'rgba(255,255,255,0.25)', color: '#fff', letterSpacing: 0.5 }} />
              </Box>
              {loadingHoje ? (
                <CircularProgress size={28} thickness={4} sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }} />
              ) : errorHoje ? (
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.7 }}>Erro</Typography>
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  {formatCurrency(kpiHoje.a_pagar_hoje)}
                </Typography>
              )}
            </Card>
          </MuiTooltip>

          {/* Recebidos Hoje */}
          <MuiTooltip title="Títulos a receber baixados/pagos hoje — atualizado agora" arrow placement="top">
            <Card sx={{
              background: 'linear-gradient(135deg, #006064 0%, #00838f 100%)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: 3,
              p: 2.5,
              textAlign: 'center',
              cursor: 'default',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.85, fontWeight: 500 }}>Recebidos Hoje</Typography>
                <Chip label="AO VIVO" size="small" sx={{ fontSize: 9, fontWeight: 700, height: 16, background: 'rgba(255,255,255,0.25)', color: '#fff', letterSpacing: 0.5 }} />
              </Box>
              {loadingHoje ? (
                <CircularProgress size={28} thickness={4} sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }} />
              ) : errorHoje ? (
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.7 }}>Erro</Typography>
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  {formatCurrency(kpiHoje.recebidos_hoje)}
                </Typography>
              )}
            </Card>
          </MuiTooltip>
        </Box>

        {/* Row 2: 3 Metric Cards */}
        <Box sx={{ display: 'grid', gap: 2, mb: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
          {metricKpis.map((kpi, idx) => (
            <MuiTooltip key={idx} title={kpi.tooltip} arrow placement="top">
              <Card sx={{
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
                textAlign: 'center',
                borderLeft: `4px solid ${kpi.color}`,
                background: '#fff',
                cursor: 'default',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
              }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>{kpi.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: kpi.color }}>
                  {kpi.value}
                </Typography>
              </Card>
            </MuiTooltip>
          ))}
        </Box>

        {/* Row 3: BarChart (2/3) + Recebíveis Pie (1/3) */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card sx={{ flex: 2, borderRadius: 3, boxShadow: 2, p: 3, background: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0f2239' }}>
              Receber &amp; Pagar por Faixa de Vencimento
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="faixa" tick={{ fontSize: 13 }} />
                <YAxis width={80} tickFormatter={v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 })} tick={{ fontSize: 11 }} />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Receber" fill="#1e466e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pagar" fill="#ff9800" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2, p: 3, background: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#0f2239' }}>Recebíveis por Cliente</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={carteiras} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={30} label={false}>
                  {carteiras.map((_, idx) => <Cell key={`c-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend layout="vertical" align="right" verticalAlign="middle"
                  formatter={(v) => v.length > 22 ? `${v.slice(0, 22)}...` : v}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        {/* Row 4: Pagáveis Pie (1/3) + Top Clientes Table (2/3) */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2, p: 3, background: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#0f2239' }}>Pagáveis por Fornecedor</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={fornecedores} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={30} label={false}>
                  {fornecedores.map((_, idx) => <Cell key={`f-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend layout="vertical" align="right" verticalAlign="middle"
                  formatter={(v) => v.length > 22 ? `${v.slice(0, 22)}...` : v}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card sx={{ flex: 2, borderRadius: 3, boxShadow: 2, p: 3, background: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0f2239' }}>Top Clientes  Títulos Abertos</Typography>
            <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ background: '#1e466e', color: '#fff', fontWeight: 600, width: 32 }}>#</TableCell>
                    <TableCell sx={{ background: '#1e466e', color: '#fff', fontWeight: 600 }}>Cliente</TableCell>
                    <TableCell align="right" sx={{ background: '#1e466e', color: '#fff', fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topClientes.map((item, idx) => (
                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { background: '#f8f9fc' } }}>
                      <TableCell sx={{ color: '#888', fontSize: 12 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{item.cliente}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 13, fontWeight: 500 }}>{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                  {topClientes.length === 0 && (
                    <TableRow><TableCell colSpan={3} align="center" sx={{ color: '#aaa' }}>Sem dados</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        {/* Row 5: Top Fornecedores */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, p: 3, mb: 3, background: '#fff' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0f2239' }}>Top Fornecedores  Duplicatas Abertas</Typography>
          <TableContainer sx={{ maxHeight: 260, overflowY: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ background: '#1b5e20', color: '#fff', fontWeight: 600, width: 32 }}>#</TableCell>
                  <TableCell sx={{ background: '#1b5e20', color: '#fff', fontWeight: 600 }}>Fornecedor</TableCell>
                  <TableCell align="right" sx={{ background: '#1b5e20', color: '#fff', fontWeight: 600 }}>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topFornecedores.map((item, idx) => (
                  <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { background: '#f8f9fc' } }}>
                    <TableCell sx={{ color: '#888', fontSize: 12 }}>{idx + 1}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{item.fornecedor}</TableCell>
                    <TableCell align="right" sx={{ fontSize: 13, fontWeight: 500 }}>{formatCurrency(item.valor)}</TableCell>
                  </TableRow>
                ))}
                {topFornecedores.length === 0 && (
                  <TableRow><TableCell colSpan={3} align="center" sx={{ color: '#aaa' }}>Sem dados</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Row 6: Títulos Vencidos */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2, p: 3, background: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f2239' }}>Títulos Vencidos  Receber</Typography>
              <Chip label={titulosVencidosReceber.length} size="small" sx={{ background: '#e53935', color: '#fff', fontWeight: 700 }} />
            </Box>
            <TableContainer sx={{ maxHeight: 340, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ background: '#c62828', color: '#fff', fontWeight: 600, fontSize: 12 }}>Título</TableCell>
                    <TableCell sx={{ background: '#c62828', color: '#fff', fontWeight: 600, fontSize: 12 }}>Cliente</TableCell>
                    <TableCell sx={{ background: '#c62828', color: '#fff', fontWeight: 600, fontSize: 12 }}>Vencimento</TableCell>
                    <TableCell align="center" sx={{ background: '#c62828', color: '#fff', fontWeight: 600, fontSize: 12 }}>Dias</TableCell>
                    <TableCell align="right" sx={{ background: '#c62828', color: '#fff', fontWeight: 600, fontSize: 12 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulosVencidosReceber.map((item, idx) => (
                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { background: '#fff5f5' } }}>
                      <TableCell sx={{ fontSize: 11, color: '#555' }}>{item.titulo}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{item.cliente}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{formatDate(item.vencimento)}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.dias_atraso ?? ''}
                          size="small"
                          sx={{
                            fontSize: 11, fontWeight: 600,
                            background: (item.dias_atraso ?? 0) > 30 ? '#e53935' : (item.dias_atraso ?? 0) > 7 ? '#ff9800' : '#ffeb3b',
                            color: (item.dias_atraso ?? 0) > 7 ? '#fff' : '#333',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500 }}>{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                  {titulosVencidosReceber.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ color: '#aaa' }}>Nenhum título vencido</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2, p: 3, background: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f2239' }}>Títulos Vencidos  Pagar</Typography>
              <Chip label={titulosVencidosPagar.length} size="small" sx={{ background: '#e65100', color: '#fff', fontWeight: 700 }} />
            </Box>
            <TableContainer sx={{ maxHeight: 340, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ background: '#bf360c', color: '#fff', fontWeight: 600, fontSize: 12 }}>Título</TableCell>
                    <TableCell sx={{ background: '#bf360c', color: '#fff', fontWeight: 600, fontSize: 12 }}>Fornecedor</TableCell>
                    <TableCell sx={{ background: '#bf360c', color: '#fff', fontWeight: 600, fontSize: 12 }}>Vencimento</TableCell>
                    <TableCell align="center" sx={{ background: '#bf360c', color: '#fff', fontWeight: 600, fontSize: 12 }}>Dias</TableCell>
                    <TableCell align="right" sx={{ background: '#bf360c', color: '#fff', fontWeight: 600, fontSize: 12 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulosVencidosPagar.map((item, idx) => (
                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { background: '#fff8f5' } }}>
                      <TableCell sx={{ fontSize: 11, color: '#555' }}>{item.titulo}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{item.fornecedor}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{formatDate(item.vencimento)}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.dias_atraso ?? ''}
                          size="small"
                          sx={{
                            fontSize: 11, fontWeight: 600,
                            background: (item.dias_atraso ?? 0) > 30 ? '#e53935' : (item.dias_atraso ?? 0) > 7 ? '#ff9800' : '#ffeb3b',
                            color: (item.dias_atraso ?? 0) > 7 ? '#fff' : '#333',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 500 }}>{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                  {titulosVencidosPagar.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ color: '#aaa' }}>Nenhum título vencido</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

      </Container>

      {/* Overlay de refresh */}
      {/* Dialog: Confirmação de atualização */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Atualizar cache</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Deseja atualizar os dados desta página? O processo leva aproximadamente <strong>11 minutos</strong>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" sx={{ color: '#1e466e', borderColor: '#1e466e' }}>Cancelar</Button>
          <Button onClick={() => { setConfirmOpen(false); handleRefresh(); }} variant="contained" sx={{ background: '#1e466e', '&:hover': { background: '#0f2239' } }}>Atualizar</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog: Como os dados são calculados */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)', color: '#fff', fontWeight: 700 }}>
          Como os dados são calculados
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List disablePadding>
            <ListItem sx={{ px: 2, pt: 2, pb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>Contas a Receber</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="A Receber — Total" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Soma de todos os títulos em aberto com clientes, independente da data de vencimento. Inclui vencidos e a vencer." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Vencido a Receber" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Títulos de clientes com data de vencimento anterior a hoje que ainda não foram recebidos. Indica o valor em atraso." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Recebido Hoje (tempo real)" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Soma dos títulos de clientes com vencimento na data de hoje. Consultado diretamente no ERP toda vez que a página é aberta." />
            </ListItem>
            <ListItem sx={{ px: 2, pt: 2, pb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>Contas a Pagar</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="A Pagar — Total" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Soma de todos os títulos em aberto com fornecedores, independente do vencimento. Excluí títulos cancelados ou já quitados." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Vencido a Pagar" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Títulos de fornecedores com data de vencimento anterior a hoje que ainda não foram pagos. Indica o valor em atraso." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="A Pagar Hoje (tempo real)" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Soma dos títulos de fornecedores com vencimento na data de hoje. Consultado diretamente no ERP toda vez que a página é aberta." />
            </ListItem>
            <ListItem sx={{ px: 2, pt: 2, pb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>Outros Indicadores</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Inadimplência (%)" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Percentual dos títulos vencidos a receber sobre o total a receber. Quanto maior, mais clientes estão atrasados." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="PMR — Prazo Médio de Recebimento" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Média de dias que a empresa leva para receber após emitir o faturamento. Calculado sobre os títulos recebidos no mês." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="PMP — Prazo Médio de Pagamento" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Média de dias que a empresa leva para pagar seus fornecedores após o recebimento da mercadoria ou emissão da nota." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2, pb: 2 }}>
              <ListItemText primary="Tabelas de Títulos Vencidos" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Listagem detalhada dos títulos em atraso, separados entre a receber (clientes) e a pagar (fornecedores), com valor, vencimento e dias de atraso." />
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
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>Atualizando dados financeiros</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Isso pode levar até 11 minutos...</Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Financeiro;
