// All the calls to the BoxBrain backend are in this file.
// The pages import these functions and never use fetch() themselves.

import type { Box, BoxInput, BoxPage } from "./types"

const BOXES_URL = "/api/v1/boxes"

// The backend gives at most 100 boxes per request, so we ask for 100
export const MAX_BOXES = 100

// When something goes wrong, FastAPI sends { "detail": ... }.
// detail is a sentence (404, 409) or a list of problems with the form (422).
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data.detail === "string") {
      return data.detail
    }
    if (Array.isArray(data.detail)) {
      const problems = data.detail.map((problem: { loc: string[]; msg: string }) => {
        const field = problem.loc[problem.loc.length - 1]
        return `${field}: ${problem.msg}`
      })
      return problems.join(", ")
    }
  } catch {
    // the answer was not JSON, so we use the message below
  }
  return `Something went wrong (error ${response.status})`
}

// Sends one request and gives back the JSON answer (or throws an Error with a readable message)
async function sendRequest(url: string, method = "GET", body?: unknown) {
  const options: RequestInit = { method }
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" }
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  if (response.status === 204) {
    return null // DELETE sends back nothing
  }
  return response.json()
}

export function fetchBoxes(): Promise<BoxPage> {
  return sendRequest(`${BOXES_URL}?offset=0&limit=${MAX_BOXES}`)
}

export function fetchBox(id: string): Promise<Box> {
  return sendRequest(`${BOXES_URL}/${id}`)
}

export function addBox(input: BoxInput): Promise<Box> {
  return sendRequest(BOXES_URL, "POST", input)
}

// PATCH: only the fields inside `changes` are updated
export function changeBox(id: string, changes: Partial<BoxInput>): Promise<Box> {
  return sendRequest(`${BOXES_URL}/${id}`, "PATCH", changes)
}

export function deleteBox(id: string): Promise<null> {
  return sendRequest(`${BOXES_URL}/${id}`, "DELETE")
}
