import { FastifyInstance } from 'fastify'
import { authenticate } from '../../middlewares/auth.middleware'
import { register, login, me } from './auth.controller'

export async function authRoutes(app: FastifyInstance) {
  // Rate limit mais restrito nos endpoints de auth (brute force protection)
  const authRateLimit = {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
        errorResponseBuilder: () => ({
          error: 'Muitas tentativas de login. Aguarde 1 minuto.',
        }),
      },
    },
  }

  app.post('/register', authRateLimit, (req, reply) => register(req, reply, app))
  app.post('/login', authRateLimit, (req, reply) => login(req, reply, app))
  app.get('/me', { preHandler: authenticate }, me)
}
