import { prisma } from '../../prisma/client'
import { AppError, NotFoundError, ForbiddenError } from '../../shared/errors'
import {
  CreateArtistProfileDto,
  UpdateArtistProfileDto,
  AddMediaDto,
  SearchArtistsDto,
} from './artists.dto'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base
  let suffix = 0
  while (true) {
    const existing = await prisma.artistProfile.findUnique({ where: { slug } })
    if (!existing || existing.id === excludeId) return slug
    suffix++
    slug = `${base}-${suffix}`
  }
}

const profileInclude = {
  medias: true,
  availabilities: { where: { available: true } },
  reviews: {
    include: { establishmentProfile: { select: { establishmentName: true } } },
    orderBy: { createdAt: 'desc' } as const,
    take: 10,
  },
}

export async function createArtistProfile(userId: string, data: CreateArtistProfileDto) {
  const existing = await prisma.artistProfile.findUnique({ where: { userId } })
  if (existing) throw new AppError('Perfil de artista já existe para este usuário', 409)

  const slug = await uniqueSlug(generateSlug(data.artisticName))

  return prisma.artistProfile.create({
    data: { ...data, userId, slug },
    include: { medias: true },
  })
}

export async function updateArtistProfile(userId: string, data: UpdateArtistProfileDto) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Perfil de artista')

  let slug = profile.slug
  if (data.artisticName && data.artisticName !== profile.artisticName) {
    slug = await uniqueSlug(generateSlug(data.artisticName), profile.id)
  }

  return prisma.artistProfile.update({
    where: { userId },
    data: { ...data, slug },
    include: { medias: true, availabilities: true },
  })
}

export async function getArtistByUserId(userId: string) {
  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    include: { medias: true, availabilities: true, reviews: true },
  })
  if (!profile) throw new NotFoundError('Perfil de artista')
  return profile
}

// Aceita UUID ou slug
export async function getArtistById(idOrSlug: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)

  const profile = await prisma.artistProfile.findUnique({
    where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
    include: profileInclude,
  })
  if (!profile) throw new NotFoundError('Artista')
  return profile
}

export async function searchArtists(filters: SearchArtistsDto) {
  const { city, state, musicalStyle, type, priceMin, priceMax, available, page, limit } = filters
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (state) where.state = state.toUpperCase()
  if (musicalStyle) where.musicalStyles = { has: musicalStyle }
  if (type) where.type = type
  if (available !== undefined) where.available = available
  if (priceMin !== undefined || priceMax !== undefined) {
    where.priceMin = { gte: priceMin ?? 0 }
    where.priceMax = { lte: priceMax ?? 999999 }
  }

  const [total, artists] = await Promise.all([
    prisma.artistProfile.count({ where }),
    prisma.artistProfile.findMany({
      where,
      skip,
      take: limit,
      include: { medias: { where: { type: 'IMAGE' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return { total, page, limit, artists }
}

export async function addMedia(userId: string, data: AddMediaDto) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Perfil de artista')

  return prisma.artistMedia.create({
    data: { ...data, artistProfileId: profile.id },
  })
}

export async function removeMedia(userId: string, mediaId: string) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Perfil de artista')

  const media = await prisma.artistMedia.findUnique({ where: { id: mediaId } })
  if (!media) throw new NotFoundError('Mídia')
  if (media.artistProfileId !== profile.id) throw new ForbiddenError()

  await prisma.artistMedia.delete({ where: { id: mediaId } })
}
