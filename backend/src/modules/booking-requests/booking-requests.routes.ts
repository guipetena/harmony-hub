import { FastifyInstance } from 'fastify'
import { authenticate, requireRole } from '../../middlewares/auth.middleware'
import * as controller from './booking-requests.controller'

export async function bookingRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: authenticate }, controller.list)
  app.post('/', { preHandler: requireRole('ESTABLISHMENT') }, controller.create)
  app.get<{ Params: { id: string } }>('/:id', { preHandler: authenticate }, controller.getById)
  app.patch<{ Params: { id: string } }>('/:id/status', { preHandler: authenticate }, controller.updateStatus)
}
