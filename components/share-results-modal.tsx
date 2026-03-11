"use client"

import { useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Target, Sparkles, Download, Share2 } from "lucide-react"
import { toPng } from "html-to-image"

interface ShareResultsModalProps {
  isOpen: boolean
  onClose: () => void
  examTitle: string
  correctCount: number
  totalQuestions: number
  accuracy: number
  xpEarned: number
}

export function ShareResultsModal({
  isOpen,
  onClose,
  examTitle,
  correctCount,
  totalQuestions,
  accuracy,
  xpEarned,
}: ShareResultsModalProps) {
  const resultCardRef = useRef<HTMLDivElement>(null)

  const generateImage = useCallback(async () => {
    if (resultCardRef.current === null) {
      return
    }

    try {
      const dataUrl = await toPng(resultCardRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement("a")
      link.download = `certiport-result-${examTitle.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate image:", err)
    }
  }, [examTitle])

  const getGrade = () => {
    if (accuracy >= 90) return { label: "Excellent!", color: "text-green-600", bg: "bg-green-100" }
    if (accuracy >= 80) return { label: "Great Job!", color: "text-blue-600", bg: "bg-blue-100" }
    if (accuracy >= 70) return { label: "Good Work", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { label: "Keep Practicing", color: "text-gray-600", bg: "bg-gray-100" }
  }

  const grade = getGrade()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share Your Results</DialogTitle>
        </DialogHeader>

        {/* Result Card - This will be converted to image */}
        <div ref={resultCardRef} className="bg-white p-6 rounded-xl">
          <Card className="border-2 border-primary/20 p-6 bg-gradient-to-br from-primary/5 to-background">
            <div className="text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full ${grade.bg} flex items-center justify-center`}>
                <Trophy className={`w-8 h-8 ${grade.color}`} />
              </div>

              <div>
                <h3 className={`text-xl font-bold ${grade.color}`}>{grade.label}</h3>
                <p className="text-muted-foreground text-sm mt-1">{examTitle}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Target className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-foreground">+{xpEarned}</p>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-foreground mb-1">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{correctCount}/{totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Certiport Practice Platform</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={generateImage} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          <Button variant="outline" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "My Certiport Results",
                text: `I scored ${accuracy}% on ${examTitle} and earned ${xpEarned} XP!`,
              })
            }
          }}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
