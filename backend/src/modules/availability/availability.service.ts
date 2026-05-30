import { prisma } from '../../prisma/client'
import { NotFoundError, ForbiddenError } from '../../shared/errors'
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './availability.dto'

async function getArtistProfile(userId: string) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Perfil de artista')
  return profile
}

export async function listAvailabilities(userId: string) {
  const profile = await getArtistProfile(userId)
  return prisma.availability.findMany({
    where: { artistProfileId: profile.id },
    orderBy: { date: 'asc' },
  })
}

export async function createAvailability(userId: string, data: CreateAvailabilityDto) {
  const profile = await getArtistProfile(userId)
  return prisma.availability.create({
    data: {
      artistProfileId: profile.id,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      available: data.available,
    },
  })
}

export async function updateAvailability(userId: string, id: string, data: UpdateAvailabilityDto) {
  const profile = await getArtistProfile(userId)
  const availability = await prisma.availability.findUnique({ where: { id } })
  if (!availability) throw new NotFoundError('Disponibilidade')
  if (availability.artistProfileId !== profile.id) throw new ForbiddenError()

  return prisma.availability.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  })
}

export async function deleteAvailability(userId: string, id: string) {
  const profile = await getArtistProfile(userId)
  const availability = await prisma.availability.findUnique({ where: { id } })
  if (!availability) throw new NotFoundError('Disponibilidade')
  if (availability.artistProfileId !== profile.id) throw new ForbiddenError()

  await prisma.availability.delete({ where: { id } })
}
