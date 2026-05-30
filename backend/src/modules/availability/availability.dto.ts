import { z } from 'zod'

export const createAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato: HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato: HH:MM'),
  available: z.boolean().default(true),
})

export const updateAvailabilitySchema = createAvailabilitySchema.partial()

export type CreateAvailabilityDto = z.infer<typeof createAvailabilitySchema>
export type UpdateAvailabilityDto = z.infer<typeof updateAvailabilitySchema>
