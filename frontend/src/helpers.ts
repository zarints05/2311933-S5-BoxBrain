// Small helper functions used by more than one page.

import dayjs, { type Dayjs } from "dayjs"
import type { Box, BoxInput } from "./types"

// Today's date in the format the backend uses, e.g. "2026-11-06"
export function todayString(): string {
  return dayjs().format("YYYY-MM-DD")
}

// "3 sweaters\nJacket\n\nScarf" -> ["3 sweaters", "Jacket", "Scarf"]
export function itemsInside(box: Box): string[] {
  return box.contents
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
}

// True when nobody has opened the box for more than a year
export function notOpenedForAYear(box: Box): boolean {
  const oneYearAgo = dayjs().subtract(1, "year")
  return dayjs(box.last_opened_on).isBefore(oneYearAgo, "day")
}

// Used by the date picker to grey out days after today
export function isAfterToday(day: Dayjs): boolean {
  return day.isAfter(dayjs(), "day")
}

// ---- the box form ----

// What the form fields hold. The date picker works with a Dayjs object, not a string.
export type BoxFormValues = {
  number: number
  label: string
  location: string
  contents?: string
  notes?: string
  last_opened_on: Dayjs
}

// A fresh form for a new box
export function newBoxFormValues(suggestedNumber: number): Partial<BoxFormValues> {
  return { number: suggestedNumber, last_opened_on: dayjs() }
}

// Fill the form with a box that already exists (for editing)
export function boxToFormValues(box: Box): BoxFormValues {
  return {
    number: box.number,
    label: box.label,
    location: box.location,
    contents: box.contents,
    notes: box.notes ?? "",
    last_opened_on: dayjs(box.last_opened_on),
  }
}

// Turn the form values into what the backend expects
export function formValuesToInput(values: BoxFormValues): BoxInput {
  const notes = (values.notes ?? "").trim()
  return {
    number: values.number,
    label: values.label.trim(),
    location: values.location.trim(),
    contents: (values.contents ?? "").trim(),
    notes: notes === "" ? null : notes, // an empty notes field is saved as "no notes"
    last_opened_on: values.last_opened_on.format("YYYY-MM-DD"),
  }
}

// ---- colours ----

// Every box gets its own colour, like coloured tape on a real box.
// The colour comes from the box number, so a box always keeps the same colour.
const BOX_COLOURS = ["#f97316", "#0d9488", "#8b5cf6", "#ec4899", "#2563eb", "#16a34a"]

export function boxColour(box: Box): string {
  return BOX_COLOURS[box.number % BOX_COLOURS.length]
}
