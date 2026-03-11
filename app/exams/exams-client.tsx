"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ALLOWED_EXAM_SLUGS, EXAM_DISPLAY_NAMES, type AllowedExamSlug } from "@/lib/exams"

export function ExamsClient({ initialSelected }: { initialSelected: AllowedExamSlug[] }) {
  const [selected, setSelected] = useState<AllowedExamSlug[]>(initialSelected)
  const [isSaving, setIsSaving] = useState(false)
  const [lockedOpen, setLockedOpen] = useState(false)

  const exams = useMemo(
    () =>
      ALLOWED_EXAM_SLUGS.map((slug) => ({
        slug,
        name: EXAM_DISPLAY_NAMES[slug],
      })),
    []
  )

  const hasChanges = useMemo(() => {
    const a = Array.from(new Set(initialSelected)).sort().join(",")
    const b = Array.from(new Set(selected)).sort().join(",")
    return a !== b
  }, [initialSelected, selected])

  async function save() {
    setIsSaving(true)
    try {
      const res = await fetch("/api/user/selected-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: selected }),
      })

      if (!res.ok) throw new Error("Failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Administrează examenele</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Alege ce examene vrei să vezi în aplicație.
          </p>
        </div>
        <Button variant="outline" onClick={() => setLockedOpen(true)}>
          Adaugă examen
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Examenele tale</CardTitle>
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

          <div className="pt-2">
            <Button className="w-full" onClick={save} disabled={!hasChanges || isSaving}>
              Salvează
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={lockedOpen} onOpenChange={setLockedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adaugă examen</DialogTitle>
            <DialogDescription>
              În viitor, adăugarea de examene suplimentare va necesita un abonament lunar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Button className="w-full" disabled>
              În curând
            </Button>
            <Button className="w-full" variant="outline" disabled>
              Upgrade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
