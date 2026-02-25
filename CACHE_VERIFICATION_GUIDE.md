# Sistema de Verificação de Cache - Dashboard Web

## Visão Geral

Este documento descreve o novo sistema de verificação de cache implementado na dashboard. O sistema verifica automaticamente se os dados em cache estão atualizados antes de exibir as informações nas páginas.

## Componentes Principais

### 1. **API Service** (`src/services/api.js`)
Serviço que fornece métodos para:
- `checkCacheStatus()` - Verifica o status de todos os arquivos de cache
- `isCacheStale(cacheKey, maxAgeMinutes)` - Verifica se um arquivo específico está obsoleto
- `get(url)` e `post(url, data)` - Requisições HTTP com suporte a cache

### 2. **Cache Context** (`src/context/CacheContext.jsx`)
Contexto global React que fornece:
- Estado central do cache para toda a aplicação
- Métodos para verificar e atualizar o status do cache
- Informações sobre qual arquivo está obsoleto

**Como usar:**
```javascript
import { useCacheContext } from '../context/CacheContext';

const cacheContext = useCacheContext();
console.log(cacheContext.hasStaleCache); // boolean
console.log(cacheContext.cacheStatus); // objeto com detalhes
```

### 3. **Cache Verification Hook** (`src/hooks/useCacheVerification.js`)
Hook customizado para uso em páginas específicas.

**Parâmetros:**
- `requiredCacheKeys` - Array com nomes dos arquivos de cache necessários
- `options` - Configurações opcionais:
  - `showWarning` - Exibir warning no console (default: true)
  - `maxAgeMinutes` - Idade máxima aceitável do cache (default: 60)
  - `onStaleCache` - Callback executado quando cache está obsoleto

**Retorna um objeto com:**
- `isCacheValid` - Se todos os caches necessários estão válidos
- `isVerifying` - Se está verificando o cache
- `staleCacheFiles` - Array com nomes dos arquivos obsoletos
- `recheckCache()` - Função para forçar re-verificação
- Outros dados do contexto

### 4. **Cache Alert Component** (`src/components/CacheAlert.jsx`)
Componente que exibe um snackbar alertando sobre cache obsoleto.

## Como Usar em uma Página

### Exemplo: Página de Vendas

```javascript
import React, { useEffect, useState } from 'react';
import useCacheVerification from '../hooks/useCacheVerification';

function Vendas() {
  // Verificar cache na entrada da página
  const cacheVerification = useCacheVerification(
    ['sales_evolution', 'sales_kpis', 'top_products', 'sales_by_channel', 'sales_by_representative'],
    {
      showWarning: true,
      maxAgeMinutes: 60,
      onStaleCache: (staleFiles) => {
        console.warn('Cache obsoleto:', staleFiles);
      }
    }
  );

  // Seus useEffect e lógica de página normalmente...
  useEffect(() => {
    // Busca dados normalmente
  }, []);

  // Exibir loading enquanto verifica cache
  if (cacheVerification.isVerifying) {
    return <LoadingSpinner message="Verificando cache..." />;
  }

  // Mostrar aviso se cache está obsoleto
  if (cacheVerification.staleCacheFiles.length > 0) {
    console.warn('Arquivos de cache obsoletos:', cacheVerification.staleCacheFiles);
  }

  return (
    // Seu conteúdo da página...
  );
}
```

## Arquivos de Cache Monitorados

Arquivos que o sistema verifica automaticamente:

| Arquivo | Descrição | Atualização |
|---------|-----------|-------------|
| `sales_evolution.json` | Evolução de vendas histórica | Diariamente (03:00) |
| `sales_kpis.json` | KPIs de vendas | Diariamente (03:00) |
| `top_products.json` | Produtos mais vendidos | Diariamente (03:00) |
| `sales_by_channel.json` | Vendas por canal | Diariamente (03:00) |
| `sales_by_representative.json` | Vendas por representante | Diariamente (03:00) |
| `clientes_dashboard.json` | Dashboard de clientes | A cada 5 minutos |
| `financeiro_dashboard.json` | Dashboard financeiro | Conforme agendado |

## Fluxo de Funcionamento

1. **App.js** envolve a aplicação com `<CacheProvider>`
2. **CacheAlert** é renderizado globalmente e monitora o cache
3. **Cada página** usa `useCacheVerification()` para verificar seus caches necessários
4. **Ao montar**, a página verifica se seus caches estão válidos
5. **Se obsoleto**, exibe alerta e callback é executado
6. **Usuário** pode clicar em "Atualizar" para forçar re-verificação

## Endpoint Backend

### GET `/api/cache/status`

Retorna informações sobre todos os arquivos de cache:

```json
{
  "status": "ok",
  "timestamp": "2023-01-01T10:30:00.000Z",
  "has_stale_cache": false,
  "cache_files": {
    "sales_evolution": {
      "exists": true,
      "last_updated": "2023-01-01T09:30:00.000Z",
      "age_minutes": 60.5,
      "is_stale": false
    },
    ...
  }
}
```

## Configuração do Limite de Idade

Por padrão, cache com mais de 60 minutos é considerado obsoleto. Para customizar por página:

```javascript
const cacheVerification = useCacheVerification(
  ['sales_evolution', 'sales_kpis'],
  {
    maxAgeMinutes: 30  // Cache obsoleto após 30 minutos
  }
);
```

## Atualizar Todas as Páginas

Para implementar em outras páginas (Financeiro, Estoque, Clientes, Comercial):

1. Importe o hook:
```javascript
import useCacheVerification from '../hooks/useCacheVerification';
```

2. Adicione na função da página:
```javascript
const cacheVerification = useCacheVerification(
  ['arquivo_cache_necessario1', 'arquivo_cache_necessario2'],
  { showWarning: true }
);
```

3. Optionalmente, exiba um indicador visual si cache está obsoleto (ex: badge na navbar)

## Troubleshooting

### Cache não está sendo verificado
- Certifique-se de que `<CacheProvider>` envolve o Router em App.js
- Verifique se o `useCacheVerification` está sendo chamado com os nomes corretos dos arquivos

### Alerta não está aparecendo
- Verifique se `<CacheAlert>` foi adicionado em App.js
- Confirme que o `CacheProvider` está presente antes do `CacheAlert`

### Arquivo de cache não encontrado
- Verifique se o arquivo existe em `Flask_Bootstrap/cache/`
- Confirme que o nome do arquivo corresponde ao esperado no backend

## Próximos Passos

Para melhorias futuras:
- [ ] Adicionar refresh automático de dados quando cache é detectado como obsoleto
- [ ] Exibir idade do cache em cada seção da página
- [ ] Permitir refresh manual por seção (não apenas global)
- [ ] Integrar com Service Worker para offline mode
- [ ] Implementar sincronização de dados em tempo real com WebSockets
