import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface MissionCardProps {
  title: string
  description: string
  xpReward: number
  progress: number
  target: number
  isCompleted: boolean
}

export function MissionCard({
  title,
  description,
  xpReward,
  progress,
  target,
  isCompleted,
}: MissionCardProps) {
  const percentage = Math.min((progress / target) * 100, 100)

  return (
    <Card
      className={cn(
        "border transition-all",
        isCompleted
          ? "border-success/30 bg-success/5"
          : "border-border hover:border-primary/30"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isCompleted ? "bg-success/20" : "bg-muted"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium text-card-foreground">{title}</h4>
              <div className="flex items-center gap-1 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-primary">+{xpReward} XP</span>
              </div>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            {!isCompleted && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {progress} / {target}
                  </span>
                  <span className="text-card-foreground">{Math.round(percentage)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
