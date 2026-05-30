import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyRateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'
import { AppError } from './shared/errors'
import { prisma } from './prisma/client'

import { authRoutes } from './modules/auth/auth.routes'
import { artistRoutes } from './modules/artists/artists.routes'
import { establishmentRoutes } from './modules/establishments/establishments.routes'
import { availabilityRoutes } from './modules/availability/availability.routes'
import { bookingRoutes } from './modules/booking-requests/booking-requests.routes'
import { reviewRoutes } from './modules/reviews/reviews.routes'

const app = Fastify({ logger: true })

// CORS — restrito ao domínio do front em produção
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:8080', 'http://localhost:5173']

app.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('CORS bloqueado'), false)
  },
  credentials: true,
})

// Rate limiting global (pode sobrescrever por rota)
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? 'default-secret-troque-em-producao',
  sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
})

// Rotas
app.register(authRoutes, { prefix: '/auth' })
app.register(artistRoutes, { prefix: '/artists' })
app.register(establishmentRoutes, { prefix: '/establishments' })
app.register(availabilityRoutes, { prefix: '/availability' })
app.register(bookingRoutes, { prefix: '/bookings' })
app.register(reviewRoutes, { prefix: '/reviews' })

// Health check com verificação de banco
app.get('/health', async (_req, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return reply.send({ status: 'ok', db: 'ok' })
  } catch {
    return reply.status(503).send({ status: 'error', db: 'unreachable' })
  }
})

// Error handler global
app.setErrorHandler((error, _request, reply) => {
  if (error.statusCode === 429) {
    return reply.status(429).send({ error: 'Muitas tentativas. Aguarde um momento.' })
  }

  if (error instanceof ZodError) {
    return reply.status(422).send({
      error: 'Dados inválidos',
      details: error.flatten().fieldErrors,
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message })
  }

  app.log.error(error)
  return reply.status(500).send({ error: 'Erro interno do servidor' })
})

// Start
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333
    await app.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
