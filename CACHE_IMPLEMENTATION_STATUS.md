# Implementação de Verificação de Cache - Status de Implementação

## Resumo das Mudanças Realizadas

### ✅ Backend (Flask)
- [x] Criado endpoint `/api/cache/status` em `routes.py`
- [x] Endpoint retorna status de todos os arquivos de cache
- [x] Verifica existência e idade de cada arquivo

### ✅ Frontend (React) - Estrutura Base
- [x] Criado serviço de API (`src/services/api.js`)
- [x] Criado contexto de cache (`src/context/CacheContext.jsx`)
- [x] Criado hook de verificação (`src/hooks/useCacheVerification.js`)
- [x] Criado componente de alerta (`src/components/CacheAlert.jsx`)
- [x] Atualizado `App.js` com CacheProvider e CacheAlert

### ✅ Páginas - Iniciadas
- [x] Vendas - Inicializada com hook de cache verification

### ⏳ Páginas - Pendentes de Implementação
As seguintes páginas precisam do seguinte:

#### **Financeiro.jsx**
Caches necessários a verificar:
- `financeiro_dashboard.json`

Adicionar ao início da função:
```javascript
const cacheVerification = useCacheVerification(
  ['financeiro_dashboard'],
  {
    showWarning: true,
    maxAgeMinutes: 60,
    onStaleCache: (staleFiles) => {
      console.warn('Cache obsoleto na página de Financeiro:', staleFiles);
    }
  }
);
```

#### **Estoque.jsx**
Verificar quais endpoints são chamados e determinar caches necessários.

#### **Clientes.jsx**
Caches necessários a verificar:
- `clientes_dashboard.json`

Adicionar ao início da função:
```javascript
const cacheVerification = useCacheVerification(
  ['clientes_dashboard'],
  {
    showWarning: true,
    maxAgeMinutes: 5,  // Atualizado a cada 5 minutos
    onStaleCache: (staleFiles) => {
      console.warn('Cache obsoleto na página de Clientes:', staleFiles);
    }
  }
);
```

#### **Comercial.jsx**
Verificar quais endpoints são chamados e determinar caches necessários.

#### **Home.jsx**
Não faz requisições de dados, portanto não precisa de verificação de cache.

## Scripts de Aplicação

### Como aplicar em Financeiro.jsx

1. Adicione o import:
```javascript
import useCacheVerification from '../hooks/useCacheVerification';
```

2. Adicione dentro da função:
```javascript
const cacheVerification = useCacheVerification(
  ['financeiro_dashboard'],
  { showWarning: true }
);
```

### Como aplicar em Clientes.jsx

1. Adicione o import:
```javascript
import useCacheVerification from '../hooks/useCacheVerification';
```

2. Adicione dentro da função:
```javascript
const cacheVerification = useCacheVerification(
  ['clientes_dashboard'],
  { showWarning: true, maxAgeMinutes: 5 }
);
```

## Verificando a Implementação

### No Browser DevTools:

1. Abra as Developer Tools (F12)
2. Vá para a aba Network
3. Procure por requisições para `http://192.168.20.10:5000/api/cache/status`
4. Você deve ver ela sendo chamada ao:
   - Carregar a página principal
   - Acessar qualquer página com verificação de cache
   - A cada 5 minutos

### Alertas no Console:

Você verá mensagens como:
```
Cache obsoleto detectado: ["sales_evolution.json (125 min)"]
```

### Alerta Visual:

Um snackbar amarelo/laranja aparecerá no canto superior direito da tela indicando que o cache está obsoleto.

## Próximas Ações

1. **Aplicar em Financeiro.jsx**
2. **Aplicar em Estoque.jsx** (após determinar caches necessários)
3. **Aplicar em Clientes.jsx**
4. **Aplicar em Comercial.jsx** (após determinar caches necessários)
5. **Testar** em cada página
6. **Adicionar** indicador visual de "última atualização" em cada seção

## Testes Recomendados

1. Navegar para cada página e verificar se o alerta aparece no console
2. Verificar se o Snackbar de alerta aparece quando cache > 60 minutos
3. Clicar em "Atualizar" no alerta e confirmar que status é re-verificado
4. Aguardar 5 minutos e confirmar que verificação automática ocorre
5. Modificar o arquivo JSON de cache e confirmar que status muda

## Notas Técnicas

- O sistema verifica cache a cada 5 minutos automaticamente
- O limite padrão de 60 minutos pode ser customizado por página
- O alerta desaparece automaticamente após 8 segundos
- Usuário pode clicar em "Atualizar" para fechar o alerta e forçar re-verificação
- O ícone de refresh no alerta faz uma requisição ao backend para atualizar status
