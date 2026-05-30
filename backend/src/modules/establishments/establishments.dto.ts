import { z } from 'zod'

export const createEstablishmentSchema = z.object({
  establishmentName: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
  description: z.string().optional(),
  whatsapp: z.string().optional(),
})

export const updateEstablishmentSchema = createEstablishmentSchema.partial()

export type CreateEstablishmentDto = z.infer<typeof createEstablishmentSchema>
export type UpdateEstablishmentDto = z.infer<typeof updateEstablishmentSchema>
