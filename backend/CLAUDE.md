# Harmony Hub — Backend

Marketplace que conecta músicos/artistas com estabelecimentos para contratação de música ao vivo.

## Stack

- **Runtime**: Node.js 20 + TypeScript (strict)
- **Framework**: Fastify 4
- **ORM**: Prisma + PostgreSQL
- **Validação**: Zod (em todos os inputs — body, query, params)
- **Auth**: JWT via @fastify/jwt + bcryptjs para senhas
- **Dev**: tsx watch (sem build em dev)

## Arquitetura

Modular simples. Sem microserviços, sem DDD, sem CQRS. Cada módulo tem:

```
módulo/
  módulo.dto.ts        # schemas Zod + tipos TypeScript
  módulo.service.ts    # lógica de negócio + queries Prisma
  módulo.controller.ts # parse input → chama service → responde
  módulo.routes.ts     # registra rotas no Fastify + preHandlers
```

Sem camada de repository separada — o service chama o Prisma diretamente.

## Módulos

- `auth` — register, login, /me
- `artists` — CRUD de perfil, busca com filtros, mídias
- `establishments` — CRUD de perfil
- `availability` — CRUD de disponibilidade (só ARTIST)
- `booking-requests` — solicitações de contratação
- `reviews` — avaliações (só após booking COMPLETED)

## Regras de negócio importantes

1. **WhatsApp só liberado após ACCEPTED** — o service de bookings zera os campos `whatsapp` antes de retornar se status ≠ ACCEPTED
2. **Review exige booking COMPLETED** entre os dois lados — evita avaliações falsas
3. **Roles separados**:
   - `ARTIST`: aceita/rejeita bookings, gerencia perfil/disponibilidade
   - `ESTABLISHMENT`: cria bookings, completa/cancela, cria reviews
4. **Status de booking**: PENDING → ACCEPTED | REJECTED (pelo artista) / COMPLETED | CANCELLED (pelo estabelecimento)

## Auth & Middlewares

- `authenticate` — verifica JWT, rejeita com 401
- `requireRole('ARTIST' | 'ESTABLISHMENT')` — verifica JWT + role, rejeita com 403
- JWT payload: `{ sub: userId, role }`

## Erros

Classes em `src/shared/errors.ts`:
- `AppError(message, statusCode)` — erro genérico
- `NotFoundError(resource)` — 404
- `UnauthorizedError` — 401
- `ForbiddenError` — 403

O error handler global em `app.ts` trata `ZodError` (422), `AppError` e erros genéricos (500).

## Banco de dados

Models Prisma: `User`, `ArtistProfile`, `ArtistMedia`, `Availability`, `EstablishmentProfile`, `BookingRequest`, `Review`

Enums: `Role` (ARTIST | ESTABLISHMENT), `MediaType` (IMAGE | VIDEO), `BookingStatus` (PENDING | ACCEPTED | REJECTED | COMPLETED | CANCELLED)

## Comandos úteis

```bash
npm run dev          # desenvolvimento com hot reload
npm run db:migrate   # rodar migrations
npm run db:seed      # seed com dados de exemplo (artista@demo.com / bar@demo.com / 123456)
npm run db:studio    # Prisma Studio
npm run build        # build TypeScript
```

## Variáveis de ambiente

```
DATABASE_URL=postgresql://...
JWT_SECRET=segredo-longo
JWT_EXPIRES_IN=7d
PORT=3333
NODE_ENV=development
```

## Deploy

Railway ou Render. Em produção usar `npx prisma migrate deploy` antes de subir.
Dockerfile já configurado com multi-stage build.

## Convenções

- Controllers são finos: só fazem parse do input e chamam o service
- Services têm toda a lógica de negócio
- Sempre usar Zod para validar antes de passar para o service
- Paginação padrão: `page` + `limit` via query string, retornar `{ total, page, limit, data }`
- IDs sempre UUID
- Datas no formato `YYYY-MM-DD` via string na API, convertidas para `Date` no service
- Horários no formato `HH:MM` como string simples
