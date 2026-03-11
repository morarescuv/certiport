"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ALLOWED_EXAM_SLUGS, EXAM_DISPLAY_NAMES, type AllowedExamSlug } from "@/lib/exams"
import { Lock } from "lucide-react"

export function ExameneleMeleClient({ initialSelected }: { initialSelected: AllowedExamSlug[] }) {
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

  const selectedNames = useMemo(() => selected.map((s) => EXAM_DISPLAY_NAMES[s]), [selected])

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
      <Card className="border shadow-sm bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-medium">Examenele mele</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Examenele selectate influențează experiența completă: Panou principal, Teste de practică,
                Examen simulare, statistici și progres.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setLockedOpen(true)}>
                Adaugă examen
              </Button>
              <Button onClick={save} disabled={!hasChanges || isSaving}>
                Salvează
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedNames.map((name) => (
              <Badge key={name} variant="secondary" className="bg-background">
                {name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Selectează examenele</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {exams.map((exam) => {
            const checked = selected.includes(exam.slug)
            return (
              <label
                key={exam.slug}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {checked ? "Selectat" : "Ne-selectat"}
                  </p>
                </div>
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
              Salvează modificările
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Examene viitoare (blocate)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Cybersecurity Fundamentals",
            "AI Fundamentals",
            "Cloud Fundamentals",
          ].map((name) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground">Disponibil prin abonament (în curând)</p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}

          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={() => setLockedOpen(true)}>
              Adaugă examen (Premium)
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
