export interface HistoricEvent {
    id: string;
    name: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    date: string;
    blurb: string;
    imageUrl: string;
    isFullyImplemented: boolean;
  }
  