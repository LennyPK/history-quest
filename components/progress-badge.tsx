import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface ProgressBadgeProps {
  score: number | null
  maxScore?: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function ProgressBadge({
  score,
  maxScore = 10,
  size = "md",
  showText = true,
  className,
}: ProgressBadgeProps) {
  if (score === null) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <span className="text-muted-foreground text-xs italic">Not attempted yet</span>
      </div>
    )
  }

  // Calculate stars (rounded to nearest 0.5)
  const normalizedScore = (score / maxScore) * 5
  const fullStars = Math.floor(normalizedScore)
  const hasHalfStar = normalizedScore - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  // Size classes
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const starSize = sizeClasses[size]
  const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={cn(starSize, "fill-yellow-500 text-yellow-500")} />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(starSize, "text-muted")} />
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star className={cn(starSize, "fill-yellow-500 text-yellow-500")} />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn(starSize, "text-muted")} />
        ))}
      </div>

      {showText && (
        <span className={cn("font-medium", textSize)}>
          {score}/{maxScore}
        </span>
      )}
    </div>
  )
}
