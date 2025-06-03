"use client"

import CommentsSheet from "@/components/comments_sheet"
import { ProgressBadge } from "@/components/progress-badge"
import Quiz from "@/components/quiz"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEventById } from "@/lib/utils/events"
import { ArrowLeft, BookOpen, Clock, Globe, HelpCircle, Newspaper, Trophy } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const [activeTab, setActiveTab] = useState("timeline")
  // const [currentScore, setCurrentScore] = useState<number | null>(null)
  // const [highestScore, setHighestScore] = useState<number | null>(null)
  // const [attempts, setAttempts] = useState(0)
  // const [showNewHighScore, setShowNewHighScore] = useState(false)

  const event = getEventById(params.id)

  if (!event) {
    notFound()
  }

  // Mock data for now - in a real app, this would come from a database
  const highestScore = 8
  const attempts = 3

  return (
    <div>
      <div className="mb-6">
        <Link href="/events" className="text-primary mb-4 inline-flex items-center hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
        <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-row gap-5">
            <h1 className="text-4xl font-bold">{event.name}</h1>

            <span className="text-muted-foreground text-s flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {event.date}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Highest Score:</span>
                <ProgressBadge score={highestScore} maxScore={10} />
              </div>
              <span className="text-muted-foreground text-xs">{attempts} attempts</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <p className="text-muted-foreground flex-1 text-xl">{event.blurb}</p>
          <div className="hidden lg:block">
            <CommentsSheet eventId="global-conflict" />
          </div>
        </div>
        <div className="mt-6 lg:hidden">
          <CommentsSheet eventId="global-conflict" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-5 md:w-auto">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">Sources</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>

        {/* Timeline Component*/}
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <span>Timeline goes here</span>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map Component*/}
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <span>Map goes here</span>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Component*/}
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <span>Details go here</span>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources Component*/}
        <TabsContent value="sources" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <span>Sources go here</span>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Component*/}
        <TabsContent value="quiz" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Quiz />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
