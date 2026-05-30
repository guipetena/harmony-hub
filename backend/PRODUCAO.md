# Roteiro para Produção — Harmony Hub

Plataforma alvo: **Railway** (backend + PostgreSQL, ~$5/mês) + **Cloudflare Pages** (frontend, grátis).

---

## ✅ Concluído

- CORS restrito via `CORS_ORIGIN` no `.env`
- Rate limiting: 100 req/min global, 10 req/min em `/auth/login` e `/auth/register`
- Health check `GET /health` verifica conexão real com Postgres
- `estimatedBudget` `Float` → `Decimal(10,2)`
- Dockerfile: `prisma migrate deploy` antes de iniciar o servidor
- Frontend: 401 → logout automático + redirect para `/login`
- Frontend: Auth guard em `/dashboard/*` via `beforeLoad`
- Frontend: `.env.production` com `VITE_API_URL`
- Frontend: Onboarding pós-cadastro para artista sem perfil

---

## 🟡 Importantes — entram logo após subir

### Backend

- [ ] **Connection pooling no Prisma**
  Prisma abre uma conexão por request. Com tráfego real estoura o limite do Postgres e força upgrade de plano.
  Adicionar `?connection_limit=5&pool_timeout=10` na `DATABASE_URL`, ou usar `@prisma/extension-accelerate`.

- [ ] **Upload real de mídia**
  `POST /artists/me/medias` recebe URL manual. Em produção:
  1. Backend gera presigned URL no **Cloudflare R2**
  2. Frontend faz upload direto para o R2
  3. Backend salva apenas a URL final

- [ ] **Logging estruturado**
  Fastify já loga em JSON. Configurar agregador: **Logtail** (free tier) ou **Sentry** para erros em produção.

- [ ] **Busca por texto**
  `GET /artists` não suporta busca por nome. Adicionar filtro `q` com `artisticName ILIKE %query%`.

### Frontend

- [ ] **Tratamento global de erros de rede**
  Páginas de busca e perfil mostram tela em branco quando a API está fora.
  Adicionar `errorComponent` nas rotas ou toast global via `sonner` (já instalado).

- [ ] **Paginação na busca**
  `GET /artists` já retorna `total/page/limit` mas o front carrega tudo de uma vez.
  Adicionar botão "Carregar mais" ou scroll infinito.

- [ ] **Fluxo de criação de perfil artístico**
  O botão "Criar meu perfil agora" no onboarding ainda mostra um `alert`.
  Implementar a tela de formulário completo (nome artístico, estilos, preços, cidade, etc).

- [ ] **Fluxo de criação de solicitação de contratação**
  Dashboard do estabelecimento não tem botão para enviar solicitação diretamente do perfil do artista.
  Adicionar modal/drawer com formulário (data do evento, mensagem, orçamento estimado).

- [ ] **SEO dinâmico nos perfis**
  Meta tags dos perfis de artistas precisam de SSR/prerender para o Google indexar.
  O projeto já tem `@cloudflare/vite-plugin` — configurar prerender nas rotas públicas.

---

## 🟢 Backlog — qualidade de vida

- [ ] **Favoritos**
  Removido dos dashboards por falta de backend. Adicionar model `Favorite` no schema e endpoints.

- [ ] **Notificações em tempo real**
  Artista não sabe que recebeu uma solicitação sem recarregar.
  Implementar WebSocket (`@fastify/websocket`) ou polling curto (ex: 30s via `refetchInterval`).

- [ ] **Busca por múltiplos estilos musicais**
  Hoje o filtro aceita só um estilo. Trocar para array e usar `hasSome` no Prisma.

- [ ] **Tela de edição de perfil**
  Frontend não tem formulário para editar nome artístico, bio, preços etc.
  Já existe `PUT /artists/me/profile` no backend.

- [ ] **Refresh token / sessão persistente**
  JWT de 7 dias expira silenciosamente. Implementar refresh token ou rotação automática.

- [ ] **Testes**
  Zero cobertura. Prioridade mínima: testes de integração no fluxo booking
  (criar → aceitar → completar → avaliar).

- [ ] **`available` vs `Availability`**
  Dois sistemas paralelos: `ArtistProfile.available` (flag geral) e model `Availability` (datas específicas).
  Decidir a fonte de verdade e integrar no front.

---

## Infra — decisões tomadas

| Serviço | Plataforma | Custo estimado |
|---|---|---|
| Frontend | Cloudflare Pages (já configurado no projeto) | Grátis |
| Backend API | Railway Hobby | ~$5/mês |
| PostgreSQL | Railway (incluso no plano) | Incluso |
| Storage de mídia | Cloudflare R2 | Grátis até 10 GB |
| **Total MVP** | | **~R$ 25/mês** |

### Alertas de custo
- **Connection pooling**: sem configurar, tráfego acima de ~50 usuários simultâneos estoura as conexões do Postgres e força upgrade de plano.
- **Imagens pelo servidor**: nunca servir uploads passando pelo Node.js. Upload direto para R2, backend só salva a URL.
