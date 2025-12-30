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

  useEffect(() => {
    // Busca evolução do faturamento dos últimos 6 meses
    const fetchFaturamento = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/kpis/sales-evolution');
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
    };
    fetchFaturamento();
  }, []);

  // Produtos mais vendidos (barras)
  const produtosVendidos = [
    { produto: 'Produto A', vendas: 120 },
    { produto: 'Produto B', vendas: 90 },
    { produto: 'Produto C', vendas: 60 },
    { produto: 'Produto D', vendas: 40 },
    { produto: 'Produto E', vendas: 30 },
  ];

  // Marcas mais vendidas (tabela)
  const marcasVendidas = [
    { marca: 'Marca X', vendas: 300 },
    { marca: 'Marca Y', vendas: 220 },
    { marca: 'Marca Z', vendas: 180 },
  ];

  // Vendas por canal (pizza)
  const canais = [
    { name: 'Loja', value: 40000 },
    { name: 'E-commerce', value: 35000 },
    { name: 'Representante', value: 30000 },
    { name: 'Atacado', value: 25000 },
  ];
  const PIE_COLORS = ['#22336b', '#7ecbff', '#43a047', '#ff9800'];

  // Vendas por vendedor (tabela)
  const vendedores = [
    { vendedor: 'João', vendas: 40000 },
    { vendedor: 'Maria', vendas: 35000 },
    { vendedor: 'Carlos', vendas: 30000 },
    { vendedor: 'Ana', vendas: 25000 },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    // Busca as KPIs do backend Flask
    const fetchKpis = async () => {
      try {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const response = await fetch('http://localhost:5000/api/kpis/sales', {
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
    };
    fetchKpis();
  }, []);
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
              <LineChart data={faturamentoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#22336b" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vendas por Canal</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={canais} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {canais.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Box>

        {/* Linha: Barras (produtos) e tabela (marcas/vendedores) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
          <Card sx={{ flex: 2, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Produtos Mais Vendidos</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={produtosVendidos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#4caf50" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card sx={{ flex: 1, minWidth: 0, borderRadius: 3, boxShadow: 3, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 380 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Marcas Mais Vendidas</Typography>
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
            <Table size="small">
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
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default Vendas;
