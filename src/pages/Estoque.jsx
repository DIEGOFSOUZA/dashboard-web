import {
  Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Box, AppBar, Toolbar, IconButton, Container, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, List, ListItem, ListItemText
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Formata números grandes com separador de milhar (ex: 15234 → 15.234)
const fmt = (n) => (n ?? 0).toLocaleString('pt-BR');

// Trunca texto longo para exibição em eixo de gráfico
const truncate = (str, maxLen = 28) =>
  str && str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : (str || '');

// Tooltip customizado para os gráficos
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <Paper sx={{ p: 1.2, fontSize: 13 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ color: p.color }}>
          {p.name}: <strong>{fmt(p.value)}</strong> peças
        </Box>
      ))}
    </Paper>
  );
};

function Estoque() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({});
  const [depositos, setDepositos] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const resp = await fetch('/api/cache/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'estoque' }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    } catch (err) {
      console.error('[Estoque] Erro ao atualizar cache:', err);
    } finally {
      setRefreshing(false);
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/estoque');

      setKpis(data.kpis || {});
      setDepositos(data.estoque_por_deposito || []);
      // Limita top produtos ao top 10 para o gráfico
      setTopProdutos((data.top_produtos || []).slice(0, 10));
      setAlertas(data.alertas_estoque || []);
      setUpdatedAt(data.updated_at || '');
    } catch (err) {
      console.error('Erro ao buscar dados de estoque:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      label: 'Total de Peças',
      value: fmt(kpis.total_pecas),
      subtitle: 'em estoque',
      icon: <InventoryIcon sx={{ fontSize: 38, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #0f2239 0%, #1e466e 100%)',
    },
    {
      label: 'Peças Disponíveis',
      value: fmt(kpis.pecas_disponiveis),
      subtitle: 'para venda',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 38, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #2e7d32 0%, #60ad5e 100%)',
    },
    {
      label: 'Em Pedidos de Venda',
      value: fmt(kpis.pedidos_de_venda),
      subtitle: 'reservadas',
      icon: <ShoppingCartIcon sx={{ fontSize: 38, color: '#fff' }} />,
      gradient: 'linear-gradient(135deg, #e65100 0%, #ffb74d 100%)',
    },
  ];

  // Preparar dados do gráfico de depósitos com label truncado
  const depositosChart = depositos.map(d => ({
    ...d,
    label: `${d.stockCode} - ${truncate(d.stockDescription || d.deposito, 28)}`,
  }));

  // Preparar dados top produtos
  const topChart = topProdutos.map(p => ({
    ...p,
    label: truncate(p.produto, 32),
  }));

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#f5f6fa' }}>
      {/* AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: 2, mt: 2, mx: 1,
          background: 'linear-gradient(90deg, #0f2239 0%, #1e466e 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            size="large" edge="start" color="inherit"
            sx={{ mr: 2 }} onClick={() => navigate('/')}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DASHBOARD DE ESTOQUE
          </Typography>
          {updatedAt && (
            <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
              Atualizado: {updatedAt}
            </Typography>
          )}
          <IconButton color="inherit" onClick={() => setConfirmOpen(true)} disabled={refreshing} size="small" title="Atualizar dados" sx={{ ml: 0.5 }}>
            {refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon fontSize="small" />}
          </IconButton>
          <IconButton color="inherit" onClick={() => setInfoOpen(true)} size="small" title="Como os dados são calculados" sx={{ ml: 0.5 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ px: 2, mt: 3 }}>

        {/* KPI Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2.5, mb: 3 }}>
          {kpiCards.map((kpi, idx) => (
            <Card
              key={idx}
              sx={{
                flex: 1,
                background: kpi.gradient,
                color: '#fff',
                borderRadius: 2.5,
                boxShadow: 4,
                minHeight: 110,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                transition: 'transform 0.18s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.85, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.6 }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.2 }}>
                  {loading ? '—' : kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>{kpi.subtitle}</Typography>
              </Box>
              {kpi.icon}
            </Card>
          ))}
        </Box>

        {/* Gráficos */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2.5, mb: 3 }}>

          {/* Estoque por Depósito */}
          <Card sx={{ flex: 1.4, borderRadius: 2.5, boxShadow: 3, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Estoque por Depósito
            </Typography>
            {depositosChart.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: 'text.secondary' }}>
                Sem dados disponíveis
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(220, depositosChart.length * 52)}>
                <BarChart
                  data={depositosChart}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                >
                  <XAxis type="number" tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={180} tick={{ fontSize: 12 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="pecas" name="Total" fill="#1565c0" radius={[0, 6, 6, 0]} barSize={18} />
                  <Bar dataKey="disponivel" name="Disponível" fill="#43a047" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Top 10 Produtos */}
          <Card sx={{ flex: 1, borderRadius: 2.5, boxShadow: 3, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Top 10 Produtos em Estoque
            </Typography>
            {topChart.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: 'text.secondary' }}>
                Sem dados disponíveis
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(220, topChart.length * 52)}>
                <BarChart
                  data={topChart}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                >
                  <XAxis type="number" tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={190} tick={{ fontSize: 11 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="pecas" name="Peças" radius={[0, 6, 6, 0]} barSize={16}>
                    {topChart.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#0d47a1' : '#1976d2'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

        </Box>

        {/* Tabela de Alertas */}
        <Card sx={{ borderRadius: 2.5, boxShadow: 3, p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <WarningAmberIcon sx={{ color: '#e65100' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Alertas de Estoque — Pedidos Acima do Disponível
            </Typography>
            {alertas.length > 0 && (
              <Chip
                label={`${alertas.length} alerta${alertas.length > 1 ? 's' : ''}`}
                size="small"
                sx={{ background: '#ffccbc', color: '#bf360c', fontWeight: 700 }}
              />
            )}
          </Box>

          {alertas.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
              ✅ Nenhum alerta de estoque — todos os pedidos dentro da disponibilidade.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Produto</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Referência</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Em Estoque</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Pedidos</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Déficit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertas.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: row.deficit >= 50 ? '#fff3e0' : 'inherit',
                        '&:hover': { background: '#fff8e1' },
                      }}
                    >
                      <TableCell sx={{ maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.produto}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', background: '#e8eaf6', px: 1, py: 0.3, borderRadius: 1 }}>
                          {row.referencia}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{fmt(row.estoque)}</TableCell>
                      <TableCell align="right" sx={{ color: '#e65100', fontWeight: 600 }}>
                        {fmt(row.pedidos)}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`-${fmt(row.deficit)}`}
                          size="small"
                          sx={{
                            background: row.deficit >= 50 ? '#d32f2f' : '#ef5350',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

      </Container>
      {/* Dialog: Confirmação de atualização */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Atualizar cache</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Deseja atualizar os dados desta página? O processo leva aproximadamente <strong>15 minutos</strong>.
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
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>KPIs Principais</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Total de Peças" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Quantidade total de unidades disponíveis (saldo físico) em todos os depósitos cadastrados no ERP." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Total de SKUs" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Número de referências ou grade de produto distintas que possuem pelo menos uma unidade em estoque." />
            </ListItem>
            <ListItem sx={{ px: 2, pt: 2, pb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e466e', textTransform: 'uppercase', fontSize: 11 }}>Visualizações</Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Estoque por Depósito" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Distribuição da quantidade de peças entre os depósitos cadastrados (ex.: depósito central, filial, terceiros). Permite identificar onde o estoque está concentrado." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemText primary="Top Produtos" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Os 10 produtos com maior quantidade em estoque no momento. Útil para identificar itens com excesso de estoque." />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ px: 2, pb: 2 }}>
              <ListItemText primary="Alertas de Estoque" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondary="Produtos com saldo zerado ou abaixo do estoque mínimo definido no cadastro do ERP. Exige reposiciónamento." />
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
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>Atualizando dados de estoque</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Isso pode levar até 15 minutos...</Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default Estoque;

