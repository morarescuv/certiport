"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type NotificationItem = {
  id: string
  type: string
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export function NotificationsClient({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[]
}) {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications)
  const unreadIds = useMemo(() => items.filter((n) => !n.is_read).map((n) => n.id), [items])

  async function markAllRead() {
    if (unreadIds.length === 0) return

    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: unreadIds }),
    })

    if (!res.ok) return

    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Notificări</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mementouri, progres și realizări.</p>
        </div>
        <Button variant="outline" onClick={markAllRead} disabled={unreadIds.length === 0}>
          Marchează tot ca citit
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Nu ai notificări încă.</div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "rounded-xl border border-border p-4",
                  !n.is_read ? "bg-primary/5" : "bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  {!n.is_read && (
                    <Badge className="bg-primary/10 text-primary border-0 shrink-0">Nou</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
