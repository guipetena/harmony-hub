import { FastifyRequest } from 'fastify'

export interface JwtPayload {
  sub: string   // userId
  role: string
}

// Helper para pegar o usuário autenticado da request
export function getUser(request: FastifyRequest): JwtPayload {
  return request.user as JwtPayload
}
