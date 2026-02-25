# Dashboard Web

Dashboard de vendas desenvolvido em React com Material-UI e Recharts.

## Funcionalidades
- KPIs de vendas
- Gráficos de barras e pizza
- Tabelas detalhadas
- Layout responsivo

## Instalação
```bash
npm install
```

## Uso
```bash
npm start
```

Acesse em `http://localhost:3000`

## Rodando em paralelo com backend

### Backend produção + Frontend desenvolvimento

```powershell
# Backend em produção (serviço Windows) - porta 5000
sc query FlaskBootstrapScheduler

# Frontend em desenvolvimento - porta 3000
cd D:\TOTVS\dashboard-web
npm run start:prodapi
```

### Backend desenvolvimento + Frontend desenvolvimento

```powershell
# Backend dev - porta 5001
cd D:\TOTVS\Flask_Bootstrap
python run_dev.py

# Frontend dev - porta 3000
cd D:\TOTVS\dashboard-web
npm start
```

### Ambientes de API

- `.env.development` → `REACT_APP_API_URL=http://localhost:5001`
- `.env.production` → `REACT_APP_API_URL=http://localhost:5000`

## Estrutura do Projeto
- `src/pages/` — Páginas do dashboard
- `src/` — Arquivos principais do React
- `public/` — Arquivos estáticos

## Tecnologias
- React 18
- Material-UI
- Recharts

## Scripts
- `npm start` — Executa o projeto em modo desenvolvimento
- `npm run start:prodapi` — Executa frontend em dev apontando para backend produção (porta 5000)
- `npm run build` — Gera build de produção
- `npm run build:prod` — Gera build apontando para backend produção (porta 5000)

## 🚀 Deploy de nova versão em produção

### Atualizar apenas Frontend

```powershell
# 1. Gerar build de produção
cd D:\TOTVS\dashboard-web
npm run build:prod

# 2. Sincronizar com Flask
cd D:\TOTVS\Flask_Bootstrap
python sync_react_build.py

# 3. Reiniciar serviço (opcional, apenas se quiser embutir no executável)
sc stop FlaskBootstrapScheduler
pyinstaller --noconfirm --clean FlaskBootstrapScheduler.spec
sc start FlaskBootstrapScheduler
```

### Atualizar apenas Backend

```powershell
# 1. Parar serviço
cd D:\TOTVS\Flask_Bootstrap
sc stop FlaskBootstrapScheduler

# 2. Fazer alterações no código Python (routes.py, app.py, etc)

# 3. Recompilar executável
pyinstaller --noconfirm --clean FlaskBootstrapScheduler.spec

# 4. Reiniciar serviço
sc start FlaskBootstrapScheduler
```

### Atualizar Backend + Frontend juntos

```powershell
# 1. Parar serviço
cd D:\TOTVS\Flask_Bootstrap
sc stop FlaskBootstrapScheduler

# 2. Atualizar código backend (se necessário)
# Edite arquivos Python...

# 3. Atualizar frontend
cd D:\TOTVS\dashboard-web
npm run build:prod

# 4. Sincronizar build
cd D:\TOTVS\Flask_Bootstrap
python sync_react_build.py

# 5. Recompilar executável
pyinstaller --noconfirm --clean FlaskBootstrapScheduler.spec

# 6. Reiniciar serviço
sc start FlaskBootstrapScheduler

# 7. Verificar
sc query FlaskBootstrapScheduler
start http://localhost:5000
```

### ⚡ Deploy rápido (sem recompilar executável)

Se você não precisa embutir o frontend no executável e apenas quer atualizar via `static/`:

```powershell
# Frontend
cd D:\TOTVS\dashboard-web
npm run build:prod

# Sincronizar
cd D:\TOTVS\Flask_Bootstrap
python sync_react_build.py

# Flask já serve automaticamente de static/, sem necessidade de reiniciar
```

## Licença
MIT
