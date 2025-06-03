export interface HistoricEvent {
  id: string
  name: string
  difficulty: 1 | 2 | 3 | 4 | 5
  date: string
  blurb: string
  imageUrl: string
  isFullyImplemented: boolean
  sources: Source[]
  timeline: TimelineEvent[]
  details: Details[]
}

export type SourceType = "journal" | "newspaper" | "book" | "website" | "video" | "other"

export interface Source {
  url: string
  title: string
  author: string
  type: SourceType
}

export interface TimelineEvent {
  date: string
  heading: string
  text: string
  image: string
  place: string
}

export interface EventDetailItem {
  title?: string
  text?: string
  name?: string
  role?: string
}

export interface Details {
  majorEventImage: string
  imageCaption: string
  causes: EventDetailItem[]
  "major-events": EventDetailItem[]
  "key-participants": EventDetailItem[]
  outcomes: EventDetailItem[]
}
