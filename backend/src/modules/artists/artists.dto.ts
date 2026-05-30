import { z } from 'zod'

const ARTIST_TYPES = ['Solo', 'Dupla', 'Banda'] as const

export const createArtistProfileSchema = z.object({
  artisticName: z.string().min(2),
  shortBio: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().min(2),
  state: z.string().length(2),
  type: z.enum(ARTIST_TYPES).default('Solo'),
  priceMin: z.number().int().min(0),
  priceMax: z.number().int().min(0),
  musicalStyles: z.array(z.string()).min(1),
  membersCount: z.number().int().min(1).default(1),
  available: z.boolean().default(true),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  spotify: z.string().optional(),
  youtube: z.string().optional(),
})

export const updateArtistProfileSchema = createArtistProfileSchema.partial()

export const addMediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO']),
  url: z.string().url(),
})

export const searchArtistsSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  musicalStyle: z.string().optional(),
  type: z.enum(ARTIST_TYPES).optional(),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  available: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export type CreateArtistProfileDto = z.infer<typeof createArtistProfileSchema>
export type UpdateArtistProfileDto = z.infer<typeof updateArtistProfileSchema>
export type AddMediaDto = z.infer<typeof addMediaSchema>
export type SearchArtistsDto = z.infer<typeof searchArtistsSchema>
