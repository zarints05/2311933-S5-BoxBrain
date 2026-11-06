// The shape of the data the backend sends and receives.

// One box, exactly as the backend sends it
export type Box = {
  id: string
  number: number
  label: string
  location: string
  contents: string // one item per line
  notes: string | null
  last_opened_on: string // "2026-11-06"
  created_at: string
  updated_at: string
}

// What we send when we add a box (and, partly, when we change one)
export type BoxInput = {
  number: number
  label: string
  location: string
  contents: string
  notes: string | null
  last_opened_on: string
}

// GET /api/v1/boxes answers with a page of boxes
export type BoxPage = {
  items: Box[]
  total: number // all boxes in the database, not only this page
  offset: number
  limit: number
}
