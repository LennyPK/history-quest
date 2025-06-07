"use client"

import CommentsSheet from "@/components/comments_sheet"
import EventDetails from "@/components/event-details"
import MapComponent from "@/components/MapComponent"
import { ProgressBadge } from "@/components/progress-badge"
import Quiz from "@/components/quiz"
import SourceList from "@/components/source"
import { Timeline } from "@/components/timeline"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEventById } from "@/lib/utils/events"
import { ArrowLeft, BookOpen, Clock, Globe, HelpCircle, Newspaper, Trophy } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use, useEffect, useState } from "react"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventPage({ params }: EventPageProps) {
  const resolvedParams = use(params)
  const event = getEventById(resolvedParams.id)

  if (!event) {
    notFound()
  }

  const [activeTab, setActiveTab] = useState("timeline")
  const [tabProgress, setTabProgress] = useState<string[]>([])

  useEffect(() => {
    const eventId = event.id

    // Read from sessionStorage
    const stored = JSON.parse(sessionStorage.getItem("eventProgress") || "{}")
    const currentTabs = new Set<string>(stored[eventId]?.tabsViewed || [])

    // Always add "timeline" as the default viewed tab on load
    currentTabs.add("timeline")

    const updated = {
      ...stored,
      [eventId]: {
        ...(stored[eventId] || {}),
        tabsViewed: Array.from(currentTabs),
      },
    }
    sessionStorage.setItem("eventProgress", JSON.stringify(updated))
    setTabProgress(Array.from(currentTabs))
  }, [event.id])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const stored = JSON.parse(sessionStorage.getItem("eventProgress") || "{}")
    const eventId = event.id
    const currentTabs = new Set<string>(stored[eventId]?.tabsViewed || [])
    currentTabs.add(tab)

    const updatedProgress = {
      ...stored,
      [eventId]: {
        ...(stored[eventId] || {}),
        tabsViewed: Array.from(currentTabs),
      },
    }
    sessionStorage.setItem("eventProgress", JSON.stringify(updatedProgress))
    setTabProgress(Array.from(currentTabs))
  }

  const [quizStats, setQuizStats] = useState({ highestScore: 0, attempts: 0 })

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("eventProgress") || "{}")
    const eventStats = stored[event.id] || {}
    setQuizStats({
      highestScore: eventStats.maxScore || 0,
      attempts: eventStats.attempts || 0,
    })
  }, [event.id, activeTab])

  return (
    <div className="container mx-auto max-w-7xl p-8">
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
                <ProgressBadge score={quizStats.highestScore} maxScore={10} />
                <span className="text-muted-foreground text-xs">
                  {quizStats.attempts} {quizStats.attempts === 1 ? "attempt" : "attempts"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <p className="text-muted-foreground flex-1 text-xl">{event.blurb}</p>
          <div className="hidden lg:block">
            <CommentsSheet eventId={event.id} />
          </div>
        </div>
        <div className="mt-6 lg:hidden">
          <CommentsSheet eventId={event.id} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
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

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardContent>
              <Timeline events={event.timeline} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <Card>
            <CardContent className="pt-0">
              <div className="relative h-full w-full">
                <MapComponent eventId={event.id} setActiveTab={setActiveTab} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <EventDetails details={event.details} />
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          <SourceList sources={event.sources} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Quiz eventId={event.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
