import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ error: 'Token inválido ou ausente' })
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticate(request, reply)
    const user = request.user as { role: string }
    if (!roles.includes(user.role)) {
      return reply.status(403).send({ error: 'Acesso negado para este perfil' })
    }
  }
}
