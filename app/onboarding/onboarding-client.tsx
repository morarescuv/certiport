"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ALLOWED_EXAM_SLUGS, EXAM_DISPLAY_NAMES, type AllowedExamSlug } from "@/lib/exams"

export function OnboardingClient() {
  const router = useRouter()
  const [selected, setSelected] = useState<AllowedExamSlug[]>(["database"])
  const [isSaving, setIsSaving] = useState(false)

  const exams = useMemo(() => ALLOWED_EXAM_SLUGS.map((slug) => ({
    slug,
    name: EXAM_DISPLAY_NAMES[slug],
  })), [])

  async function handleContinue() {
    if (selected.length === 0) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/user/selected-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: selected }),
      })

      if (!res.ok) {
        throw new Error("Failed")
      }

      router.push("/")
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-medium text-foreground">Bun venit</h1>
          <p className="text-sm text-muted-foreground">
            Alege examenele pe care vrei să le pregătești. Poți edita selecția mai târziu.
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Alege examenele</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exams.map((exam) => {
              const checked = selected.includes(exam.slug)
              return (
                <label
                  key={exam.slug}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                >
                  <span className="text-sm font-medium text-card-foreground">{exam.name}</span>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => {
                      const nextChecked = Boolean(value)
                      setSelected((prev) => {
                        if (nextChecked) return Array.from(new Set([...prev, exam.slug]))
                        return prev.filter((s) => s !== exam.slug)
                      })
                    }}
                  />
                </label>
              )
            })}

            <Button className="w-full" onClick={handleContinue} disabled={selected.length === 0 || isSaving}>
              Continuă
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Platforma este în Română. Conținutul examenelor rămâne în English.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
