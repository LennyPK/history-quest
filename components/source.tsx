import { Card, CardContent } from "@/components/ui/card"
import { Source, SourceType } from "@/lib/types/event"
import { Book, ExternalLink, FileText, Globe, Newspaper, Video } from "lucide-react"

interface SourceListProps {
  sources: Source[]
}

const sourceTypeIcons: Record<SourceType, typeof Book> = {
  journal: FileText,
  newspaper: Newspaper,
  book: Book,
  website: Globe,
  video: Video,
  other: FileText,
}

export default function SourceList({ sources }: SourceListProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Sources</h3>
        <ul className="space-y-4">
          {sources.map((source, idx) => {
            const TypeIcon = sourceTypeIcons[source.type]
            return (
              <li
                key={idx}
                className="group rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/50"
              >
                <div
                  className="flex items-start gap-4"
                  onClick={() => window.open(source.url, "_blank")}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                    <TypeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600"
                        >
                          {source.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <strong className="text-gray-900">{source.title}</strong>
                      )}
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {source.type}
                      </span>
                    </div>
                    {source.author && (
                      <span className="text-sm text-gray-600">by {source.author}</span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
