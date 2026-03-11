import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserSelectedExamSlugs } from "@/lib/database"
import { EXAM_DISPLAY_NAMES, isAllowedExamSlug } from "@/lib/exams"

export default async function PublicProfilePage(props: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  const params = await props.params
  const targetUserId = params.id

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, total_xp, current_streak, longest_streak")
    .eq("id", targetUserId)
    .single()

  if (!profile) {
    redirect("/leaderboard")
  }

  const { data: selectedExams } = await supabase
    .from("user_selected_exams")
    .select("exam_slug")
    .eq("user_id", targetUserId)

  const { count: quizzesCompleted } = await supabase
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", targetUserId)

  const { count: mockExamsCompleted } = await supabase
    .from("quiz_attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", targetUserId)
    .eq("mode", "test")

  const { data: recentAttempts } = await supabase
    .from("quiz_attempts")
    .select("id, score, xp_earned, completed_at, mode, exam:exams(id, name, slug)")
    .eq("user_id", targetUserId)
    .order("completed_at", { ascending: false })
    .limit(5)

  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("earned_at, badge:badges(name, rarity)")
    .eq("user_id", targetUserId)
    .order("earned_at", { ascending: false })
    .limit(8)

  const totalXp = profile.total_xp || 0
  const level = Math.floor(totalXp / 500) + 1
  const name = profile.display_name || "Utilizator"
  const avatar = (profile.display_name || "U").slice(0, 2).toUpperCase()
  const examLabels = (selectedExams || [])
    .map((r) => String((r as { exam_slug: string }).exam_slug))
    .filter(isAllowedExamSlug)
    .map((s) => EXAM_DISPLAY_NAMES[s])

  const scores = (recentAttempts || []).map((a) => (a as { score?: number }).score || 0)
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
            {avatar}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-medium text-foreground truncate">{name}</h1>
            <p className="text-sm text-muted-foreground">Nivel {level}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Rezumat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">XP total</span>
                <span className="font-medium text-card-foreground">{totalXp.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Teste finalizate</span>
                <span className="font-medium text-card-foreground">{quizzesCompleted || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Simulări finalizate</span>
                <span className="font-medium text-card-foreground">{mockExamsCompleted || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Streak</span>
                <span className="font-medium text-card-foreground">
                  {profile.current_streak || 0} (max {profile.longest_streak || 0})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Scor mediu (ultimele 5)</span>
                <span className="font-medium text-card-foreground">{avgScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cel mai bun scor (ultimele 5)</span>
                <span className="font-medium text-card-foreground">{bestScore}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Examene selectate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {examLabels.length > 0 ? (
                examLabels.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-muted">
                    {s}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nicio selecție publică.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Performanță recentă</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(recentAttempts || []).length > 0 ? (
                (recentAttempts || []).map((a) => {
                  const attempt = a as unknown as {
                    id: string
                    score: number
                    xp_earned: number
                    completed_at: string | null
                    mode: string
                    exam?: { name: string } | null
                  }

                  return (
                    <div key={attempt.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {attempt.exam?.name || "Exam"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString("ro-RO") : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">{attempt.score}%</p>
                        <p className="text-xs text-muted-foreground">+{attempt.xp_earned} XP</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nu există activitate recentă.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Insigne</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(userBadges || []).length > 0 ? (
                (userBadges || []).map((ub, idx) => {
                  const row = ub as unknown as { badge?: { name?: string; rarity?: string } | null }
                  const name = row.badge?.name || "Insignă"
                  const rarity = (row.badge?.rarity || "common").toLowerCase()
                  const className =
                    rarity === "legendary"
                      ? "bg-warning/10 text-warning border-0"
                      : rarity === "epic"
                      ? "bg-chart-5/10 text-chart-5 border-0"
                      : rarity === "rare"
                      ? "bg-primary/10 text-primary border-0"
                      : "bg-muted text-muted-foreground border-0"

                  return (
                    <Badge key={`${name}-${idx}`} className={className}>
                      {name}
                    </Badge>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">Încă nu are insigne.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          Profil public: nu afișăm email sau date sensibile.
        </p>
      </div>
    </DashboardLayout>
  )
}
