import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { registerSchema, loginSchema } from './auth.dto'
import { registerUser, loginUser } from './auth.service'

export async function register(request: FastifyRequest, reply: FastifyReply, app: FastifyInstance) {
  const data = registerSchema.parse(request.body)
  const result = await registerUser(data, app)
  return reply.status(201).send(result)
}

export async function login(request: FastifyRequest, reply: FastifyReply, app: FastifyInstance) {
  const data = loginSchema.parse(request.body)
  const result = await loginUser(data, app)
  return reply.send(result)
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user as { sub: string }
  const { prisma } = await import('../../prisma/client')

  const user = await prisma.user.findUnique({
    where: { id: sub },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return reply.send(user)
}
