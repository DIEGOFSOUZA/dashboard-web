import React, { useEffect, useState } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography, Container, Card, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import PaidIcon from '@mui/icons-material/Paid';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

function Vendas() {
  // KPIs dinâmicos
  const [kpis, setKpis] = useState([
    { label: 'Total Vendido no Mês', value: '...', gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' },
    { label: 'Total Vendido na Semana', value: '...', gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)' },
    { label: 'Total Vendido no Dia', value: '...', gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)' },
    { label: 'Ticket Médio', value: '...', gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)' },
    { label: 'Pedidos Emitidos', value: '...', gradient: 'linear-gradient(90deg, #7ed957 0%, #1e466e 100%)' },
  ]);

  // Evolução do faturamento (linha) - dinâmico
  const [faturamentoData, setFaturamentoData] = useState([]);

  // Estado de loading para KPIs e faturamento
  const [loading, setLoading] = useState(true);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingFaturamento, setLoadingFaturamento] = useState(true);

  useEffect(() => {
    // Busca evolução do faturamento dos últimos 6 meses
    const fetchFaturamento = async () => {
      setLoadingFaturamento(true);
      try {
        const response = await fetch('http://192.168.20.10:5000/api/kpis/sales-evolution');
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
  }, []);

  // Produtos mais vendidos (dinâmico)
  const [produtosVendidos, setProdutosVendidos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  useEffect(() => {
    // Busca produtos mais vendidos do mês
    const fetchTopProducts = async () => {
      setLoadingProdutos(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await fetch('http://192.168.20.10:5000/api/kpis/top-products', {
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
  }, []);

  // Marcas mais vendidas (tabela)
  const marcasVendidas = [
    { marca: 'Marca X', vendas: 300 },
    { marca: 'Marca Y', vendas: 220 },
    { marca: 'Marca Z', vendas: 180 },
  ];

  // Vendas por canal (pizza) - dinâmico
  const [canais, setCanais] = useState([]);
  const [loadingCanais, setLoadingCanais] = useState(true);
  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800'];

  useEffect(() => {
    // Busca vendas por canal do mês atual
    const fetchCanais = async () => {
      setLoadingCanais(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await fetch('http://192.168.20.10:5000/api/kpis/sales-by-channel', {
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
  }, []);

  // Vendas por vendedor (tabela) - dinâmico
  const [vendedores, setVendedores] = useState([]);
  const [loadingVendedores, setLoadingVendedores] = useState(true);

  useEffect(() => {
    // Busca vendas por vendedor do mês atual
    const fetchVendedores = async () => {
      setLoadingVendedores(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await fetch('http://192.168.20.10:5000/api/kpis/sales-by-representative', {
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
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    // Busca as KPIs do backend Flask
    const fetchKpis = async () => {
      setLoadingKpis(true);
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await fetch('http://192.168.20.10:5000/api/kpis/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startDate, endDate })
        });
        const data = await response.json();
        if (response.ok) {
          setKpis([
            { label: 'Total Vendido no Mês', value: `R$ ${Number(data.total_vendido_mes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, gradient: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)' },
            { label: 'Total Vendido na Semana', value: `R$ ${Number(data.total_vendido_semana).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, gradient: 'linear-gradient(90deg, #1e466e 0%, #1e6e5c 100%)' },
            { label: 'Total Vendido no Dia', value: `R$ ${Number(data.total_vendido_dia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, gradient: 'linear-gradient(90deg, #1e6e5c 0%, #43a047 100%)' },
            { label: 'Ticket Médio', value: `R$ ${Number(data.ticket_medio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, gradient: 'linear-gradient(90deg, #43a047 0%, #7ed957 100%)' },
            { label: 'Pedidos Emitidos', value: `${data.pedidos_emitidos}`, gradient: 'linear-gradient(90deg, #7ed957 0%, #1e466e 100%)' },
          ]);
        }
      } catch (err) {
        // Em caso de erro, mantém os valores como '...'
      }
      setLoadingKpis(false);
    };
    fetchKpis();
  }, []);

  // Atualiza loading geral
  useEffect(() => {
    setLoading(loadingKpis || loadingFaturamento);
  }, [loadingKpis, loadingFaturamento]);

  // Debug: mostrar os valores dos 6 meses no console
  console.log('Evolução do faturamento (6 meses):', faturamentoData);
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Aguarde, carregando dados de vendas..." />
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
            Dashboard de Vendas
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
                minHeight: 100,
                height: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{kpi.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{kpi.value}</Typography>
            </Card>
          ))}
        </Box>

        {/* Linha: Gráfico de linha (faturamento) e pizza (canais) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Evolução do Faturamento</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={faturamentoData} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis width={70} tickFormatter={v => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Canal</Typography>
            {loadingCanais ? (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <LoadingSpinner message="Carregando vendas por canal..." />
              </Box>
            ) : canais.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="body1" color="text.secondary">Nenhuma venda encontrada no período.</Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={canais}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, value }) => {
                        // Abrevia cada palavra do nome do canal para até 4 letras
                        const abreviado = name.split(' ').map(w => w.slice(0, 4)).join(' ');
                        return `${abreviado}: ${value}`;
                      }}
                      labelStyle={{ fontSize: 12 }}
                      labelLine={false}
                    >
                      {canais.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value}`, 'Pedidos']} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 13, marginTop: 8, maxWidth: '90%' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Card>
        </Box>

        {/* Linha: Barras (produtos) e tabela (marcas/vendedores) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Produtos Mais Vendidos</Typography>
            {loadingProdutos ? (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <LoadingSpinner message="Carregando produtos mais vendidos..." />
              </Box>
            ) : produtosVendidos.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="body1" color="text.secondary">Nenhum produto vendido no mês atual.</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={produtosVendidos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="produto" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#4caf50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Marcas Mais Vendidas(a fazer)</Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Marca</TableCell>
                  <TableCell>Vendas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marcasVendidas.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.marca}</TableCell>
                    <TableCell>{row.vendas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Vendedor</Typography>
            {loadingVendedores ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <LoadingSpinner message="Carregando vendas por vendedor..." />
              </Box>
            ) : vendedores.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="text.secondary">Nenhuma venda encontrada no período.</Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendedor</TableCell>
                      <TableCell>Vendas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendedores.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.vendedor}</TableCell>
                        <TableCell>{row.vendas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default Vendas;
