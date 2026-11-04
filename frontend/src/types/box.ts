// TypeScript shapes that mirror the backend schemas.
export type Box = {
  id: string
  number: number
  label: string
  location: string
  contents: string
  notes: string | null
  last_opened_on: string
  created_at: string
  updated_at: string
}

// Matches BoxPage on the backend; total counts every box, not just this page.
export type BoxPage = {
  items: Box[]
  total: number
  offset: number
  limit: number
}

// Matches BoxCreate on the backend.
export type BoxInput = {
  number: number
  label: string
  location: string
  contents: string
  notes: string | null
  last_opened_on: string
}

// Matches BoxUpdate on the backend: only the fields sent are changed.
export type BoxPatch = Partial<BoxInput>
