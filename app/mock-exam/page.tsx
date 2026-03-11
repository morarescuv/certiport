import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  FileText,
  Target,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getExams, getUserSelectedExamSlugs } from "@/lib/database"
import { examRecordMatchesAllowedSlug } from "@/lib/exams"

export default async function MockExamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  const exams = await getExams()
  const filteredExams = exams.filter((e) =>
    selectedExamSlugs.some((s) => examRecordMatchesAllowedSlug(e.slug, s))
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Examen simulare</h1>
          <p className="mt-1 text-muted-foreground">
            Simulează mediul real de examen cu timp și punctaj
          </p>
        </div>

        <Card className="border border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">Înainte să începi</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Asigură-te că ai timp suficient pentru a finaliza simularea</li>
                  <li>Alege un loc liniștit, fără întreruperi</li>
                  <li>Simularea se trimite automat când expiră timpul</li>
                  <li>Poți pune pauză, dar cronometrul continuă</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredExams.map((exam) => {
            const questionCount = exam.question_count || 0

            return (
              <Card key={exam.id} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {exam.name}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {exam.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <FileText className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">
                        {questionCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Întrebări</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">
                        {exam.time_limit_minutes} min
                      </p>
                      <p className="text-xs text-muted-foreground">Durată</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <Target className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">
                        {exam.passing_score}%
                      </p>
                      <p className="text-xs text-muted-foreground">Scor de trecere</p>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/practice?exam=${exam.id}&mode=test`}>
                      Începe examenul
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Your Mock Exam Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-medium text-card-foreground">6</p>
                <p className="text-xs text-muted-foreground">Total Attempts</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-medium text-success">2</p>
                <p className="text-xs text-muted-foreground">Exams Passed</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-medium text-card-foreground">81%</p>
                <p className="text-xs text-muted-foreground">Avg. Score</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-medium text-primary">94%</p>
                <p className="text-xs text-muted-foreground">Best Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
