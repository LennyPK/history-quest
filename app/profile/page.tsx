"use client"

import { ProgressBadge } from "@/components/progress-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getEventById } from "@/lib/utils/events"
import { Trophy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const [points, setPoints] = useState<number>(0)
  const [progressData, setProgressData] = useState<Record<string, { tabsViewed: string[]; maxScore?: number; attempts?: number }>>({})
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPoints = sessionStorage.getItem("userPoints")
      setPoints(Number(storedPoints) || 0)

      const storedProgress = sessionStorage.getItem("eventProgress")
      if (storedProgress) {
        setProgressData(JSON.parse(storedProgress))
      }
    }
  }, [])

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">Your Profile</h1>
      <p className="mb-8 text-gray-600">Welcome back, History Explorer!</p>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img src="/pfp.svg" alt="Your avatar" className="h-16 w-16 rounded-full bg-gray-300" />
          <div>
            <h2 className="text-xl font-semibold">History Explorer</h2>
            <p className="text-sm text-gray-500">NCEA Student</p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Your Score</h3>
          <p className="text-2xl font-bold text-blue-600">{points} points</p>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Progress</h3>
          {Object.entries(progressData).length === 0 ? (
            <p className="text-sm text-gray-500">No progress yet.</p>
          ) : (
            Object.entries(progressData).map(([eventId, eventData]) => { 
              const eventMeta = getEventById(eventId);
              const { tabsViewed = [], maxScore = 0, attempts = 0 } = eventData;

              return (
                <Link
                  key={eventId}
                  href={`/events/${eventId}`}
                  className="block"
                >
                  <Card className="mb-5 transition-shadow hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="flex gap-4 p-2 items-center">
                      <img
                        src={eventMeta?.imageUrl}
                        alt={eventMeta?.name || eventId.replace(/-/g, " ")}
                        className="h-25 w-25 rounded-md object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium capitalize text-gray-800 text-lg truncate">
                          {eventMeta?.name || eventId.replace(/-/g, " ")}
                        </h4>
                        <Progress value={(tabsViewed.length / 5) * 100} className="my-1" />
                        <p className="text-xs text-gray-500 mb-1">
                          {tabsViewed.length} of 5 tabs completed
                        </p>
                        {typeof maxScore === "number" && (
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm font-medium">Highest Score:</span>
                            <ProgressBadge score={maxScore} maxScore={10} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>

              )
              
            })
          )}
        </div>


      </div>
    </div>
  )
}
