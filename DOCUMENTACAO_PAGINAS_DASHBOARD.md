# Documentação das Páginas da Dashboard

## Objetivo
Este documento explica, em linguagem de negócio, **como cada número é formado** em todas as páginas da dashboard.

---

## Visão Geral de Atualização dos Dados

- A dashboard usa estratégia **cache-first** na maior parte dos dados.
- O cache é preparado por rotinas de atualização (normalmente na madrugada, por volta de **03:00**).
- Em algumas métricas, o sistema combina cache com dados do dia para reduzir defasagem.
- Em caso de instabilidade da API externa, alguns endpoints retornam o último cache válido.

---

## Página Home

A página inicial é de navegação. Ela não possui cálculo de KPI.

---

## Página Vendas

### Fontes
- `/api/kpis/sales`
- `/api/kpis/sales-evolution`
- `/api/kpis/sales-by-channel`
- `/api/kpis/sales-by-representative`
- `/api/kpis/top-products`

### Como os números são formados

#### 1) Pedidos Emitidos
- Base principal: cache mensal (`sales_kpis.json`) com período do **1º dia do mês até ontem**.
- No carregamento da tela (sem período explícito), o backend busca pedidos de **hoje** e soma ao valor de cache.
- Regra de unicidade: deduplicação por `orderCode` (ou identificador alternativo).

#### 2) Total Vendido no Mês
- Soma de `netValue` dos pedidos do período mensal em cache.
- No modo padrão da tela, esse valor permanece o do cache (não recebe complemento do dia).

#### 3) Total Vendido na Semana
- Soma de `netValue` para pedidos cuja data pertence à semana atual (domingo a sábado), considerando a base de atualização do cache.

#### 4) Total Vendido no Dia
- No modo padrão da tela, é calculado com **pedidos do dia atual** em tempo de consulta.

#### 5) Ticket Médio
- Fórmula: `total_vendido_mes / pedidos_emitidos` (sobre a base de cálculo mensal em cache).

#### 6) Vendas por Canal
- Leitura exclusiva de cache (`sales_by_channel.json`).
- Sem recálculo em tempo real no carregamento da página.

#### 7) Vendas por Vendedor
- Deduplicação de pedidos por identificador.
- Contagem de pedidos por `representativeName` normalizado.
- Exclusões de representantes internos/configurados no backend (ex.: canais diretos/e-commerce).
- Em atualização de cache, pode usar `force_refresh=true` para recálculo completo.

#### 8) Top Produtos
- Ranking dos **10 produtos** mais vendidos por quantidade.
- Soma de `quantity` dos itens dos pedidos.
- Nome do produto prioriza `referenceCode` (com tratamento/fallback para descrição/código).

#### 9) Evolução de Vendas
- Série mensal carregada exclusivamente de cache (`sales_evolution.json`).

### Observações importantes (Vendas)
- É normal haver diferença pequena entre cards que usam cache e métricas com complemento do dia.
- Em caso de falha da API externa, o endpoint pode retornar cache com aviso de fallback.

---

## Página Comercial

### Fonte
- `/api/comercial/dashboard`

### Períodos usados
- **Mês atual**: do dia 1 até hoje (KPIs operacionais).
- **Linha do tempo**: últimos 6 meses **anteriores** (sem incluir o mês atual).

### Como os números são formados

#### 1) Pedidos em Aberto
- Soma de pedidos do mês atual com status:
  - `IN_PROGRESS`
  - `PARTIALLY_ANSWERED`

#### 2) Pedidos Bloqueados
- Quantidade de pedidos do mês atual com status `BLOCKED`.

#### 3) Previsão de Faturamento
- Soma de `netValue` de pedidos do mês atual com status **diferente de `CANCELED`**.

#### 4) Realizado
- Soma de `netValue` de pedidos do mês atual com status `ATTENDED`.

#### 5) Meta
- Na implementação atual, `meta_valor` = **previsão do mês**.

#### 6) % da Meta
- Fórmula: `realizado / meta_valor * 100`.

#### 7) Funil de Pedidos
- Etapas exibidas e contagem no mês atual:
  - Em andamento (`IN_PROGRESS`)
  - Parcialmente atendido (`PARTIALLY_ANSWERED`)
  - Atendido (`ATTENDED`)
  - Bloqueado (`BLOCKED`)
  - Cancelado (`CANCELED`)

#### 8) Pedidos por Vendedor
- Contagem de pedidos por representante (`representativeName`) com:
  - normalização de nome,
  - remoção de sufixos/aliases tratados,
  - exclusão de representantes internos configurados.
- Exibe top 10 por volume.

#### 9) Meta vs Realizado (histórico)
- Para cada um dos 6 meses anteriores:
  - `realizado`: soma de `netValue` com status `ATTENDED`.
  - `meta`: soma de `netValue` com status diferente de `CANCELED`.

### Observações importantes (Comercial)
- Não há “margem média real” no endpoint por ausência de custo no schema da API de pedidos.
- Não existe etapa dedicada “Entregue” na origem utilizada (`orders/search`).

---

## Página Clientes

### Fontes
- `/api/clientes`
- `/api/clientes/latest`

### Estratégia da página
- **Híbrida**:
  - KPIs e gráficos via cache (`/api/clientes`).
  - Lista de clientes recentes em tempo real (`/api/clientes/latest`).

### Como os números são formados

