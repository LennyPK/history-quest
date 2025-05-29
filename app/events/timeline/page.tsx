"use client"

import eventsData from "@/lib/data/eventdata.json"
import { HistoricEvent } from "@/lib/types/event"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function TimelinePage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get("id")
  const [event, setEvent] = useState<HistoricEvent | null>(null)

  useEffect(() => {
    if (eventId) {
      const foundEvent = eventsData.find((e) => e.id === eventId) as HistoricEvent
      setEvent(foundEvent)
    }
  }, [eventId])

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Loading event...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">{event.name} Timeline</h1>
      <p className="mb-6 text-lg text-gray-600">{event.blurb}</p>

      {/* Your timeline component content goes here */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p>Timeline content for {event.name} will be displayed here.</p>
      </div>
    </div>
  )
}
