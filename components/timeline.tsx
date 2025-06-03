"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TimelineEvent } from "@/lib/types/event"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0)
  const selectedEvent = events[selectedEventIndex]

  const handlePrevious = () => {
    setSelectedEventIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setSelectedEventIndex((prev) => (prev < events.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={selectedEventIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous event</span>
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-medium">{selectedEvent.heading}</h3>
            <p className="text-muted-foreground text-sm">{selectedEvent.date}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={selectedEventIndex === events.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next event</span>
          </Button>
        </div>

        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.heading}
                width={0}
                height={600}
                sizes="100vw"
                className="h-[500px] w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p>{selectedEvent.text}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative pt-6">
        <div className="bg-muted absolute left-0 right-0 top-0 h-1"></div>
        <div
          className="bg-primary absolute left-0 top-0 h-1 transition-all duration-500 ease-in-out"
          style={{ width: `${(selectedEventIndex / (events.length - 1)) * 100}%` }}
        ></div>
        <div className="flex justify-between">
          {events.map((event, index) => (
            <button
              key={index}
              className={`relative -mt-1.5 h-4 w-4 rounded-full ${
                index <= selectedEventIndex ? "bg-primary" : "bg-muted"
              }`}
              onClick={() => setSelectedEventIndex(index)}
            >
              <span className="sr-only">{event.text}</span>
              {index === selectedEventIndex && (
                <span className="bg-primary absolute inset-0 animate-ping rounded-full opacity-75"></span>
              )}
            </button>
          ))}
        </div>
        <div className="text-muted-foreground mt-2 flex justify-between text-xs">
          <span>{events[0].date}</span>
          <span>{events[events.length - 1].date}</span>
        </div>
      </div>
    </div>
  )
}
