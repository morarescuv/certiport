"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Trophy,
  User,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Panou principal", icon: LayoutDashboard },
  { href: "/practice", label: "Teste de practică", icon: BookOpen },
  { href: "/mock-exam", label: "Examen simulare", icon: Target },
  { href: "/leaderboard", label: "Clasament", icon: Trophy },
  { href: "/profile", label: "Profil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex h-9 w-12 items-center justify-center rounded-2xl transition-colors",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              </div>
              <span className={cn("leading-none", isActive && "font-medium")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
