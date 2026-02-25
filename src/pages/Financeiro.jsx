import React, { useEffect, useState } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Tooltip as MuiTooltip, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';

function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) return '—';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).split('T')[0].split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function Financeiro() {
  const navigate = useNavigate();

  // MODO CACHE-ONLY: Sem auto-refresh, apenas leitura do cache
  // Cache é atualizado diariamente às 03:00 pelo scheduler

  const [kpisData, setKpisData] = useState({});
  const [barData, setBarData] = useState([]);
  const [carteiras, setCarteiras] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [topFornecedores, setTopFornecedores] = useState([]);
  const [titulosVencidosReceber, setTitulosVencidosReceber] = useState([]);
  const [titulosVencidosPagar, setTitulosVencidosPagar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSecondary, setLoadingSecondary] = useState(true);

  // Carregamento APENAS DO CACHE (sem chamadas API)
  useEffect(() => {
    let isMounted = true;

    const loadCacheData = async () => {
      console.log('[Financeiro] 🔄 Iniciando carregamento do cache...');
      
      try {
        // Buscar arquivo de cache estático via API
        const url = '/api/cache/financeiro_dashboard.json';
        console.log('[Financeiro] 📡 Fazendo requisição:', url);
        
        const response = await fetch(url);
        console.log('[Financeiro] 📊 Resposta recebida:', {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        });
        
        if (!response.ok) {
          // Se cache não existe, mostrar zeros
          console.warn('[Financeiro] ⚠️ Cache não encontrado (status:', response.status, '), exibindo zeros');
          if (isMounted) {
            setKpisData({});
            setBarData([]);
            setCarteiras([]);
            setFornecedores([]);
            setTopClientes([]);
            setTopFornecedores([]);
            setTitulosVencidosReceber([]);
            setTitulosVencidosPagar([]);
            setLoading(false);
            setLoadingSecondary(false);
          }
          return;
        }
        
        const cacheContent = await response.json();
        console.log('[Financeiro] 📦 Cache parseado:', {
          timestamp: cacheContent.timestamp,
          hasData: !!cacheContent.data,
          kpis: cacheContent.data?.kpis
        });
        
        const data = cacheContent.data || {};
        
        if (!isMounted) {
          console.log('[Financeiro] ⚠️ Componente desmontado, abortando');
          return;
        }
        
        // Carregar todos os dados do cache
        setKpisData(data.kpis || {});
        setBarData(data.barData || []);
        setCarteiras(data.carteiras || []);
        setFornecedores(data.fornecedores || []);
        setTopClientes(data.topClientes || []);
        setTopFornecedores(data.topFornecedores || []);
        setTitulosVencidosReceber(data.titulosVencidosReceber || []);
        setTitulosVencidosPagar(data.titulosVencidosPagar || []);
        
        console.log('[Financeiro] ✅ Cache carregado com sucesso! Timestamp:', cacheContent.timestamp);
        console.log('[Financeiro] 📊 Dados carregados:', {
          kpis: Object.keys(data.kpis || {}).length,
          barData: (data.barData || []).length,
          carteiras: (data.carteiras || []).length,
          topClientes: (data.topClientes || []).length
        });
        
      } catch (error) {
        console.error('[Financeiro] ❌ Erro ao carregar cache:', error);
        // Em caso de erro, mostrar zeros
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
        if (isMounted) {
          console.log('[Financeiro] 🏁 Finalizando loading states');
          setLoading(false);
          setLoadingSecondary(false);
        }
      }
    };

    loadCacheData();
    return () => {
      console.log('[Financeiro] 🔚 Componente desmontado');
      isMounted = false;
    };
  }, []);

  // KPIs com gradientes
  const kpis = [
    { label: 'A Receber', value: kpisData.a_receber ?? 0, gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' },
    { label: 'A Pagar', value: kpisData.a_pagar ?? 0, gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)' },
    { label: 'Total em Atrasos', value: kpisData.total_em_atrasos ?? 0, gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)' },
    { label: 'Inadimplência', value: kpisData.inadimplencia ?? 0, isPercent: true, gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)' },
    { label: 'PMR (dias)', value: kpisData.pmr ?? 0, isDays: true, tooltip: 'Prazo Médio de Recebimento (dias)', gradient: 'linear-gradient(90deg, #7ed957 0%, #ff9800 100%)' },
    { label: 'PMP (dias)', value: kpisData.pmp ?? 0, isDays: true, tooltip: 'Prazo Médio de Pagamento (dias)', gradient: 'linear-gradient(90deg, #ff9800 0%, #1e466e 100%)' },
  ];

  // Gráfico de fluxo de caixa (linha)
  const fluxoCaixaData = [
    { dia: '01/02', Entradas: 20000, Saidas: 12000, Saldo: 8000 },
    { dia: '02/02', Entradas: 15000, Saidas: 9000, Saldo: 14000 },
    { dia: '03/02', Entradas: 18000, Saidas: 11000, Saldo: 21000 },
    { dia: '04/02', Entradas: 12000, Saidas: 8000, Saldo: 25000 },
    { dia: '05/02', Entradas: 16000, Saidas: 9000, Saldo: 32000 },
    { dia: '06/02', Entradas: 14000, Saidas: 10000, Saldo: 36000 },
    { dia: '07/02', Entradas: 17000, Saidas: 12000, Saldo: 41000 },
  ];

  // Dados dos gráficos são carregados do backend

  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800'];

  // Tabelas: dados carregados do backend

  // ===== JSX =====
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 4, minWidth: 320, textAlign: 'center' }}>
          <CircularProgress size={56} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            Carregando dados financeiros
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Aguarde enquanto atualizamos o dashboard.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#fff' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/') }>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard Financeiro
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ px: 2, mt: 4 }}>
        {/* KPIs com Gradientes */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            mb: 4,
            width: '100%',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {kpis.map((kpi, idx) => {
            const card = (
              <Card
                sx={{
                  width: '100%',
                  background: kpi.gradient,
                  color: '#fff',
                  borderRadius: 2,
                  boxShadow: 3,
                  minHeight: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'center' }}>{kpi.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {kpi.isPercent ? `${kpi.value}%` : kpi.isDays ? `${kpi.value}` : formatCurrency(kpi.value)}
                </Typography>
              </Card>
            );

            return kpi.tooltip ? (
              <MuiTooltip key={idx} title={kpi.tooltip} arrow>
                {card}
              </MuiTooltip>
            ) : (
              <Box key={idx}>{card}</Box>
            );
          })}
        </Box>

        {/* Linha 1: Fluxo de Caixa (2/3) e Vencimento (1/3) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Fluxo de Caixa */}
          <Card sx={{ flex: { xs: 1, md: 2 }, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { xs: 300, md: 380 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Fluxo de Caixa</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={fluxoCaixaData} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis width={70} tickFormatter={v => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="Entradas" stroke="#43a047" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Saidas" stroke="#ff9800" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Valores por Vencimento */}
          <Card sx={{ flex: { xs: 1, md: 1 }, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { xs: 300, md: 380 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Valores por Vencimento</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Receber" fill="#43a047" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Pagar" fill="#ff9800" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        {/* Linha 2: Composição Recebíveis (1/2) e Pagáveis (1/2) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Composição de Recebíveis */}
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { xs: 350, md: 380 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Composição de Recebíveis</Typography>
            <Box sx={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={carteiras}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={false}
                  >
                    {carteiras.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ maxHeight: 260, overflowY: 'auto' }}
                    formatter={(value) => (value.length > 28 ? `${value.slice(0, 28)}...` : value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* Composição de Pagáveis */}
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { xs: 350, md: 380 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Composição de Pagáveis</Typography>
            <Box sx={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fornecedores}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={false}
                  >
                    {fornecedores.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ maxHeight: 260, overflowY: 'auto' }}
                    formatter={(value) => (value.length > 28 ? `${value.slice(0, 28)}...` : value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>

        {/* Linha 3: Produtos e Tabelas (2/3 e 1/3) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Top Clientes */}
          <Card sx={{ flex: { xs: 1, md: 2 }, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: { xs: 450, md: 500 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Top Clientes</Typography>
            <TableContainer component={Paper} sx={{ flex: 1, maxHeight: 200, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#1e466e', color: 'white', fontWeight: 600 }}>Código - Nome</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: '#1e466e', color: 'white', fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topClientes.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.cliente}</TableCell>
                      <TableCell align="right">{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, mt: 3 }}>Top Fornecedores</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#1e466e', color: 'white', fontWeight: 600 }}>Código - Nome</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: '#1e466e', color: 'white', fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topFornecedores.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell align="right">{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Títulos Vencidos */}
          <Card sx={{ flex: { xs: 1, md: 1 }, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: { xs: 450, md: 500 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Títulos Vencidos - Receber</Typography>
            <TableContainer component={Paper} sx={{ flex: 1, mb: 3, maxHeight: 200, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Nº Título</TableCell>
                    <TableCell sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Cliente</TableCell>
                    <TableCell sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Vencimento</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulosVencidosReceber.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontSize: 12 }}>{item.titulo}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{item.cliente}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{formatDate(item.vencimento)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Títulos Vencidos - Pagar</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Nº Título</TableCell>
                    <TableCell sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Fornecedor</TableCell>
                    <TableCell sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Vencimento</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 600 }}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {titulosVencidosPagar.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontSize: 12 }}>{item.titulo}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{item.fornecedor}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{formatDate(item.vencimento)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>{formatCurrency(item.valor)}</TableCell>
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

export default Financeiro;
