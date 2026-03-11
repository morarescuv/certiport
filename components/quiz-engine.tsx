"use client"

import { useState, useEffect, useCallback } from "react"
import { QuestionCard } from "@/components/question-card"
import { QuizResults } from "@/components/quiz-results"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Pause, Play, X } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  answers: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface QuizEngineProps {
  examTitle: string
  questions: Question[]
  mode: "practice" | "test"
  timeLimit?: number
  attemptId?: string
  userId?: string
}

export function QuizEngine({
  examTitle,
  questions,
  mode,
  timeLimit = 50 * 60,
  attemptId,
  userId,
}: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { answerId: string; isCorrect: boolean }>>({})
  const [timeRemaining, setTimeRemaining] = useState(mode === "test" ? timeLimit : 0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [xpEarned, setXpEarned] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isTestMode = mode === "test"

  const handleComplete = useCallback(async () => {
    setIsComplete(true)
    setIsSaving(true)

    const correctCount = Object.values(answers).filter((a) => a.isCorrect).length
    const totalAnswered = Object.keys(answers).length
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

    // Save to database if we have an attemptId
    if (attemptId) {
      try {
        const response = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId,
            score: accuracy,
            totalQuestions: questions.length,
            correctAnswers: correctCount,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setXpEarned(data.xpEarned || 0)
        }
      } catch (error) {
        console.error("Failed to save quiz results:", error)
      }
    } else {
      // Calculate XP locally if no attemptId
      setXpEarned(correctCount * 5 + 10 + (accuracy >= 90 ? 50 : accuracy >= 80 ? 25 : 0))
    }

    setIsSaving(false)
  }, [answers, attemptId, questions.length, startTime])

  useEffect(() => {
    if (!isTestMode || isPaused || isComplete) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestMode, isPaused, isComplete, handleComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = async (answerId: string, isCorrect: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { answerId, isCorrect },
    }))

    // Save individual response to database
    if (attemptId && currentQuestion) {
      try {
        await fetch("/api/quiz/response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId,
            questionId: currentQuestion.id,
            selectedAnswer: currentQuestion.answers.findIndex(a => a.id === answerId),
            isCorrect,
          }),
        })
      } catch (error) {
        console.error("Failed to save response:", error)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length
  const totalAnswered = Object.keys(answers).length

  if (isComplete) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

    return (
      <QuizResults
        examTitle={examTitle}
        correctCount={correctCount}
        totalQuestions={questions.length}
        accuracy={accuracy}
        timeSpent={timeSpent}
        xpEarned={xpEarned}
        isLoading={isSaving}
      />
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border shadow-sm max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No questions available for this exam yet.
            </p>
            <Button asChild>
              <Link href="/practice">Back to Practice</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/practice">
                <X className="h-5 w-5" />
                <span className="sr-only">Exit quiz</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-sm font-medium text-foreground">{examTitle}</h1>
              <p className="text-xs text-muted-foreground">
                {mode === "practice" ? "Practice Mode" : "Test Mode"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isTestMode && (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={`text-sm font-medium ${
                      timeRemaining < 300 ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  <span className="sr-only">{isPaused ? "Resume" : "Pause"}</span>
                </Button>
              </>
            )}

            <Badge variant="secondary" className="bg-muted">
              {totalAnswered} / {questions.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {isPaused ? (
          <Card className="border shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Pause className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium text-card-foreground mb-2">
                Quiz Paused
              </h2>
              <p className="text-muted-foreground mb-6">
                Take your time. Click resume when ready.
              </p>
              <Button onClick={() => setIsPaused(false)}>
                <Play className="mr-2 h-4 w-4" />
                Resume Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            question={currentQuestion.question}
            answers={currentQuestion.answers}
            explanation={currentQuestion.explanation}
            difficulty={currentQuestion.difficulty}
            isPracticeMode={mode === "practice"}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </main>
    </div>
  )
}
