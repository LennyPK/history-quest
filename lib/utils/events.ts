import eventsData from "@/lib/data/events.json"
import { HistoricEvent } from "@/lib/types/event"

// Type assertion to ensure the data matches our type
const events = eventsData.events as HistoricEvent[]

export function getAllEvents(): HistoricEvent[] {
  return events
}

export function getEventById(id: string): HistoricEvent | undefined {
  return events.find((event) => event.id === id)
}

export function getImplementedEvents(): HistoricEvent[] {
  return events.filter((event) => event.isFullyImplemented)
}

export function getEventsByDifficulty(difficulty: HistoricEvent["difficulty"]): HistoricEvent[] {
  return events.filter((event) => event.difficulty === difficulty)
}
