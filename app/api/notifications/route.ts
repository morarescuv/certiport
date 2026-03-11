import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserNotifications, markNotificationsRead } from "@/lib/database"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications = await getUserNotifications(user.id)
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const ids = Array.isArray(body?.ids) ? body.ids.map((x: unknown) => String(x)) : []

    await markNotificationsRead(user.id, ids)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notifications read:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
