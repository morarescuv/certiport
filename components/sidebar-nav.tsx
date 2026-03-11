"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  User,
  Target,
  Flame,
  Award,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Panou principal", icon: LayoutDashboard },
  { href: "/practice", label: "Teste de practică", icon: BookOpen },
  { href: "/mock-exam", label: "Examen simulare", icon: Target },
  { href: "/leaderboard", label: "Clasament", icon: Trophy },
  { href: "/profile", label: "Profil", icon: User },
]

interface SidebarNavProps {
  userStats?: {
    xp: number
    level: number
    streak: number
    displayName: string
    email: string
  }
}

export function SidebarNav({ 
  userStats = { xp: 0, level: 1, streak: 0, displayName: "User", email: "" } 
}: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const xpForNextLevel = (userStats.level + 1) * 500
  const xpForCurrentLevel = userStats.level * 500
  const progressXp = userStats.xp - xpForCurrentLevel
  const neededXp = xpForNextLevel - xpForCurrentLevel
  const progressPercent = Math.min(100, Math.round((progressXp / neededXp) * 100))
  const xpLeft = xpForNextLevel - userStats.xp

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Award className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-medium text-sidebar-foreground">CertPrep</span>
      </div>

      <div className="mx-4 mt-4 rounded-xl bg-sidebar-accent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <span className="text-sm font-medium text-primary">{userStats.level}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Level {userStats.level}</p>
              <p className="text-xs text-muted-foreground">{userStats.xp.toLocaleString()} XP</p>
            </div>
          </div>
          {userStats.streak > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-warning/20 px-2 py-1">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium text-warning-foreground">{userStats.streak}</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress to Level {userStats.level + 1}</span>
            <span>{xpLeft} XP left</span>
          </div>
          <div className="h-2 rounded-full bg-sidebar-border">
            <div 
              className="h-2 rounded-full bg-primary transition-all" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <span className="text-sm font-medium text-primary">
              {userStats.displayName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {userStats.displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{userStats.email}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
