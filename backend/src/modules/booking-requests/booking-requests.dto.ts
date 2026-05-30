import { z } from 'zod'

export const createBookingSchema = z.object({
  artistProfileId: z.string().uuid(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  message: z.string().min(10),
  estimatedBudget: z.number().positive().optional(),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']),
})

export type CreateBookingDto = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusSchema>
