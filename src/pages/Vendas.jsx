import React, { useEffect, useState } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell, TableBody, Skeleton, CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

function Vendas() {
  // KPIs dinâmicos - Inicialmente carrega do cache
  const [kpis, setKpis] = useState([
    { label: 'Total Vendido no Mês', value: '...', gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)', isLoading: false },
    { label: 'Total Vendido na Semana', value: '...', gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)', isLoading: false },
    { label: 'Total Vendido no Dia', value: '...', gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)', isLoading: true },
    { label: 'Ticket Médio', value: '...', gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)', isLoading: false },
    { label: 'Pedidos Emitidos', value: '...', gradient: 'linear-gradient(90deg, #7ed957 0%, #1e466e 100%)', isLoading: true },
  ]);

  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Evolução do faturamento (linha) - dinâmico
  const [faturamentoData, setFaturamentoData] = useState([]);

  // Estado de loading para componentes secundários (gráficos, tabelas)

  const [loadingFaturamento, setLoadingFaturamento] = useState(true);
  const [loadingTodayKpis, setLoadingTodayKpis] = useState(true);

  useEffect(() => {
    // Busca evolução do faturamento dos últimos 6 meses
    const fetchFaturamento = async () => {      setLoadingFaturamento(true);
      try {
        const response = await fetch('/api/kpis/sales-evolution');
        const data = await response.json();
        if (response.ok && data.evolucao) {
          // Ajusta para formato do gráfico
          setFaturamentoData(
            data.evolucao.map(item => ({
              data: item.mes,
              valor: item.total_vendido
            }))
          );
        }
      } catch (err) {
        // Em caso de erro, mantém vazio
      }
      setLoadingFaturamento(false);
    };
    fetchFaturamento();
  }, [refreshKey]);

  // Produtos mais vendidos (dinâmico)
  const [produtosVendidos, setProdutosVendidos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  useEffect(() => {
    // Busca produtos mais vendidos do mês completo
    const fetchTopProducts = async () => {
      setLoadingProdutos(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        // Último dia do mês (não hoje)
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const endDate = `${lastDayOfMonth.getFullYear()}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;
        
        const response = await fetch('/api/kpis/top-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate, endDate })
        });
        const data = await response.json();
        if (response.ok && data.top_produtos) {
          setProdutosVendidos(data.top_produtos.map(p => ({ produto: p.produto, vendas: p.vendas })));
        } else {
          setProdutosVendidos([]);
        }
      } catch (err) {
        setProdutosVendidos([]);
      }
      setLoadingProdutos(false);
    };
    fetchTopProducts();
  }, [refreshKey]);

  // Vendas por canal (pizza) - dinâmico
  const [canais, setCanais] = useState([]);
  const [loadingCanais, setLoadingCanais] = useState(true);
  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800'];

  useEffect(() => {
    // Busca vendas por canal do mês completo
    const fetchCanais = async () => {
      setLoadingCanais(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        // Último dia do mês (não hoje)
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const endDate = `${lastDayOfMonth.getFullYear()}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;
        
        const response = await fetch('/api/kpis/sales-by-channel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate, endDate })
        });
        const data = await response.json();
        if (response.ok && data.canais) {
          setCanais(data.canais.map(c => ({ name: c.canal, value: c.pedidos })));
        } else {
          setCanais([]);
        }
      } catch (err) {
        setCanais([]);
      }
      setLoadingCanais(false);
    };
    fetchCanais();
  }, [refreshKey]);

  // Vendas por vendedor (tabela) - dinâmico
  const [vendedores, setVendedores] = useState([]);
  const [loadingVendedores, setLoadingVendedores] = useState(true);

  useEffect(() => {
    // Busca vendas por vendedor do mês completo
    const fetchVendedores = async () => {
      setLoadingVendedores(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        // Último dia do mês (não hoje)
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const endDate = `${lastDayOfMonth.getFullYear()}-${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;
        
        const response = await fetch('/api/kpis/sales-by-representative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate, endDate })
        });
        const data = await response.json();
        if (response.ok && data.vendedores) {
          setVendedores(data.vendedores);
        } else {
          setVendedores([]);
        }
      } catch (err) {
        setVendedores([]);
      }
      setLoadingVendedores(false);
    };
    fetchVendedores();
  }, [refreshKey]);

  const navigate = useNavigate();
  useEffect(() => {
    // PASSO 1: Buscar dados do cache imediatamente
    const loadCacheKpis = async () => {
      try {
        // POST sem parâmetros para pegar cache
        const response = await fetch('/api/kpis/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await response.json();
        if (response.ok) {
          // Usa updated_at gravado no cache; fallback para hora atual
          setCacheTimestamp(data.updated_at || new Date().toISOString());
          // Mostrar cache imediatamente (apenas dados que vêm do cache)
          setKpis(prev => [
            { ...prev[0], value: `R$ ${Number(data.total_vendido_mes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, isLoading: false },
            { ...prev[1], value: `R$ ${Number(data.total_vendido_semana).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, isLoading: false },
            { ...prev[2], value: prev[2].value, isLoading: true }, // Continua loading para o Dia
            { ...prev[3], value: `R$ ${Number(data.ticket_medio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, isLoading: false },
            { ...prev[4], value: prev[4].value, isLoading: true }, // Continua loading para Pedidos
          ]);
          
          // PASSO 2: Buscar dados de hoje e atualizar apenas Dia e Pedidos
          fetchTodayKpis(data);
        }
      } catch (err) {
        console.error('Erro ao carregar cache KPIs:', err);
      }
    };
    
    const fetchTodayKpis = async (cacheData) => {
      setLoadingTodayKpis(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await fetch('/api/kpis/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate, endDate })
        });
        const todayData = await response.json();
        if (response.ok) {
          // Atualizar apenas Dia e Pedidos com os dados de hoje
          setKpis(prev => [
            prev[0], // Mês (mantém cache)
            prev[1], // Semana (mantém cache)
            { ...prev[2], value: `R$ ${Number(todayData.total_vendido_dia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, isLoading: false }, // Dia (atualizado hoje)
            prev[3], // Ticket (mantém cache)
            { ...prev[4], value: `${todayData.pedidos_emitidos}`, isLoading: false }, // Pedidos (atualizado hoje)
          ]);
        }
      } catch (err) {
        console.error('Erro ao carregar dados de hoje:', err);
        // Manter valores do cache mesmo se houver erro
      }
      setLoadingTodayKpis(false);
    };
    
    loadCacheKpis();
  }, [refreshKey]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const resp = await fetch('/api/cache/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'vendas' }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      // Atualiza o label imediatamente ao término do refresh,
      // sem aguardar o reload assíncrono dos dados (que tem chamada extra à API)
      setCacheTimestamp(new Date().toISOString());
    } catch (err) {
      console.error('[Vendas] Erro ao atualizar cache:', err);
    } finally {
      setRefreshing(false);
      setRefreshKey(k => k + 1);
    }
  };

  // Debug: mostrar os valores dos 6 meses no console
  console.log('Evolução do faturamento (6 meses):', faturamentoData);
  
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#fff' }}>
      <AppBar position="static" sx={{ borderRadius: 2, mt: 2, mx: 1, background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' }} elevation={0}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/') }>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard de Vendas
          </Typography>
          {cacheTimestamp && (
            <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
              Atualizado: {(() => {
                const [dp = '', tp = ''] = cacheTimestamp.split('T');
                const [y, m, d] = dp.split('-');
                return `${d}/${m}/${y} ${tp.slice(0, 5)}`;
              })()}
            </Typography>
          )}
          <IconButton color="inherit" onClick={handleRefresh} disabled={refreshing} size="small" title="Atualizar dados" sx={{ ml: 0.5 }}>
            {refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon fontSize="small" />}
          </IconButton>
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
                minHeight: 100,
                height: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
                position: 'relative',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{kpi.label}</Typography>
              {kpi.isLoading ? (
                <Box sx={{ position: 'relative' }}>
                  <Skeleton 
                    variant="text" 
                    width={140} 
                    height={40} 
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} 
                  />
                </Box>
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{kpi.value}</Typography>
              )}
            </Card>
          ))}
        </Box>

        {/* Linha 2: Evolução do Faturamento - largura total */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, mb: 4, minHeight: 320 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Evolução do Faturamento</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={faturamentoData} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis width={80} tickFormatter={v => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} />
              <Tooltip formatter={v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Linha 3: Vendas por Canal + Produtos Mais Vendidos */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'stretch', width: '100%' }}>
          {/* Vendas por Canal - Pie sem labels inline + tabela lateral */}
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Canal</Typography>
            {loadingCanais ? (
              <Box sx={{ textAlign: 'center', mt: 6 }}><LoadingSpinner message="Carregando..." /></Box>
            ) : canais.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 6 }}><Typography color="text.secondary">Nenhuma venda encontrada.</Typography></Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                {/* Gráfico de pizza - sem labels inline */}
                <Box sx={{ width: 220, height: 220, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={canais}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {canais.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = canais.reduce((sum, item) => sum + item.value, 0);
                          const percent = ((value / total) * 100).toFixed(1);
                          return [`${value} pedidos (${percent}%)`, name];
                        }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 8, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                {/* Tabela lateral com nomes completos */}
                <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 240 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, py: 0.5, fontSize: 12 }}>Canal</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, py: 0.5, fontSize: 12 }}>Pedidos</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, py: 0.5, fontSize: 12 }}>%</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {canais.map((row, idx) => {
                        const total = canais.reduce((sum, item) => sum + item.value, 0);
                        return (
                          <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            <TableCell sx={{ py: 0.5, fontSize: 12 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: PIE_COLORS[idx % PIE_COLORS.length], flexShrink: 0 }} />
                                {row.name}
                              </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ py: 0.5, fontSize: 12, fontWeight: 600 }}>{row.value}</TableCell>
                            <TableCell align="right" sx={{ py: 0.5, fontSize: 12, color: 'text.secondary' }}>
                              {((row.value / total) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}
          </Card>

          {/* Produtos Mais Vendidos */}
          <Card sx={{ flex: 1.5, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Produtos Mais Vendidos</Typography>
            {loadingProdutos ? (
              <Box sx={{ textAlign: 'center', mt: 6 }}><LoadingSpinner message="Carregando produtos..." /></Box>
            ) : produtosVendidos.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 6 }}><Typography color="text.secondary">Nenhum produto vendido no mês atual.</Typography></Box>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={produtosVendidos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="produto" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#4caf50" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Box>

        {/* Linha 4: Vendas por Vendedor - largura total */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Vendedor</Typography>
          {loadingVendedores ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}><LoadingSpinner message="Carregando vendedores..." /></Box>
          ) : vendedores.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}><Typography color="text.secondary">Nenhuma venda encontrada no período.</Typography></Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vendedor</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Pedidos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendedores.map((row, idx) => (
                  <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell sx={{ color: 'text.secondary', width: 40 }}>{idx + 1}</TableCell>
                    <TableCell>{row.vendedor}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{row.vendas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Container>
      {refreshing && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6, minWidth: 320, textAlign: 'center' }}>
            <CircularProgress size={52} thickness={4} sx={{ color: '#1e466e' }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>Atualizando dados de vendas</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Isso pode levar até 30 segundos...</Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Vendas;
