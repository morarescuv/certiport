import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserSelectedExamSlugs, setUserSelectedExamSlugs } from "@/lib/database"
import { isAllowedExamSlug, type AllowedExamSlug } from "@/lib/exams"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const slugs = await getUserSelectedExamSlugs(user.id)
    return NextResponse.json({ slugs })
  } catch (error) {
    console.error("Error fetching selected exams:", error)
    return NextResponse.json({ error: "Failed to fetch selected exams" }, { status: 500 })
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
    const raw = Array.isArray(body?.slugs) ? body.slugs : []

    const slugs = raw
      .map((s: unknown) => String(s))
      .filter(isAllowedExamSlug) as AllowedExamSlug[]

    await setUserSelectedExamSlugs(user.id, slugs)

    return NextResponse.json({ success: true, slugs })
  } catch (error) {
    console.error("Error saving selected exams:", error)
    return NextResponse.json({ error: "Failed to save selected exams" }, { status: 500 })
  }
}
