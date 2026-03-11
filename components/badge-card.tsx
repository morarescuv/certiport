import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface BadgeCardProps {
  title: string
  description: string
  icon: LucideIcon
  isUnlocked: boolean
  progress?: number
  target?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

const rarityStyles = {
  common: {
    bg: "bg-muted",
    iconBg: "bg-muted-foreground/20",
    iconColor: "text-muted-foreground",
    border: "border-border",
  },
  rare: {
    bg: "bg-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    border: "border-primary/20",
  },
  epic: {
    bg: "bg-chart-5/5",
    iconBg: "bg-chart-5/20",
    iconColor: "text-chart-5",
    border: "border-chart-5/20",
  },
  legendary: {
    bg: "bg-warning/5",
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
    border: "border-warning/20",
  },
}

export function BadgeCard({
  title,
  description,
  icon: Icon,
  isUnlocked,
  progress = 0,
  target = 1,
  rarity,
}: BadgeCardProps) {
  const styles = isUnlocked ? rarityStyles[rarity] : rarityStyles.common
  const percentage = Math.min((progress / target) * 100, 100)

  return (
    <Card
      className={cn(
        "border transition-all",
        styles.border,
        isUnlocked ? styles.bg : "bg-card opacity-75"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              styles.iconBg
            )}
          >
            <Icon className={cn("h-6 w-6", styles.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-card-foreground truncate">
                {title}
              </h4>
              {isUnlocked && (
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded",
                    rarity === "legendary" && "bg-warning/20 text-warning",
                    rarity === "epic" && "bg-chart-5/20 text-chart-5",
                    rarity === "rare" && "bg-primary/20 text-primary",
                    rarity === "common" && "bg-muted text-muted-foreground"
                  )}
                >
                  {rarity}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            {!isUnlocked && (
              <div className="mt-2">
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary/50 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {progress} / {target}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
