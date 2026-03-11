import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { MissionCard } from "@/components/mission-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Zap,
  Clock,
  TrendingUp,
  ArrowRight,
  Award,
  Trophy,
  Flame,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  getUserMissions,
  getExams,
  getLeaderboard,
  assignDailyMissions,
  getUserSelectedExamSlugs,
  getProfileAnalytics,
} from "@/lib/database"
import { EXAM_DISPLAY_NAMES, type AllowedExamSlug, examRecordMatchesAllowedSlug } from "@/lib/exams"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  // Assign daily missions if needed
  await assignDailyMissions(user.id)

  // Fetch all data in parallel
  const [analytics, missions, exams, leaderboard] = await Promise.all([
    getProfileAnalytics(user.id),
    getUserMissions(user.id),
    getExams(),
    getLeaderboard("all"),
  ])

  const selectedExams = exams.filter((e) =>
    selectedExamSlugs.some((s) => examRecordMatchesAllowedSlug(e.slug, s))
  )

  const selectedExamNames = (selectedExamSlugs as AllowedExamSlug[]).map((s) => EXAM_DISPLAY_NAMES[s])

  const displayName = analytics.profile?.display_name || user.email?.split("@")[0] || "Utilizator"
  const totalXp = analytics.profile?.total_xp || 0
  const currentStreak = analytics.currentStreak
  const level = Math.floor(totalXp / 500) + 1

  // Calculate available XP from incomplete missions
  const availableXp = missions
    .filter(m => !m.is_completed)
    .reduce((sum, m) => sum + (m.mission?.xp_reward || 0), 0)

  // Find user's rank in leaderboard
  const userRank = leaderboard.findIndex(p => p.id === user.id) + 1

  // Calculate exam progress based on recent attempts
  const examProgress = new Map<string, number>()
  for (const attempt of analytics.recentAttempts) {
    if (attempt.exam_id) {
      const current = examProgress.get(attempt.exam_id) || 0
      examProgress.set(attempt.exam_id, Math.max(current, attempt.score))
    }
  }

  const examModules = selectedExams.map((exam) => ({
    id: exam.id,
    title: exam.name,
    description: exam.description || "",
    durationMinutes: exam.time_limit_minutes,
    questionCount: exam.question_count || 0,
    passingScore: exam.passing_score,
    progress: examProgress.get(exam.id) || 0,
    difficulty: exam.difficulty as "Easy" | "Medium" | "Hard",
  }))

  // Map missions for display
  const missionCards = missions.map(um => ({
    title: um.mission?.name || "Misiune",
    description: um.mission?.description || "",
    xpReward: um.mission?.xp_reward || 0,
    progress: um.current_progress,
    target: um.mission?.target_value || 1,
    isCompleted: um.is_completed,
  }))

  // Create leaderboard display data
  const leaderboardData = leaderboard.slice(0, 5).map((profile, index) => ({
    rank: index + 1,
    name: profile.display_name || "Anonymous",
    xp: profile.total_xp,
    avatar: (profile.display_name || "A").slice(0, 2).toUpperCase(),
    isCurrentUser: profile.id === user.id,
  }))

  // If user is not in top 5, add them
  if (userRank > 5) {
    leaderboardData.push({
      rank: userRank,
      name: displayName,
      xp: totalXp,
      avatar: displayName.slice(0, 2).toUpperCase(),
      isCurrentUser: true,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="border border-primary/20 bg-background/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Panou principal</p>
                <h1 className="mt-1 text-2xl font-medium text-foreground truncate">
                  Bun venit, {displayName}!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Continuă să înveți consecvent ca să-ți crești scorul.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-muted">
                    Nivel {level}
                  </Badge>
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
                    <Flame className="mr-1 h-3.5 w-3.5" />
                    {currentStreak} zile
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    <Zap className="mr-1 h-3.5 w-3.5" />
                    {totalXp.toLocaleString()} XP
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/practice">Începe practica</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/mock-exam">Examen simulare</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-medium">Examenele mele</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Examenele selectate îți definesc parcursul: conținutul din Panou principal, Teste de practică,
                  Examen simulare, statistici și progres.
                </p>
              </div>
              <Button asChild>
                <Link href="/examenele-mele">Gestionează</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedExamNames.map((name) => (
                <Badge key={name} variant="secondary" className="bg-background">
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pregătire examen"
            value={`${analytics.averageScorePercent}%`}
            subtitle="Scor mediu"
            icon={Target}
            variant="primary"
          />
          <StatCard
            title="XP total"
            value={totalXp.toLocaleString()}
            subtitle={`Nivel ${level}`}
            icon={Zap}
            variant="success"
          />
          <StatCard
            title="Teste finalizate"
            value={analytics.quizzesCompleted.toString()}
            subtitle="Total sesiuni"
            icon={Clock}
          />
          <StatCard
            title="Insigne"
            value={analytics.badges.length.toString()}
            subtitle="Obținute"
            icon={TrendingUp}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pilon principal</p>
              <h2 className="text-lg font-medium text-foreground">Continuă practica</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/practice">
                Vezi tot <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {examModules.map((exam) => (
              <Card key={exam.id} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="text-lg font-medium truncate">{exam.title}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {exam.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-muted shrink-0">
                      {exam.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <FileText className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">{exam.questionCount}</p>
                      <p className="text-xs text-muted-foreground">Întrebări</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">{exam.durationMinutes} min</p>
                      <p className="text-xs text-muted-foreground">Durată</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <Target className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">{exam.passingScore}%</p>
                      <p className="text-xs text-muted-foreground">Scor de trecere</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progres (cel mai bun scor)</span>
                      <span className="font-medium text-card-foreground">{exam.progress}%</span>
                    </div>
                    <Progress value={exam.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/practice?exam=${exam.id}&mode=practice`}>
                        Practică (10)
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href={`/practice?exam=${exam.id}&mode=test`}>
                        Test complet
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Activitate recentă</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/profile">Vezi istoricul</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentAttempts.length > 0 ? (
                    analytics.recentAttempts.slice(0, 5).map((attempt) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {attempt.exam?.name || "Exam"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attempt.completed_at
                              ? new Date(attempt.completed_at).toLocaleDateString("ro-RO")
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-card-foreground">{attempt.score}%</p>
                            <p className="text-xs text-muted-foreground">+{attempt.xp_earned} XP</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      Nu ai teste finalizate încă. Începe practica pentru a vedea progresul!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Motivație</p>
                <h2 className="text-lg font-medium text-foreground">Misiuni zilnice</h2>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                +{availableXp} XP disponibil
              </Badge>
            </div>
            <div className="space-y-3">
              {missionCards.length > 0 ? (
                missionCards.map((mission, index) => (
                  <MissionCard key={index} {...mission} />
                ))
              ) : (
                <Card className="border shadow-sm">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Finalizează un test ca să deblochezi misiuni zilnice.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Clasament
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/leaderboard">Vezi tot</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((person) => (
                  <div
                    key={person.rank}
                    className={cn(
                      "flex items-center gap-3 rounded-xl p-3",
                      person.isCurrentUser ? "bg-primary/10" : "bg-muted/20"
                    )}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        person.rank === 1
                          ? "bg-yellow-500/20 text-yellow-600"
                          : person.rank === 2
                          ? "bg-gray-300/30 text-gray-600"
                          : person.rank === 3
                          ? "bg-amber-600/20 text-amber-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {person.rank}
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                      {person.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {person.name}
                        {person.isCurrentUser && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            (Tu)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">
                        {person.xp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow-sm bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                  <Award className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-card-foreground">
                    Pregătit pentru examen?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Încearcă o simulare completă cu timp și punctaj
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Flame className="h-4 w-4 text-warning" />
                  <span>{currentStreak} zile</span>
                </div>
                <Button asChild>
                  <Link href="/mock-exam">
                    Începe simularea
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
