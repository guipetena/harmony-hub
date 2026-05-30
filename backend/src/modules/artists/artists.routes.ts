import { FastifyInstance } from 'fastify'
import { authenticate, requireRole } from '../../middlewares/auth.middleware'
import * as controller from './artists.controller'

export async function artistRoutes(app: FastifyInstance) {
  // Público
  app.get('/', controller.searchArtists)
  app.get<{ Params: { id: string } }>('/:id', controller.getArtist)

  // Artista autenticado
  app.get('/me/profile', { preHandler: requireRole('ARTIST') }, controller.getMyProfile)
  app.post('/me/profile', { preHandler: requireRole('ARTIST') }, controller.createProfile)
  app.put('/me/profile', { preHandler: requireRole('ARTIST') }, controller.updateProfile)
  app.post('/me/medias', { preHandler: requireRole('ARTIST') }, controller.addMedia)
  app.delete<{ Params: { mediaId: string } }>('/me/medias/:mediaId', { preHandler: requireRole('ARTIST') }, controller.removeMedia)
}
