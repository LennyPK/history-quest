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
}

export interface Source {
  url: string
  title: string
  author: string
}

export interface TimelineEvent {
  date: string
  heading: string
  text: string
  place: string
}
