"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"

async function fetchUnreadCount() {
  const res = await fetch("/api/notifications/unread-count")
  if (!res.ok) return { count: 0 }
  return (await res.json()) as { count: number }
}

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const { data: unread } = useSWR("unread-notifications", fetchUnreadCount, {
    revalidateOnFocus: true,
  })

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b border-border bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută examene, întrebări..."
            className="pl-9 bg-muted/70 border-0 h-10 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Schimbă tema</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            {(unread?.count || 0) > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            )}
            <span className="sr-only">Notificări</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
