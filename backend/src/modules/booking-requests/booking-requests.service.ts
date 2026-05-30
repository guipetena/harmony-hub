import { prisma } from '../../prisma/client'
import { AppError, NotFoundError, ForbiddenError } from '../../shared/errors'
import { CreateBookingDto, UpdateBookingStatusDto } from './booking-requests.dto'

// Estabelecimento cria solicitação
export async function createBooking(userId: string, data: CreateBookingDto) {
  const establishment = await prisma.establishmentProfile.findUnique({ where: { userId } })
  if (!establishment) throw new NotFoundError('Estabelecimento')

  const artist = await prisma.artistProfile.findUnique({ where: { id: data.artistProfileId } })
  if (!artist) throw new NotFoundError('Artista')

  return prisma.bookingRequest.create({
    data: {
      artistProfileId: data.artistProfileId,
      establishmentProfileId: establishment.id,
      eventDate: new Date(data.eventDate),
      message: data.message,
      estimatedBudget: data.estimatedBudget,
    },
    include: {
      artistProfile: { select: { artisticName: true } },
      establishmentProfile: { select: { establishmentName: true } },
    },
  })
}

function maskWhatsapp<T extends { status: string; artistProfile: { whatsapp: string | null }; establishmentProfile: { whatsapp: string | null } }>(booking: T): T {
  if (booking.status !== 'ACCEPTED') {
    booking.artistProfile.whatsapp = null
    booking.establishmentProfile.whatsapp = null
  }
  return booking
}

const bookingInclude = {
  artistProfile: { select: { artisticName: true, city: true, whatsapp: true } },
  establishmentProfile: { select: { establishmentName: true, city: true, whatsapp: true } },
}

// Artista: lista solicitações recebidas
// Estabelecimento: lista solicitações enviadas
export async function listBookings(userId: string, role: string) {
  if (role === 'ARTIST') {
    const profile = await prisma.artistProfile.findUnique({ where: { userId } })
    if (!profile) throw new NotFoundError('Perfil de artista')

    const bookings = await prisma.bookingRequest.findMany({
      where: { artistProfileId: profile.id },
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
    })
    return bookings.map(maskWhatsapp)
  }

  const profile = await prisma.establishmentProfile.findUnique({ where: { userId } })
  if (!profile) throw new NotFoundError('Estabelecimento')

  const bookings = await prisma.bookingRequest.findMany({
    where: { establishmentProfileId: profile.id },
    include: bookingInclude,
    orderBy: { createdAt: 'desc' },
  })
  return bookings.map(maskWhatsapp)
}

export async function getBookingById(userId: string, role: string, bookingId: string) {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    include: bookingInclude,
  })
  if (!booking) throw new NotFoundError('Solicitação')

  if (role === 'ARTIST') {
    const profile = await prisma.artistProfile.findUnique({ where: { userId } })
    if (!profile || booking.artistProfileId !== profile.id) throw new ForbiddenError()
  } else {
    const profile = await prisma.establishmentProfile.findUnique({ where: { userId } })
    if (!profile || booking.establishmentProfileId !== profile.id) throw new ForbiddenError()
  }

  return maskWhatsapp(booking)
}

// Artista aceita/rejeita; estabelecimento pode cancelar/completar
export async function updateBookingStatus(
  userId: string,
  role: string,
  bookingId: string,
  data: UpdateBookingStatusDto,
) {
  const booking = await prisma.bookingRequest.findUnique({ where: { id: bookingId } })
  if (!booking) throw new NotFoundError('Solicitação')

  if (role === 'ARTIST') {
    const profile = await prisma.artistProfile.findUnique({ where: { userId } })
    if (!profile || booking.artistProfileId !== profile.id) throw new ForbiddenError()
    if (!['ACCEPTED', 'REJECTED'].includes(data.status)) {
      throw new AppError('Artistas só podem aceitar ou rejeitar solicitações')
    }
  } else {
    const profile = await prisma.establishmentProfile.findUnique({ where: { userId } })
    if (!profile || booking.establishmentProfileId !== profile.id) throw new ForbiddenError()
    if (!['COMPLETED', 'CANCELLED'].includes(data.status)) {
      throw new AppError('Estabelecimentos só podem completar ou cancelar solicitações')
    }
  }

  const updated = await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status: data.status },
    include: bookingInclude,
  })

  return maskWhatsapp(updated)
}
