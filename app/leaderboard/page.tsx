import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getLeaderboard, getSchoolLeaderboard, getUserStats, getUserSelectedExamSlugs } from "@/lib/database"
import { LeaderboardClient } from "./leaderboard-client"

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  // Fetch all leaderboard data
  const [globalData, schoolData, userStats] = await Promise.all([
    getLeaderboard("all"),
    getSchoolLeaderboard(),
    getUserStats(user.id),
  ])

  // Map global leaderboard
  const globalLeaderboard = globalData.map((profile, index) => ({
    rank: index + 1,
    id: profile.id,
    name: profile.display_name || "Anonymous",
    xp: profile.total_xp,
    level: Math.floor(profile.total_xp / 500) + 1,
    change: 0, // Would need historical data to calculate
    avatar: (profile.display_name || "A").slice(0, 2).toUpperCase(),
    isCurrentUser: profile.id === user.id,
    schoolName: (() => {
      const school = (profile as unknown as { school?: unknown }).school
      if (!school) return null
      if (Array.isArray(school)) return (school[0] as { name?: string } | undefined)?.name || null
      return (school as { name?: string }).name || null
    })(),
  }))

  // Map school leaderboard
  const schoolLeaderboard = schoolData.map((item, index) => ({
    rank: index + 1,
    name: item.school.name,
    city: item.school.city,
    country: item.school.country,
    totalXp: item.totalXp,
    memberCount: item.memberCount,
    avgXp: Math.round(item.totalXp / item.memberCount),
    isUserSchool: item.school.id === userStats.profile?.school_id,
  }))

  // Calculate user's rank
  const userGlobalRank = globalLeaderboard.findIndex(p => p.isCurrentUser) + 1
  const userSchoolRank = schoolLeaderboard.findIndex(s => s.isUserSchool) + 1

  return (
    <LeaderboardClient
      globalLeaderboard={globalLeaderboard}
      schoolLeaderboard={schoolLeaderboard}
      userGlobalRank={userGlobalRank || globalLeaderboard.length + 1}
      userSchoolRank={userSchoolRank || 0}
      userXp={userStats.profile?.total_xp || 0}
      userSchoolName={userStats.profile?.school?.name || null}
    />
  )
}
