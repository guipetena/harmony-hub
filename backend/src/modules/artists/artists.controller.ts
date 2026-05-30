import { FastifyRequest, FastifyReply } from 'fastify'
import {
  createArtistProfileSchema,
  updateArtistProfileSchema,
  addMediaSchema,
  searchArtistsSchema,
} from './artists.dto'
import * as service from './artists.service'

export async function createProfile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = createArtistProfileSchema.parse(request.body)
  const profile = await service.createArtistProfile(sub, data)
  return reply.status(201).send(profile)
}

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = updateArtistProfileSchema.parse(request.body)
  const profile = await service.updateArtistProfile(sub, data)
  return reply.send(profile)
}

export async function getMyProfile(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  return reply.send(await service.getArtistByUserId(sub))
}

export async function getArtist(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return reply.send(await service.getArtistById(request.params.id))
}

export async function searchArtists(request: FastifyRequest, reply: FastifyReply) {
  const filters = searchArtistsSchema.parse(request.query)
  return reply.send(await service.searchArtists(filters))
}

export async function addMedia(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = addMediaSchema.parse(request.body)
  const media = await service.addMedia(sub, data)
  return reply.status(201).send(media)
}

export async function removeMedia(
  request: FastifyRequest<{ Params: { mediaId: string } }>,
  reply: FastifyReply,
) {
  const { sub } = request.user as { sub: string }
  await service.removeMedia(sub, request.params.mediaId)
  return reply.status(204).send()
}
