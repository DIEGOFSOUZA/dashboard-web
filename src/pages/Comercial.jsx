import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card
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

function fmtTimestamp(ts) {
  if (!ts) return '';
  const [datePart = '', timePart = ''] = ts.split('T');
  const [y, m, d] = datePart.split('-');
  return `${d}/${m}/${y} ${timePart.slice(0, 5)}`;
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
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  const navigate = useNavigate();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/comercial/dashboard');
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      }
      // Buscar timestamp do cache
      try {
        const cacheResp = await fetch('/api/cache/comercial_dashboard.json');
        if (cacheResp.ok) {
          const cacheJson = await cacheResp.json();
          setCacheTimestamp(cacheJson.timestamp || null);
        }
      } catch (_) {}
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
          {cacheTimestamp && (
            <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
              Atualizado: {fmtTimestamp(cacheTimestamp)}
            </Typography>
          )}
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
        {/* Linha 2: Gráficos principais */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4, width: '100%' }}>
          
          {/* Coluna esquerda: Funil + Status */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Funil de Vendas</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <FunnelChart>
                  <RechartsTooltip />
                  <Funnel dataKey="valor" data={funilData} isAnimationActive>
                    <LabelList dataKey="etapa" position="right" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pedidos por Status</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {pedidosStatus.map((row, idx) => {
                  const colorMap = {
                    'Em andamento': { bg: '#e3f2fd', color: '#1565c0', border: '#1976d2' },
                    'Bloqueado': { bg: '#fff3e0', color: '#e65100', border: '#ff9800' },
                    'Atendido': { bg: '#e8f5e9', color: '#2e7d32', border: '#43a047' },
                    'Cancelado': { bg: '#ffebee', color: '#c62828', border: '#ef5350' },
                    'Parcialmente atendido': { bg: '#f3e5f5', color: '#6a1b9a', border: '#9c27b0' },
                  };
                  const style = colorMap[row.status] || { bg: '#f5f5f5', color: '#333', border: '#999' };
                  return (
                    <Box key={idx} sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      backgroundColor: style.bg, borderLeft: `4px solid ${style.border}`,
                      borderRadius: 1.5, px: 2, py: 1
                    }}>
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: style.color }}>{row.status}</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: 18, color: style.color }}>{row.quantidade}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Box>

          {/* Coluna central: Pedidos por Vendedor */}
          <Card sx={{ flex: 1.6, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Pedidos por Vendedor</Typography>
            <Typography variant="caption" sx={{ mb: 1.5, color: 'text.secondary' }}>Top 10 vendedores por quantidade de pedidos</Typography>
            <ResponsiveContainer width="100%" height={vendedorChartHeight}>
              <BarChart layout="vertical" data={pedidosVendedorTop} margin={{ top: 10, right: 50, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="vendedor"
                  width={200}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => truncateLabel(v, 22)}
                />
                <RechartsTooltip
                  formatter={(value, _name, item) => [`${Number(value || 0)} pedidos (Top ${item?.payload?.rank || '-'})`, 'Pedidos']}
                  labelFormatter={(label) => `Vendedor: ${label}`}
                />
                <Bar dataKey="pedidos" fill="#1976d2" name="Pedidos" radius={[0, 6, 6, 0]}>
                  <LabelList dataKey="pedidos" position="right" style={{ fontSize: 12, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Coluna direita: Previsão vs Realizado */}
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Previsão vs Realizado</Typography>
            <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
              Conversão da previsão: {metaResumo.atingimento.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: metaResumo.diferenca >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
              Gap da previsão: {metaResumo.diferenca >= 0 ? '+' : ''}{formatCurrency(metaResumo.diferenca)}
            </Typography>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={metaRealizado} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(value) => formatCurrencyCompact(value)} tick={{ fontSize: 11 }} />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="meta" stroke="#22336b" strokeWidth={3} dot={{ r: 4 }} name="Meta" />
                <Line type="monotone" dataKey="realizado" stroke="#43a047" strokeWidth={3} dot={{ r: 4 }} name="Realizado" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default ComercialDashboard;
