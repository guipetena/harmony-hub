# Harmony Hub 🎵

Marketplace que conecta **músicos** (cantores, duplas e bandas) com **estabelecimentos** para contratação de música ao vivo.

---

## Estrutura do monorepo

```
harmony-hub/
├── /          ← Frontend (TanStack Start + React + Cloudflare Pages)
└── backend/   ← Backend (Fastify + Prisma + PostgreSQL + Railway)
```

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- Docker (para o PostgreSQL do backend)

### 1. Frontend

```bash
# Na raiz do projeto
npm install
npm run dev
```

Disponível em **http://localhost:8080**

### 2. Backend

```bash
cd backend

# Instalar dependências
npm install

# Subir o banco de dados via Docker
docker compose up -d

# Aplicar schema no banco
npx prisma db push

# Popular com dados de exemplo
npm run db:seed

# Iniciar servidor
npm run dev
```

API disponível em **http://localhost:3333**

### Credenciais de demo

| Role | Email | Senha |
|---|---|---|
| Artista | `artista@demo.com` | `123456` |
| Estabelecimento | `bar@demo.com` | `123456` |

---

## Variáveis de ambiente

### Frontend — `.env.production`

```env
VITE_API_URL=https://sua-api.up.railway.app
```

Em dev, a API aponta automaticamente para `http://localhost:3333`.

### Backend — `backend/.env`

```bash
cp backend/.env.example backend/.env
# O .env já vem preenchido para dev local
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, TanStack Start, TailwindCSS v4, shadcn/ui |
| Roteamento | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Backend | Fastify 4, TypeScript |
| ORM | Prisma 5 + PostgreSQL |
| Validação | Zod |
| Auth | JWT (`@fastify/jwt`) |
| Deploy frontend | Cloudflare Pages |
| Deploy backend | Railway |

---

## Deploy

Ver **`backend/PRODUCAO.md`** para o checklist completo.

Resumo:
- **Frontend** → Cloudflare Pages (`wrangler deploy`)
- **Backend** → Railway (detecta o Dockerfile automaticamente)
- Configurar `CORS_ORIGIN` e `VITE_API_URL` apontando um para o outro
