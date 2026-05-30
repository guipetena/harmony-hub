import { FastifyRequest, FastifyReply } from 'fastify'
import { createAvailabilitySchema, updateAvailabilitySchema } from './availability.dto'
import * as service from './availability.service'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  return reply.send(await service.listAvailabilities(sub))
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = createAvailabilitySchema.parse(request.body)
  return reply.status(201).send(await service.createAvailability(sub, data))
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { sub } = request.user as { sub: string }
  const data = updateAvailabilitySchema.parse(request.body)
  return reply.send(await service.updateAvailability(sub, request.params.id, data))
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { sub } = request.user as { sub: string }
  await service.deleteAvailability(sub, request.params.id)
  return reply.status(204).send()
}
