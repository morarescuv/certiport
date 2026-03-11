import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ExamCardProps {
  id: string
  title: string
  description: string
  questionCount: number
  duration: string
  progress: number
  difficulty: "Easy" | "Medium" | "Hard"
  iconBg?: string
}

const difficultyColors = {
  Easy: "bg-success/10 text-success border-0",
  Medium: "bg-warning/10 text-warning border-0",
  Hard: "bg-destructive/10 text-destructive border-0",
}

export function ExamCard({
  id,
  title,
  description,
  questionCount,
  duration,
  progress,
  difficulty,
  iconBg = "bg-primary/10",
}: ExamCardProps) {
  return (
    <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
          >
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-card-foreground truncate">{title}</h3>
              <Badge className={difficultyColors[difficulty]} variant="secondary">
                {difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {questionCount} întrebări
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {duration}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progres</span>
                <span className="font-medium text-card-foreground">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/practice?exam=${id}&mode=practice`}>Practică</Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/practice?exam=${id}&mode=test`}>
              Începe testul
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
