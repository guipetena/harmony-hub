import { FastifyInstance } from 'fastify'
import { requireRole } from '../../middlewares/auth.middleware'
import * as controller from './availability.controller'

export async function availabilityRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: requireRole('ARTIST') }, controller.list)
  app.post('/', { preHandler: requireRole('ARTIST') }, controller.create)
  app.put<{ Params: { id: string } }>('/:id', { preHandler: requireRole('ARTIST') }, controller.update)
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: requireRole('ARTIST') }, controller.remove)
}
