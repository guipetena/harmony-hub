import { FastifyInstance } from 'fastify'
import { requireRole } from '../../middlewares/auth.middleware'
import * as controller from './establishments.controller'

export async function establishmentRoutes(app: FastifyInstance) {
  app.get('/me', { preHandler: requireRole('ESTABLISHMENT') }, controller.getMe)
  app.post('/me', { preHandler: requireRole('ESTABLISHMENT') }, controller.create)
  app.put('/me', { preHandler: requireRole('ESTABLISHMENT') }, controller.update)
  app.get('/:id', controller.getById)
}
