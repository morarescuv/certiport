"use client"

import { useState } from "react"
import { QuizEngine } from "@/components/quiz-engine"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertCircle, FileText, Clock, ArrowRight, Target } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ExamCardData {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  difficulty: "Easy" | "Medium" | "Hard"
  categoryId: string
  questionCount: number
}

interface QuestionData {
  id: string
  question: string
  answers: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface PracticePageClientProps {
  exams: ExamCardData[]
  questions: QuestionData[]
  selectedExam: { id: string; title: string; timeLimit: number } | null
  mode: "practice" | "test" | null
  attemptId: string | null
  userId: string
}

export function PracticePageClient({
  exams,
  questions,
  selectedExam,
  mode,
  attemptId,
  userId,
}: PracticePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // If we have an exam selected and mode, show the quiz
  if (selectedExam && mode && questions.length > 0 && attemptId) {
    return (
      <QuizEngine
        examTitle={selectedExam.title}
        questions={questions}
        mode={mode}
        timeLimit={selectedExam.timeLimit}
        attemptId={attemptId}
        userId={userId}
      />
    )
  }

  const filteredExams = exams.filter((exam) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      q.length === 0 ||
      exam.title.toLowerCase().includes(q) ||
      exam.description.toLowerCase().includes(q)

    if (!matchesSearch) return false
    if (activeTab === "all") return true
    if (activeTab === "database") return exam.title.toLowerCase().includes("database")
    if (activeTab === "python") return exam.title.toLowerCase().includes("python")
    if (activeTab === "networking") return exam.title.toLowerCase().includes("network")
    return true
  })

  const difficultyLabel = (d: ExamCardData["difficulty"]) => {
    if (d === "Easy") return "Ușor"
    if (d === "Medium") return "Mediu"
    return "Greu"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Teste de practică</h1>
          <p className="mt-1 text-muted-foreground">
            Alege un examen și lucrează constant: sesiuni rapide (10 întrebări) sau teste complete.
          </p>
        </div>

        <Card className="border border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">Cum funcționează</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Alege un examen și pornește o sesiune de practică</li>
                  <li>Primești feedback și XP după finalizare</li>
                  <li>Repetă zilnic pentru progres și streak</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-primary/20 bg-background/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Caută examene..."
                  className="pl-9 bg-muted/60 border-0 h-10 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
                <TabsList className="w-full bg-muted/60">
                  <TabsTrigger value="all">Toate</TabsTrigger>
                  <TabsTrigger value="database">Database</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="networking">Networking</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <Card key={exam.id} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-medium truncate">{exam.title}</CardTitle>
                        <Badge variant="secondary" className="bg-muted">
                          {difficultyLabel(exam.difficulty)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {exam.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <FileText className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">{exam.questionCount}</p>
                      <p className="text-xs text-muted-foreground">Întrebări</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">{exam.duration}</p>
                      <p className="text-xs text-muted-foreground">Durată</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <Target className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-medium text-card-foreground">10</p>
                      <p className="text-xs text-muted-foreground">Sesiune rapidă</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/practice?exam=${exam.id}&mode=practice`}>
                        Practică (10)
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href={`/practice?exam=${exam.id}&mode=test`}>
                        Test complet
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border shadow-sm">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Nu am găsit examene care să se potrivească.
                </p>
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/examenele-mele">Gestionează examenele</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
