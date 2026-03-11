"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Trophy,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Home,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { ShareResultsModal } from "@/components/share-results-modal"

interface QuizResultsProps {
  examTitle: string
  correctCount: number
  totalQuestions: number
  accuracy: number
  timeSpent: number
  xpEarned: number
  isLoading?: boolean
}

export function QuizResults({
  examTitle,
  correctCount,
  totalQuestions,
  accuracy,
  timeSpent,
  xpEarned,
  isLoading = false,
}: QuizResultsProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Spinner className="mx-auto h-8 w-8 mb-4" />
          <p className="text-muted-foreground">Saving your results...</p>
        </div>
      </div>
    )
  }
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getGrade = () => {
    if (accuracy >= 90) return { label: "Excellent!", color: "text-success", bg: "bg-success/10" }
    if (accuracy >= 80) return { label: "Great Job!", color: "text-primary", bg: "bg-primary/10" }
    if (accuracy >= 70) return { label: "Good Work", color: "text-warning", bg: "bg-warning/10" }
    return { label: "Keep Practicing", color: "text-muted-foreground", bg: "bg-muted" }
  }

  const grade = getGrade()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${grade.bg}`}>
            <Trophy className={`h-10 w-10 ${grade.color}`} />
          </div>
          <h1 className={`text-2xl font-medium ${grade.color}`}>{grade.label}</h1>
          <p className="mt-2 text-muted-foreground">{examTitle}</p>
        </div>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <Target className="mx-auto h-6 w-6 text-primary mb-2" />
                <p className="text-2xl font-medium text-card-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="rounded-xl bg-success/10 p-4 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-success mb-2" />
                <p className="text-2xl font-medium text-card-foreground">+{xpEarned}</p>
                <p className="text-xs text-muted-foreground">XP Earned</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Questions Correct</span>
                <span className="text-sm font-medium text-card-foreground">
                  {correctCount} / {totalQuestions}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Time Spent</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">
                    {formatTime(timeSpent)}
                  </span>
                </div>
              </div>
            </div>

            {accuracy >= 80 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge className="bg-success/10 text-success border-0">
                  New Badge Unlocked: Quiz Master
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" asChild>
            <Link href="/practice">
              Continue Practicing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowShareModal(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
          </div>
          <Button variant="ghost" size="lg" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Same Quiz
          </Button>
        </div>

        <ShareResultsModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          examTitle={examTitle}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          accuracy={accuracy}
          xpEarned={xpEarned}
        />
      </div>
    </div>
  )
}
