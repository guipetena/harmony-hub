import { FastifyInstance } from 'fastify'
import { requireRole } from '../../middlewares/auth.middleware'
import * as controller from './reviews.controller'

export async function reviewRoutes(app: FastifyInstance) {
  app.get('/artist/:artistId', controller.getByArtist)
  app.post('/', { preHandler: requireRole('ESTABLISHMENT') }, controller.create)
}
