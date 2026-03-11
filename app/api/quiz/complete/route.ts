import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { completeQuizAttempt, updateMissionProgress } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { attemptId, score, totalQuestions, correctAnswers } = body

    // Complete the quiz attempt and update XP
    const result = await completeQuizAttempt(
      attemptId,
      score,
      totalQuestions,
      correctAnswers
    )

    // Update mission progress
    await updateMissionProgress(user.id, "complete_quiz", 1)
    await updateMissionProgress(user.id, "answer_questions", correctAnswers)
    
    if (score === 100) {
      await updateMissionProgress(user.id, "perfect_score", 1)
    }

    return NextResponse.json({
      success: true,
      xpEarned: result.xpEarned,
      attempt: result.attempt,
    })
  } catch (error) {
    console.error("Error completing quiz:", error)
    return NextResponse.json(
      { error: "Failed to complete quiz" },
      { status: 500 }
    )
  }
}
