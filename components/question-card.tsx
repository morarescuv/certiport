"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, MessageSquare, ThumbsUp, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Answer {
  id: string
  text: string
  isCorrect?: boolean
}

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  question: string
  answers: Answer[]
  explanation?: string
  difficulty: "Easy" | "Medium" | "Hard"
  isPracticeMode: boolean
  onAnswer: (answerId: string, isCorrect: boolean) => void
  onNext: () => void
}

const difficultyColors = {
  Easy: "bg-success/10 text-success border-0",
  Medium: "bg-warning/10 text-warning border-0",
  Hard: "bg-destructive/10 text-destructive border-0",
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  answers,
  explanation,
  difficulty,
  isPracticeMode,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleSelectAnswer = (answerId: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(answerId)
    
    if (!isPracticeMode) {
      const answer = answers.find((a) => a.id === answerId)
      onAnswer(answerId, answer?.isCorrect || false)
    }
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return
    
    setIsAnswered(true)
    const answer = answers.find((a) => a.id === selectedAnswer)
    onAnswer(selectedAnswer, answer?.isCorrect || false)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setIsAnswered(false)
    onNext()
  }

  const correctAnswer = answers.find((a) => a.isCorrect)
  const isCorrectSelection = selectedAnswer && answers.find((a) => a.id === selectedAnswer)?.isCorrect

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Question {questionNumber} of {totalQuestions}
              </span>
              <Badge className={difficultyColors[difficulty]} variant="secondary">
                {difficulty}
              </Badge>
            </div>
            <div className="h-2 flex-1 max-w-32 rounded-full bg-muted ml-4">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-lg font-medium text-card-foreground leading-relaxed">
            {question}
          </h2>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.id
          const showResult = isAnswered && isPracticeMode
          const isCorrect = answer.isCorrect

          return (
            <button
              key={answer.id}
              onClick={() => handleSelectAnswer(answer.id)}
              disabled={isAnswered}
              className={cn(
                "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                !isAnswered && !isSelected && "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                !isAnswered && isSelected && "border-primary bg-primary/10",
                showResult && isCorrect && "border-success bg-success/10",
                showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all",
                  !isAnswered && !isSelected && "bg-muted text-muted-foreground",
                  !isAnswered && isSelected && "bg-primary text-primary-foreground",
                  showResult && isCorrect && "bg-success text-success-foreground",
                  showResult && isSelected && !isCorrect && "bg-destructive text-destructive-foreground"
                )}
              >
                {showResult && isCorrect ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : showResult && isSelected && !isCorrect ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span
                className={cn(
                  "flex-1 text-card-foreground",
                  showResult && isCorrect && "text-success font-medium",
                  showResult && isSelected && !isCorrect && "text-destructive"
                )}
              >
                {answer.text}
              </span>
            </button>
          )
        })}
      </div>

      {isAnswered && isPracticeMode && explanation && (
        <Card className={cn(
          "border",
          isCorrectSelection ? "border-success/30 bg-success/5" : "border-primary/30 bg-primary/5"
        )}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                isCorrectSelection ? "bg-success/20" : "bg-primary/20"
              )}>
                <Lightbulb className={cn(
                  "h-4 w-4",
                  isCorrectSelection ? "text-success" : "text-primary"
                )} />
              </div>
              <div>
                <p className={cn(
                  "text-sm font-medium mb-1",
                  isCorrectSelection ? "text-success" : "text-primary"
                )}>
                  {isCorrectSelection ? "Correct!" : "Explanation"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-1 h-4 w-4" />
            Discuss
          </Button>
          <Button variant="ghost" size="sm">
            <ThumbsUp className="mr-1 h-4 w-4" />
            Helpful
          </Button>
        </div>

        <div className="flex gap-2">
          {isPracticeMode && !isAnswered && (
            <Button onClick={handleSubmit} disabled={!selectedAnswer}>
              Check Answer
            </Button>
          )}
          {(isAnswered || !isPracticeMode) && (
            <Button onClick={handleNext}>
              {questionNumber === totalQuestions ? "Finish" : "Next Question"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
