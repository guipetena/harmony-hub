const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.error ?? 'Erro inesperado', res.status)
  }
  return res.json()
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

// ── Types ────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'ARTIST' | 'ESTABLISHMENT'
}

export interface ArtistProfile {
  id: string
  slug: string
  artisticName: string
  shortBio: string | null
  bio: string | null
  city: string
  state: string
  type: string
  priceMin: number
  priceMax: number
  musicalStyles: string[]
  membersCount: number
  available: boolean
  whatsapp: string | null
  instagram: string | null
  spotify: string | null
  youtube: string | null
  verified: boolean
  createdAt: string
  medias: { id: string; type: 'IMAGE' | 'VIDEO'; url: string }[]
  availabilities?: { id: string; date: string; startTime: string; endTime: string }[]
  reviews?: {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    establishmentProfile: { establishmentName: string }
  }[]
}

export interface BookingRequest {
  id: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  eventDate: string
  message: string
  estimatedBudget: number | null
  createdAt: string
  artistProfile: { artisticName: string; city: string; whatsapp: string | null }
  establishmentProfile: { establishmentName: string; city: string; whatsapp: string | null }
}

// ── Auth ─────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const data = await request<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  saveAuth(data.token, data.user)
  return data
}

export async function register(payload: {
  name: string
  email: string
  password: string
  role: 'ARTIST' | 'ESTABLISHMENT'
}) {
  const data = await request<{ token: string; user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  saveAuth(data.token, data.user)
  return data
}

export function getMe() {
  return request<AuthUser>('/auth/me')
}

// ── Artists ──────────────────────────────────────────────────────────────

export interface SearchParams {
  city?: string
  state?: string
  musicalStyle?: string
  type?: string
  priceMin?: number
  priceMax?: number
  available?: boolean
  page?: number
  limit?: number
}

export function searchArtists(params: SearchParams = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v))
  })
  return request<{ total: number; page: number; limit: number; artists: ArtistProfile[] }>(
    `/artists?${q}`,
  )
}

export function getArtist(slugOrId: string) {
  return request<ArtistProfile>(`/artists/${slugOrId}`)
}

export function getMyArtistProfile() {
  return request<ArtistProfile>('/artists/me/profile')
}

export function updateMyArtistProfile(data: Partial<CreateArtistProfilePayload>) {
  return request<ArtistProfile>('/artists/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ── Bookings ─────────────────────────────────────────────────────────────

export function listBookings() {
  return request<BookingRequest[]>('/bookings')
}

export function updateBookingStatus(id: string, status: BookingRequest['status']) {
  return request<BookingRequest>(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ── Availability ──────────────────────────────────────────────────────────

export interface AvailabilityRecord {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export function listAvailability() {
  return request<AvailabilityRecord[]>('/availability')
}

// ── Internal types ────────────────────────────────────────────────────────

interface CreateArtistProfilePayload {
  artisticName: string
  shortBio: string
  bio: string
  city: string
  state: string
  type: string
  priceMin: number
  priceMax: number
  musicalStyles: string[]
  membersCount: number
  available: boolean
  whatsapp: string
  instagram: string
  spotify: string
  youtube: string
}
