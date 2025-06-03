import { Card, CardContent } from "@/components/ui/card"
import { Source } from "@/lib/types/event"
import { ExternalLink } from "lucide-react"

interface SourceListProps {
  sources: Source[]
}

export default function SourceList({ sources }: SourceListProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-xl font-semibold text-gray-900">Sources</h3>
        <ul className="space-y-4">
          {sources.map((source, idx) => (
            <li
              key={idx}
              className="group rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/50"
            >
              <div className="flex flex-col space-y-2">
                <strong className="text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                  {source.title}
                </strong>
                {source.author && <span className="text-sm text-gray-600">by {source.author}</span>}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 transition-colors duration-200 hover:text-blue-700"
                  >
                    {source.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
