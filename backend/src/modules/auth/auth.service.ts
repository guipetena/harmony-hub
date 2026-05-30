import bcrypt from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { prisma } from '../../prisma/client'
import { AppError } from '../../shared/errors'
import { RegisterDto, LoginDto } from './auth.dto'

export async function registerUser(data: RegisterDto, app: FastifyInstance) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new AppError('E-mail já cadastrado', 409)

  const hashed = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  const token = app.jwt.sign({ sub: user.id, role: user.role })
  return { user, token }
}

export async function loginUser(data: LoginDto, app: FastifyInstance) {
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user) throw new AppError('Credenciais inválidas', 401)

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) throw new AppError('Credenciais inválidas', 401)

  const token = app.jwt.sign({ sub: user.id, role: user.role })
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  }
}