#### 1) Total de Clientes
- Quantidade total de clientes após consolidação de PF + PJ.
- Origem:
  - `person/v2/individuals/search` (PF)
  - `person/v2/legal-entities/search` (PJ)
- Filtro principal: `inCustomer = true`.

#### 2) Novos Clientes
- Soma de cadastros recentes por mês (janela de ~180 dias) usados para o gráfico de evolução.

#### 3) Clientes Ativos / Inativos
- Classificação por `customerStatus/status` com normalização.
- Fallback por `isInactive` e mapeamentos auxiliares quando necessário.

#### 4) Clientes por Região
- Agrupamento por UF/estado do endereço principal.

#### 5) Evolução Mensal
- Série dos últimos 6 meses com contagem de novos cadastros por mês.

#### 6) Últimos Clientes (tabela/lista)
- Busca em tempo real dos registros mais recentes (top 10), ordenados por data de cadastro.
- Combina PF + PJ e aplica ordenação decrescente por data de inserção.

### Observações importantes (Clientes)
- Se o cache principal estiver ausente, o endpoint pode responder `loading` enquanto processa em background.

---

## Página Financeiro

### Fonte da tela
- `/api/cache/financeiro_dashboard.json` (arquivo de cache servido pela API)

### Origem da formação do cache
- Processo de geração via endpoint interno `/api/financeiro/dashboard`.
- Coleta em paralelo:
  - Contas a receber
  - Contas a pagar
  - Período do mês
  - Janela de 90 dias para prazos médios

### Como os números são formados

#### 1) A Receber
- Soma dos títulos **abertos** de contas a receber no mês.

#### 2) A Pagar
- Soma dos títulos **abertos** de contas a pagar no mês.

#### 3) Total em Atrasos
- Soma de títulos a receber em aberto com vencimento entre o 1º dia do mês e ontem.

#### 4) Inadimplência
- Regra atual do backend:
  - `100%` quando `total_em_atrasos > 0`
  - `0%` quando `total_em_atrasos = 0`

#### 5) PMR (dias)
- Prazo médio (em dias) dos títulos abertos a receber a vencer (hoje/futuro), usando janela de 90 dias.

#### 6) PMP (dias)
- Prazo médio (em dias) dos títulos abertos a pagar a vencer (hoje/futuro), usando janela de 90 dias.

#### 7) Valores por Vencimento
- Buckets para receber e pagar:
  - `Vencido`
  - `Hoje`
  - `A Vencer`

#### 8) Top Clientes / Fornecedores
- Ranking por valor em aberto (com resolução de nome e agrupamento por código+nome quando disponível).

#### 9) Títulos Vencidos
- Listas de títulos vencidos (receber/pagar), ordenadas por vencimento.

### Observações importantes (Financeiro)
- A tela Financeiro é cache-only no frontend (sem auto refresh em tempo real).
- Há exclusão de alguns fornecedores internos no agrupamento de pagar.

---

## Página Estoque

### Fonte
- `/api/estoque`

### Origem dos dados
- Cache gerado a partir da API de saldos:
  - `product/v2/balances/search`
- Janela padrão de processamento: últimos 90 dias.

### Como os números são formados

#### 1) Total em Estoque
- Valor estimado: `quantidade em estoque × R$ 100` por item/posição.
- Observação: é estimativa (placeholder técnico), não custo real contábil.

#### 2) Produtos Abaixo do Mínimo
- Heurística atual: itens com estoque `> 0` e `< 30` unidades.

#### 3) Giro de Estoque
- Valor fixo exibido no cache atual (`2.1x / 30 dias`) enquanto cálculo real está pendente.

#### 4) Produtos Parados
- Itens com estoque `> 0` e sem movimentação/sinais em:
  - `salesOrder`
  - `inputTransaction`
  - `outputTransaction`
  - `purchaseOrder`

#### 5) Estoque por Depósito
- Agrupamento por depósito (`stockDescription`) com quantidade e valor estimado.

#### 6) Produtos Críticos
- Lista dos mais críticos (top 10), priorizando menor relação `atual / mínimo`.

#### 7) Estoque por Categoria e Evolução do Giro
- Atualmente alimentados por estrutura simplificada/temporária no cache até integração completa.

### Observações importantes (Estoque)
- Se cache não existir, a API dispara geração em background e pode retornar estrutura vazia inicial.
- Alguns indicadores ainda estão em modo estimado (com TODO explícito no backend).

---

## Por que os números podem diferir entre páginas?

As diferenças mais comuns são:
- **Janela de datas diferente** (mês até ontem, mês até hoje, 6 meses anteriores etc.).
- **Status considerados** diferentes por indicador (ex.: realizado considera apenas `ATTENDED`).
- **Política de cache** diferente (cache-only vs cache + complemento em tempo real).
- **Normalização/exclusões de representantes** no backend de Comercial/Vendas.

---

## Resumo rápido por página

- **Vendas**: foco em faturamento e produtividade comercial (cache + complementos pontuais do dia).
- **Comercial**: foco em pipeline/status de pedidos e comparação previsão/realizado.
- **Clientes**: base consolidada PF+PJ com lista recente em tempo real.
- **Financeiro**: painel de títulos, vencimento, prazos médios e concentração de carteira.
- **Estoque**: visão de saldos e criticidade, com parte dos indicadores ainda estimados.
