import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha mínima de 6 caracteres'),
  role: z.enum(['ARTIST', 'ESTABLISHMENT']),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type RegisterDto = z.infer<typeof registerSchema>
export type LoginDto = z.infer<typeof loginSchema>
