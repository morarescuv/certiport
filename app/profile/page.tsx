import { DashboardLayout } from "@/components/dashboard-layout"
import { BadgeCard } from "@/components/badge-card"
import { StreakCalendar } from "@/components/streak-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Zap,
  Trophy,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Settings,
} from "lucide-react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfileAnalytics, getUserSelectedExamSlugs } from "@/lib/database"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  const analytics = await getProfileAnalytics(user.id)
  const profile = analytics.profile
  const displayName = profile?.display_name || user.email?.split("@")[0] || "Utilizator"
  const email = user.email || ""
  const totalXp = profile?.total_xp || 0
  const level = Math.floor(totalXp / 500) + 1

  const activeDays = analytics.activityDates
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()))

  const badges = analytics.badges.map((ub) => ({
    title: ub.badge?.name || "Insignă",
    description: ub.badge?.description || "",
    icon: Award,
    isUnlocked: true,
    rarity: (ub.badge?.rarity || "common") as "common" | "rare" | "epic" | "legendary",
  }))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-foreground">{displayName}</h1>
              <p className="text-muted-foreground">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary/10 text-primary border-0">
                  Nivel {level}
                </Badge>
                <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
                  <Flame className="h-3 w-3 mr-1" />
                  {analytics.currentStreak} zile
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/examenele-mele">Examenele mele</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/notifications">Notificări</Link>
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Editează profilul
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border shadow-sm bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-card-foreground">{totalXp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-card-foreground">{analytics.bestScorePercent}%</p>
                  <p className="text-xs text-muted-foreground">Cel mai bun scor</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-card-foreground">{analytics.quizzesCompleted}</p>
                  <p className="text-xs text-muted-foreground">Teste finalizate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-card-foreground">{analytics.accuracyPercent}%</p>
                  <p className="text-xs text-muted-foreground">Acuratețe</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="badges" className="space-y-4">
              <TabsList className="bg-muted">
                <TabsTrigger value="badges">Insigne</TabsTrigger>
                <TabsTrigger value="history">Istoric</TabsTrigger>
                <TabsTrigger value="stats">Statistici</TabsTrigger>
              </TabsList>

              <TabsContent value="badges" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {badges.length} insigne obținute
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {badges.length > 0 ? (
                    badges.map((badge, index) => <BadgeCard key={index} {...badge} />)
                  ) : (
                    <div className="py-10 text-center text-sm text-muted-foreground sm:col-span-2">
                      Încă nu ai insigne. Finalizează teste pentru a debloca.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card className="border shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {analytics.recentAttempts.length > 0 ? analytics.recentAttempts.map((attempt, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-card-foreground">
                                {(attempt.exam?.name || "Exam")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {attempt.completed_at
                                  ? new Date(attempt.completed_at).toLocaleDateString("ro-RO")
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p
                                className={`text-sm font-medium ${
                                  attempt.score >= 90
                                    ? "text-success"
                                    : attempt.score >= 70
                                    ? "text-card-foreground"
                                    : "text-warning"
                                }`}
                              >
                                {attempt.score}%
                              </p>
                              <p className="text-xs text-muted-foreground">Scor</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-primary">
                                +{attempt.xp_earned}
                              </p>
                              <p className="text-xs text-muted-foreground">XP</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          Nu ai sesiuni încă.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Performanță pe examen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analytics.examStats.length > 0 ? (
                      analytics.examStats.map((stat) => (
                        <div key={stat.examId} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-card-foreground">{stat.examName}</span>
                            <span className="text-muted-foreground">
                              {stat.accuracyPercent}% ({stat.attempts} sesiuni)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                stat.accuracyPercent >= 85
                                  ? "bg-success"
                                  : stat.accuracyPercent >= 70
                                  ? "bg-primary"
                                  : "bg-warning"
                              }`}
                              style={{ width: `${stat.accuracyPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Scor mediu: {stat.avgScorePercent}%</span>
                            <span>Maxim: {stat.bestScorePercent}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-sm text-muted-foreground">
                        Nu există date suficiente încă.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <StreakCalendar
              currentStreak={analytics.currentStreak}
              longestStreak={analytics.longestStreak}
              activeDays={activeDays}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
