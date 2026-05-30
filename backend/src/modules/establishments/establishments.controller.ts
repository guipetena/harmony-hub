import { FastifyRequest, FastifyReply } from 'fastify'
import { createEstablishmentSchema, updateEstablishmentSchema } from './establishments.dto'
import * as service from './establishments.service'

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await service.getEstablishmentById(request.params.id))
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = createEstablishmentSchema.parse(request.body)
  return reply.status(201).send(await service.createEstablishment(sub, data))
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = updateEstablishmentSchema.parse(request.body)
  return reply.send(await service.updateEstablishment(sub, data))
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  return reply.send(await service.getMyEstablishment(sub))
}
