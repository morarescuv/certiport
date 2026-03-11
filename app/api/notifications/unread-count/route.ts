import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUnreadNotificationsCount } from "@/lib/database"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const count = await getUnreadNotificationsCount(user.id)
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return NextResponse.json({ error: "Failed to fetch unread count" }, { status: 500 })
  }
}
