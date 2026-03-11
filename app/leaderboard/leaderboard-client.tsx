"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  Medal,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface LeaderboardUser {
  rank: number
  id: string
  name: string
  xp: number
  level: number
  change: number
  avatar: string
  isCurrentUser: boolean
  schoolName: string | null
}

interface SchoolRanking {
  rank: number
  name: string
  city: string | null
  country: string | null
  totalXp: number
  memberCount: number
  avgXp: number
  isUserSchool: boolean
}

interface LeaderboardClientProps {
  globalLeaderboard: LeaderboardUser[]
  schoolLeaderboard: SchoolRanking[]
  userGlobalRank: number
  userSchoolRank: number
  userXp: number
  userSchoolName: string | null
}

function UserLeaderboardTable({ data }: { data: LeaderboardUser[] }) {
  return (
    <div className="space-y-2">
      {data.map((user) => {
        const isTop3 = user.rank <= 3

        return (
          <Link
            key={user.id}
            href={`/u/${user.id}`}
            className={cn(
              "flex items-center gap-4 rounded-2xl p-4 transition-all",
              user.isCurrentUser && "bg-primary/10 ring-1 ring-primary/20",
              !user.isCurrentUser && "bg-card hover:bg-muted/40"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium",
                user.rank === 1 && "bg-yellow-500/20 text-yellow-600",
                user.rank === 2 && "bg-gray-300/30 text-gray-600",
                user.rank === 3 && "bg-amber-600/20 text-amber-700",
                user.rank > 3 && "bg-muted text-muted-foreground"
              )}
            >
              {isTop3 ? <Trophy className="h-5 w-5" /> : user.rank}
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-card-foreground truncate">
                  {user.name}
                </p>
                {user.isCurrentUser && (
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    Tu
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Nivel {user.level}</p>
                {user.schoolName && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <p className="text-sm text-muted-foreground truncate">{user.schoolName}</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 text-sm">
                {user.change > 0 && (
                  <>
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-success">+{user.change}</span>
                  </>
                )}
                {user.change < 0 && (
                  <>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">{user.change}</span>
                  </>
                )}
                {user.change === 0 && (
                  <>
                    <Minus className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">0</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 min-w-[80px] justify-end">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium text-card-foreground">
                  {user.xp.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function SchoolLeaderboardTable({ data }: { data: SchoolRanking[] }) {
  return (
    <div className="space-y-2">
      {data.map((school) => {
        const isTop3 = school.rank <= 3

        return (
          <div
            key={school.rank}
            className={cn(
              "flex items-center gap-4 rounded-2xl p-4 transition-all",
              school.isUserSchool && "bg-primary/10 ring-1 ring-primary/20",
              !school.isUserSchool && "bg-card hover:bg-muted/40"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium",
                school.rank === 1 && "bg-yellow-500/20 text-yellow-600",
                school.rank === 2 && "bg-gray-300/30 text-gray-600",
                school.rank === 3 && "bg-amber-600/20 text-amber-700",
                school.rank > 3 && "bg-muted text-muted-foreground"
              )}
            >
              {isTop3 ? <Trophy className="h-5 w-5" /> : school.rank}
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-card-foreground truncate">
                  {school.name}
                </p>
                {school.isUserSchool && (
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    Școala ta
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {school.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {school.city}
                    {school.country && `, ${school.country}`}
                  </span>
                )}
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {school.memberCount} membri
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium text-card-foreground">
                  {school.totalXp.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Medie: {school.avgXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function LeaderboardClient({
  globalLeaderboard,
  schoolLeaderboard,
  userGlobalRank,
  userSchoolRank,
  userXp,
  userSchoolName,
}: LeaderboardClientProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="border border-primary/20 bg-background/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Clasament</p>
                <h1 className="mt-1 text-2xl font-medium text-foreground">
                  Compară progresul și urcă în top
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Câștigă XP din teste și rămâi consecvent ca să avansezi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/practice">Începe practica</Link>
                </Button>
                <Button className="w-full" variant="outline" disabled>
                  <Users className="mr-2 h-4 w-4" />
                  Invită prieteni
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border border-border/60 bg-background/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/15">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Poziția ta globală</p>
                  <p className="mt-1 text-3xl font-medium text-card-foreground leading-none">
                    #{userGlobalRank}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/60 bg-background/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Poziția școlii</p>
                  <p className="mt-1 text-3xl font-medium text-card-foreground leading-none">
                    {userSchoolRank > 0 ? `#${userSchoolRank}` : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/60 bg-background/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15">
                  <Zap className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">XP total</p>
                  <p className="mt-1 text-3xl font-medium text-card-foreground leading-none">
                    {userXp.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-0">
            <Tabs defaultValue="global" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="bg-muted/60">
                  <TabsTrigger value="global">
                    <Trophy className="mr-2 h-4 w-4" />
                    Global
                  </TabsTrigger>
                  <TabsTrigger value="schools">
                    <Building2 className="mr-2 h-4 w-4" />
                    Școli
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="global" className="m-0">
                <CardContent className="pt-4 px-0 pb-0">
                  {globalLeaderboard.length > 0 ? (
                    <UserLeaderboardTable data={globalLeaderboard} />
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      Încă nu există clasament. Fii primul care câștigă XP!
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="schools" className="m-0">
                <CardContent className="pt-4 px-0 pb-0">
                  {schoolLeaderboard.length > 0 ? (
                    <SchoolLeaderboardTable data={schoolLeaderboard} />
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      Încă nu există clasament pe școli. Școlile au nevoie de membri cu XP ca să apară aici.
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        <Card className="border border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Motivație</p>
                  <h3 className="mt-1 text-lg font-medium text-card-foreground">Urcă în clasament</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Completează teste, câștigă XP și urmărește progresul.
                    {userSchoolName && ` Ajută ${userSchoolName} să urce în clasament.`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                <Badge className="bg-success/10 text-success border-0 justify-center">
                  {userXp.toLocaleString()} XP
                </Badge>
                <Button asChild>
                  <Link href="/practice">Începe practica</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
