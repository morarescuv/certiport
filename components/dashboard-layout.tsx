"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

interface DashboardLayoutProps {
  children: React.ReactNode
}

async function fetchUserStats() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  
  return {
    xp: profile?.total_xp || 0,
    level: Math.floor((profile?.total_xp || 0) / 500) + 1,
    streak: profile?.current_streak || 0,
    displayName: profile?.display_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
  }
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: userStats } = useSWR("user-stats", fetchUserStats, {
    revalidateOnFocus: false,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <SidebarNav userStats={userStats || undefined} />
      </div>

      <div className="md:pl-64">
        <Header />
        <main className="px-4 pt-4 pb-28 md:p-6 md:pb-6">{children}</main>
      </div>

      <BottomNav />
    </div>
  )
}
