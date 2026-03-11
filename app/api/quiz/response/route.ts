import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { saveQuestionResponse } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { attemptId, questionId, selectedAnswer, isCorrect } = body

    await saveQuestionResponse(
      attemptId,
      questionId,
      selectedAnswer,
      isCorrect
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving response:", error)
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    )
  }
}
