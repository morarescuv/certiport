import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getExams, getQuestions, createQuizAttempt, getUserSelectedExamSlugs } from "@/lib/database"
import { examRecordMatchesAllowedSlug } from "@/lib/exams"
import { PracticePageClient } from "./practice-client"

export default async function PracticePage(props: {
  searchParams: Promise<{ exam?: string; mode?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const selectedExamSlugs = await getUserSelectedExamSlugs(user.id)
  if (selectedExamSlugs.length === 0) {
    redirect("/onboarding")
  }

  const searchParams = await props.searchParams
  const examId = searchParams.exam
  const mode = searchParams.mode as "practice" | "test" | undefined

  // Fetch exams
  const exams = await getExams()

  const filteredExams = exams.filter((e) =>
    selectedExamSlugs.some((s) => examRecordMatchesAllowedSlug(e.slug, s))
  )

  // If starting a quiz, fetch questions and create attempt
  let questions: Awaited<ReturnType<typeof getQuestions>> = []
  let attemptId: string | null = null
  let selectedExam: typeof exams[0] | null = null

  if (examId && mode) {
    selectedExam = filteredExams.find(e => e.id === examId) || null
    if (selectedExam) {
      const limit = mode === "practice" ? 10 : undefined // Practice mode = 10 questions, test = all
      questions = await getQuestions(examId, limit)
      
      // Create a quiz attempt
      const attempt = await createQuizAttempt(user.id, examId, mode)
      attemptId = attempt.id
    }
  }

  // Map exams with progress (simplified - would normally calculate from user's attempts)
  const examCards = filteredExams.map(exam => ({
    id: exam.id,
    title: exam.name,
    description: exam.description || "",
    duration: `${exam.time_limit_minutes} min`,
    progress: 0,
    difficulty: exam.difficulty as "Easy" | "Medium" | "Hard",
    categoryId: exam.category_id,
    questionCount: exam.question_count || 0,
  }))

  // Map questions for quiz engine
  const quizQuestions = questions.map(q => {
    const correctAnswer = q.correct_answer

    return {
      id: q.id,
      question: q.question_text,
      answers: (q.options || []).map((opt: string, idx: number) => ({
        id: String.fromCharCode(97 + idx),
        text: opt,
        isCorrect: opt === correctAnswer,
      })),
      explanation: q.explanation || "",
      difficulty: (q.difficulty === "easy" ? "Easy" : q.difficulty === "hard" ? "Hard" : "Medium") as "Easy" | "Medium" | "Hard",
    }
  })

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PracticePageClient
        exams={examCards}
        questions={quizQuestions}
        selectedExam={selectedExam ? {
          id: selectedExam.id,
          title: selectedExam.name,
          timeLimit: selectedExam.time_limit_minutes * 60,
        } : null}
        mode={mode || null}
        attemptId={attemptId}
        userId={user.id}
      />
    </Suspense>
  )
}
