export const ALLOWED_EXAM_SLUGS = ["database", "python", "networking"] as const

export type AllowedExamSlug = (typeof ALLOWED_EXAM_SLUGS)[number]

export const EXAM_DISPLAY_NAMES: Record<AllowedExamSlug, string> = {
  database: "Database",
  python: "Python",
  networking: "Networking",
}

export function isAllowedExamSlug(value: string): value is AllowedExamSlug {
  return (ALLOWED_EXAM_SLUGS as readonly string[]).includes(value)
}

export function examRecordMatchesAllowedSlug(examSlug: string, allowed: AllowedExamSlug): boolean {
  const s = (examSlug || "").toLowerCase()
  if (allowed === "database") return s.startsWith("database")
  if (allowed === "python") return s.startsWith("python")
  if (allowed === "networking") return s.startsWith("networking")
  return false
}
