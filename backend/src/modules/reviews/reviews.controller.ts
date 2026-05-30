import { FastifyRequest, FastifyReply } from 'fastify'
import { createReviewSchema } from './reviews.dto'
import * as service from './reviews.service'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = createReviewSchema.parse(request.body)
  return reply.status(201).send(await service.createReview(sub, data))
}

export async function getByArtist(
  request: FastifyRequest<{ Params: { artistId: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await service.getArtistReviews(request.params.artistId))
}
