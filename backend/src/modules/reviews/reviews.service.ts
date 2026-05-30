import { prisma } from '../../prisma/client'
import { AppError, NotFoundError } from '../../shared/errors'
import { CreateReviewDto } from './reviews.dto'

export async function createReview(userId: string, data: CreateReviewDto) {
  const establishment = await prisma.establishmentProfile.findUnique({ where: { userId } })
  if (!establishment) throw new NotFoundError('Estabelecimento')

  const artist = await prisma.artistProfile.findUnique({ where: { id: data.artistProfileId } })
  if (!artist) throw new NotFoundError('Artista')

  // Só pode avaliar se houver uma contratação COMPLETED entre eles
  const completed = await prisma.bookingRequest.findFirst({
    where: {
      artistProfileId: data.artistProfileId,
      establishmentProfileId: establishment.id,
      status: 'COMPLETED',
    },
  })
  if (!completed) {
    throw new AppError('Você só pode avaliar artistas após uma contratação concluída', 403)
  }

  // Evita review duplicada
  const existing = await prisma.review.findFirst({
    where: {
      artistProfileId: data.artistProfileId,
      establishmentProfileId: establishment.id,
    },
  })
  if (existing) throw new AppError('Você já avaliou este artista', 409)

  return prisma.review.create({
    data: {
      artistProfileId: data.artistProfileId,
      establishmentProfileId: establishment.id,
      rating: data.rating,
      comment: data.comment,
    },
  })
}

export async function getArtistReviews(artistProfileId: string) {
  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { artistProfileId },
      include: {
        establishmentProfile: { select: { establishmentName: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.aggregate({
      where: { artistProfileId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ])

  return {
    reviews,
    average: aggregate._avg.rating ?? 0,
    total: aggregate._count.rating,
  }
}
