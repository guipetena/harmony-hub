import { FastifyRequest, FastifyReply } from 'fastify'
import { createBookingSchema, updateBookingStatusSchema } from './booking-requests.dto'
import * as service from './booking-requests.service'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const data = createBookingSchema.parse(request.body)
  return reply.status(201).send(await service.createBooking(sub, data))
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const { sub, role } = request.user as { sub: string; role: string }
  return reply.send(await service.listBookings(sub, role))
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { sub, role } = request.user as { sub: string; role: string }
  return reply.send(await service.getBookingById(sub, role, request.params.id))
}

export async function updateStatus(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { sub, role } = request.user as { sub: string; role: string }
  const data = updateBookingStatusSchema.parse(request.body)
  return reply.send(await service.updateBookingStatus(sub, role, request.params.id, data))
}
