import { prisma } from '../../prisma/client'
import { AppError, NotFoundError } from '../../shared/errors'
import { CreateEstablishmentDto, UpdateEstablishmentDto } from './establishments.dto'

export async function createEstablishment(userId: string, data: CreateEstablishmentDto) {
  const existing = await prisma.establishmentProfile.findUnique({ where: { userId } })
  if (existing) throw new AppError('Perfil de estabelecimento já existe', 409)

  return prisma.establishmentProfile.create({ data: { ...data, userId } })
}

export async function updateEstablishment(userId: string, data: UpdateEstablishmentDto) {
  const profile = await prisma.establishmentProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Estabelecimento')

  return prisma.establishmentProfile.update({ where: { userId }, data })
}

export async function getMyEstablishment(userId: string) {
  const profile = await prisma.establishmentProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Estabelecimento')
  return profile
}

export async function getEstablishmentById(id: string) {
  const profile = await prisma.establishmentProfile.findUnique({
    where: { id },
    select: {
      id: true,
      establishmentName: true,
      city: true,
      state: true,
      description: true,
      createdAt: true,
    },
  })
  if (!profile) throw new NotFoundError('Estabelecimento')
  return profile
}
