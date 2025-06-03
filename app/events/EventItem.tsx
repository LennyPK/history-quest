import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HistoricEvent } from "@/lib/types/event"
import { Lock, Star } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface EventItemProps {
  event: HistoricEvent
  onClick?: (event: HistoricEvent) => void
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const [isUnlocked, setIsUnlocked] = useState(event.isFullyImplemented)

  useEffect(() => {
  
    const completedEvents = ["world-war-two"] // Example of completed events, replace with actual logic to fetch completed events
    if (event.id === "french-revolution" && completedEvents.includes("world-war-two")) {
      setIsUnlocked(true)
    }
  }, [event.id])

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 ${
          index < difficulty ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isUnlocked && onClick) {
      console.log("Event clicked:", event.name)
      onClick(event)
    }
  }

  return (
    <div onClick={handleClick}>
      <Card
        className={`h-80 w-64 overflow-hidden p-0 transition-all duration-200 ${
          isUnlocked
            ? "cursor-pointer hover:scale-105 hover:shadow-lg"
            : "cursor-not-allowed opacity-75"
        }`}
      >
        <div className="h-35 relative w-full">
          {isUnlocked ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <Lock className="h-10 w-10 text-gray-400" />
            </div>
          )}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        <CardContent className="-mt-4 flex h-40 flex-col justify-between px-4 pt-0">
          <div>
            <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{event.name}</h3>
            <p className="mb-2 text-xs text-gray-500">{event.date}</p>
            <p className="mb-1 line-clamp-3 text-sm text-gray-600">{event.blurb}</p>
          </div>

          <div className="-mt-8 flex items-center justify-between">
            <div className="-mt-4 flex items-center gap-1">
              <span className="mr-1 text-xs text-gray-500">Difficulty:</span>
              {getDifficultyStars(event.difficulty)}
            </div>
            {!isUnlocked && (
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EventItem
