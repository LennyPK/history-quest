"use client"

import { HistoricEvent } from "@/lib/types/event"
import { getAllEvents } from "@/lib/utils/events"
import { useRouter } from "next/navigation"
import { useState } from "react"
import EventItem from "./EventItem"

export default function EventsPage() {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<HistoricEvent | null>(null)
  const events = getAllEvents()

  const handleEventClick = (event: HistoricEvent) => {
    if (event.isFullyImplemented) {
      setSelectedEvent(event)
      console.log("Navigating to event:", event.name)
      router.push(`/events/${event.id}`)
    }
  }

  const fullyImplementedCount = events.filter((e) => e.isFullyImplemented).length
  const totalCount = events.length

  return (
    <div className="container mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Historic Events</h1>

        <p className="mb-2 text-lg text-gray-600">
          Explore pivotal moments in history through interactive experiences.
        </p>
        <p className="text-sm text-gray-500">
          {fullyImplementedCount} of {totalCount} events available to play
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <EventItem key={event.id} event={event} onClick={handleEventClick} />
        ))}
      </div>
    </div>
  )
}
