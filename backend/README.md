# Harmony Hub — Backend

API REST do marketplace que conecta músicos e estabelecimentos para contratação de música ao vivo.

**Frontend:** [guipetena/harmony-hub](https://github.com/guipetena/harmony-hub)

---

## Stack

- **Node.js 20** + **TypeScript** (strict)
- **Fastify 4** — framework HTTP
- **Prisma ORM** + **PostgreSQL**
- **Zod** — validação de inputs
- **JWT** (`@fastify/jwt`) — autenticação
- **bcryptjs** — hash de senhas
- **Docker** — banco local em dev

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- Docker (para o PostgreSQL)

### Passo a passo

```bash
# 1. Clone e instale dependências
git clone <url-do-repo>
cd backend
npm install

# 2. Suba o banco de dados
docker compose up -d

# 3. Copie as variáveis de ambiente
cp .env.example .env
# O .env já vem preenchido para dev local — não precisa editar

# 4. Aplique o schema no banco
npx prisma db push

# 5. Popule com dados de exemplo
npm run db:seed

# 6. Inicie o servidor
npm run dev
```

Servidor disponível em **`http://localhost:3333`**

### Credenciais de demo

| Usuário | Email | Senha | Role |
|---|---|---|---|
| Artista | `artista@demo.com` | `123456` | ARTIST |
| Estabelecimento | `bar@demo.com` | `123456` | ESTABLISHMENT |

> O seed também cria 6 artistas adicionais (luana-prado, duo-violeiro, banda-noturna, marcus-blue, grupo-batuque, isa-campos).

---

## Scripts úteis

```bash
npm run dev          # Servidor com hot reload
npm run build        # Build TypeScript
npm run db:seed      # Repovoar banco com dados de exemplo
npm run db:studio    # Prisma Studio (interface visual do banco)
npm run db:migrate   # Criar migration nova (dev)
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env`. Para dev local, os valores padrão já funcionam.

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL do PostgreSQL | `postgresql://harmony:harmony@localhost:5432/harmonyhub` |
| `JWT_SECRET` | Segredo JWT — use algo longo em produção | `minha-chave-secreta` |
| `JWT_EXPIRES_IN` | Expiração do token | `7d` |
| `PORT` | Porta do servidor | `3333` |
| `NODE_ENV` | Ambiente | `development` |
| `CORS_ORIGIN` | Origens permitidas pelo CORS (separadas por vírgula) | `http://localhost:8080` |

---

## Endpoints

### Auth
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Público | Cadastro |
| POST | `/auth/login` | Público | Login |
| GET | `/auth/me` | Autenticado | Dados do usuário logado |

### Artists
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/artists` | Público | Busca artistas (filtros: `city`, `state`, `musicalStyle`, `type`, `priceMin`, `priceMax`, `available`) |
| GET | `/artists/:idOrSlug` | Público | Perfil completo (aceita UUID ou slug) |
| GET | `/artists/me/profile` | ARTIST | Meu perfil |
| POST | `/artists/me/profile` | ARTIST | Criar perfil |
| PUT | `/artists/me/profile` | ARTIST | Editar perfil |
| POST | `/artists/me/medias` | ARTIST | Adicionar mídia |
| DELETE | `/artists/me/medias/:mediaId` | ARTIST | Remover mídia |

### Establishments
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/establishments/:id` | Público | Perfil público do estabelecimento |
| GET | `/establishments/me` | ESTABLISHMENT | Meu perfil |
| POST | `/establishments/me` | ESTABLISHMENT | Criar perfil |
| PUT | `/establishments/me` | ESTABLISHMENT | Editar perfil |

### Availability
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/availability` | ARTIST | Listar disponibilidades |
| POST | `/availability` | ARTIST | Criar disponibilidade |
| PUT | `/availability/:id` | ARTIST | Atualizar disponibilidade |
| DELETE | `/availability/:id` | ARTIST | Remover disponibilidade |

### Bookings
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/bookings` | Autenticado | Listar (artista: recebidas / estabelecimento: enviadas) |
| POST | `/bookings` | ESTABLISHMENT | Criar solicitação |
| GET | `/bookings/:id` | Autenticado | Detalhe da solicitação |
| PATCH | `/bookings/:id/status` | Autenticado | Atualizar status |

**Regras de status:**
- `ACCEPTED` / `REJECTED` → só o artista
- `COMPLETED` / `CANCELLED` → só o estabelecimento
- WhatsApp só é retornado quando `status === ACCEPTED`

### Reviews
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/reviews/artist/:artistId` | Público | Avaliações do artista com média |
| POST | `/reviews` | ESTABLISHMENT | Criar avaliação (exige booking COMPLETED) |

---

## Deploy (Railway)

1. Crie um projeto no [Railway](https://railway.app) e adicione um serviço PostgreSQL
2. Adicione um serviço a partir deste repositório — o Dockerfile é detectado automaticamente
3. Configure as variáveis de ambiente no painel do Railway:
   - `DATABASE_URL` (gerado pelo Railway)
   - `JWT_SECRET` (gere com `openssl rand -hex 32`)
   - `CORS_ORIGIN` (URL do frontend no Cloudflare Pages)
   - `NODE_ENV=production`
4. As migrations rodam automaticamente via `prisma migrate deploy` no startup do container

---

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma       # Models e enums
│   └── seed.ts             # Dados de exemplo
├── src/
│   ├── app.ts              # Entry point (Fastify + plugins + rotas)
│   ├── prisma/client.ts    # Singleton do Prisma
│   ├── shared/errors.ts    # AppError, NotFoundError, etc.
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   └── modules/
│       ├── auth/
│       ├── artists/
│       ├── establishments/
│       ├── availability/
│       ├── booking-requests/
│       └── reviews/
├── docker-compose.yml      # PostgreSQL local
├── Dockerfile              # Build de produção
├── PRODUCAO.md             # Checklist de produção
└── .env.example            # Template de variáveis de ambiente
```
