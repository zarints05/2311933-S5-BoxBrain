// Converts between form values and API shapes, holds the form validation rules and small box helpers.
import dayjs, { type Dayjs } from "dayjs"
import type { Box, BoxInput } from "../types/box"

export type BoxFormValues = {
  number: number
  label: string
  location: string
  contents?: string
  notes?: string
  last_opened_on: Dayjs
}

export const toBoxInput = (values: BoxFormValues): BoxInput => ({
  number: values.number,
  label: values.label.trim(),
  location: values.location.trim(),
  contents: values.contents?.trim() ?? "",
  notes: values.notes?.trim() || null,
  last_opened_on: values.last_opened_on.format("YYYY-MM-DD"),
})

export const toFormValues = (box: Box): BoxFormValues => ({
  number: box.number,
  label: box.label,
  location: box.location,
  contents: box.contents,
  notes: box.notes ?? "",
  last_opened_on: dayjs(box.last_opened_on),
})

// One item per line; empty lines are ignored.
export const contentLines = (contents: string) =>
  contents
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

// A box counts as forgotten if nobody has opened it for 12 months.
export const isForgotten = (box: Box) => dayjs(box.last_opened_on).isBefore(dayjs().subtract(12, "month"), "day")

export const today = () => dayjs().format("YYYY-MM-DD")

export const disableFutureDates = (day: Dayjs) => day.isAfter(dayjs(), "day")

export const numberRules = [{ required: true, message: "Box number is required" }]

export const labelRules = [
  { required: true, whitespace: true, message: "Label is required" },
  { max: 200, message: "Label must be at most 200 characters" },
]

export const locationRules = [
  { required: true, whitespace: true, message: "Location is required" },
  { max: 200, message: "Location must be at most 200 characters" },
]

export const contentsRules = [{ max: 2000, message: "Contents must be at most 2000 characters" }]

export const notesRules = [{ max: 1000, message: "Notes must be at most 1000 characters" }]

export const dateRules = [{ required: true, message: "Date is required" }]
