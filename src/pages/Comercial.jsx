import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Tooltip as MuiTooltip
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, FunnelChart, Funnel, LabelList, CartesianGrid, LineChart, Line } from 'recharts';

function formatCurrency(value) {
  const numeric = Number(value || 0);
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

function formatCurrencyCompact(value) {
  const numeric = Number(value || 0);
  return numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  });
}

function truncateLabel(value, maxLength = 18) {
  const text = String(value || '');
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function ComercialDashboard() {
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      pedidos_em_aberto: 0,
      pedidos_bloqueados: 0,
      previsao_faturamento: 0,
      meta_valor: 0,
      realizado_valor: 0,
      percentual_meta: 0,
    },
    funil_data: [],
    pedidos_vendedor: [],
    meta_realizado: [],
    pedidos_status: [],
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/comercial/dashboard');
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard comercial:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpis = useMemo(() => {
    const apiKpis = dashboardData.kpis || {};
    return [
      {
        label: 'Pedidos em Aberto',
        value: String(apiKpis.pedidos_em_aberto ?? 0),
        icon: <AssignmentIcon sx={{ fontSize: 36, color: '#fff' }} />,
        gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
      },
      {
        label: 'Pedidos Bloqueados',
        value: String(apiKpis.pedidos_bloqueados ?? 0),
        icon: <CreditCardOffIcon sx={{ fontSize: 36, color: '#fff' }} />,
        gradient: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
      },
      {
        label: 'Previsão de Faturamento',
        value: formatCurrency(apiKpis.previsao_faturamento ?? 0),
        icon: <PaidIcon sx={{ fontSize: 36, color: '#fff' }} />,
        gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)',
      },
      {
        label: 'Previsão vs Realizado',
        value: `${formatCurrency(apiKpis.meta_valor ?? 0)} / ${formatCurrency(apiKpis.realizado_valor ?? 0)}`,
        icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#fff' }} />,
        gradient: 'linear-gradient(90deg, #7ed957 0%, #1e466e 100%)',
      },
    ];
  }, [dashboardData.kpis]);

  const funilData = useMemo(() => {
    const expectedStages = [
      'Em andamento',
      'Parcialmente atendido',
      'Atendido',
      'Bloqueado',
      'Cancelado',
    ];

    const incoming = Array.isArray(dashboardData.funil_data) ? dashboardData.funil_data : [];
    const stageValueMap = new Map(
      incoming.map((item) => [
        String(item?.etapa || '').trim(),
        Number(item?.valor || 0),
      ])
    );

    return expectedStages.map((stage) => ({
      etapa: stage,
      valor: stageValueMap.get(stage) || 0,
    }));
  }, [dashboardData.funil_data]);
  const pedidosVendedor = useMemo(() => {
    const items = Array.isArray(dashboardData.pedidos_vendedor) ? [...dashboardData.pedidos_vendedor] : [];
    return items
      .sort((a, b) => Number(b?.pedidos || 0) - Number(a?.pedidos || 0))
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [dashboardData.pedidos_vendedor]);

  const pedidosVendedorTop = useMemo(() => pedidosVendedor.slice(0, 10), [pedidosVendedor]);

  const vendedorChartHeight = useMemo(() => {
    const rows = pedidosVendedorTop.length || 1;
    return Math.max(260, Math.min(440, rows * 38));
  }, [pedidosVendedorTop.length]);

  const metaRealizado = dashboardData.meta_realizado || [];
  const pedidosStatus = dashboardData.pedidos_status || [];

  const metaResumo = useMemo(() => {
    const current = metaRealizado[metaRealizado.length - 1] || {};
    const meta = Number(current.meta || 0);
    const realizado = Number(current.realizado || 0);
    const diferenca = realizado - meta;
    const atingimento = meta > 0 ? (realizado / meta) * 100 : 0;

    return {
      meta,
      realizado,
      diferenca,
      atingimento,
    };
  }, [metaRealizado]);

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
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <MuiTooltip title="Atualizar Dados">
              <IconButton
                color="inherit"
                aria-label="Atualizar Dados"
                onClick={loadDashboard}
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
            </MuiTooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ px: 2, mt: 4 }}>
        {loading && (
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Carregando dados comerciais...
          </Typography>
        )}
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
                <RechartsTooltip />
                <Funnel dataKey="valor" data={funilData} isAnimationActive>
                  <LabelList dataKey="etapa" position="right" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1.2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 420 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pedidos por Vendedor</Typography>
            <Typography variant="caption" sx={{ mb: 1.5, color: 'text.secondary' }}>Top 10 vendedores por quantidade de pedidos</Typography>
            <ResponsiveContainer width="100%" height={vendedorChartHeight}>
              <BarChart layout="vertical" data={pedidosVendedorTop} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="vendedor"
                  width={190}
                  tick={{ fontSize: 11 }}
                />
                <RechartsTooltip
                  formatter={(value, _name, item) => [`${Number(value || 0)} (Top ${item?.payload?.rank || '-'})`, 'Pedidos']}
                  labelFormatter={(label) => `Vendedor: ${label}`}
                />
                <Bar dataKey="pedidos" fill="#1976d2" name="Pedidos" radius={[0, 8, 8, 0]}>
                  <LabelList dataKey="pedidos" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 0.9, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 340 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Previsão vs Realizado</Typography>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Conversão da previsão: {metaResumo.atingimento.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: metaResumo.diferenca >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
              Gap da previsão: {metaResumo.diferenca >= 0 ? '+' : ''}{formatCurrency(metaResumo.diferenca)}
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={metaRealizado} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => formatCurrencyCompact(value)} />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="meta" stroke="#22336b" strokeWidth={3} dot={{ r: 4 }} name="Meta" />
                <Line type="monotone" dataKey="realizado" stroke="#43a047" strokeWidth={3} dot={{ r: 4 }} name="Realizado" />
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
