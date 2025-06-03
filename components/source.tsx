import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Source } from "@/lib/types/event"
import {
  Calendar,
  Camera,
  ExternalLink,
  FileAudio,
  FileText,
  Globe,
  Info,
  MapPin,
  Newspaper,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface SourceListProps {
  sources: Source[]
}

export default function SourceList({ sources }: SourceListProps) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  const documentSources = sources.filter((source) => source.type === "document")
  const photoSources = sources.filter((source) => source.type === "photo")
  const newspaperSources = sources.filter((source) => source.type === "newspaper")
  const videoSources = sources.filter((source) => source.type === "video")
  const otherSources = sources.filter((source) => source.type === "other")

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "photo":
        return <Camera className="h-5 w-5" />
      case "newspaper":
        return <Newspaper className="h-5 w-5" />
      case "video":
        return <FileAudio className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "photo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "newspaper":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "video":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const filterSources = () => {
    if (activeTab === "all") return sources
    return sources.filter((source) => source.type === activeTab)
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Sources</CardTitle>
        <CardDescription>
          Explore original documents, photos, and recordings from this historical period
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({sources.length})</TabsTrigger>
            <TabsTrigger value="document">Documents ({documentSources.length})</TabsTrigger>
            <TabsTrigger value="photo">Photos ({photoSources.length})</TabsTrigger>
            <TabsTrigger value="newspaper">Press ({newspaperSources.length})</TabsTrigger>
            <TabsTrigger value="video">Audio/Video ({videoSources.length})</TabsTrigger>
            <TabsTrigger value="other">Other ({otherSources.length})</TabsTrigger>
          </TabsList>

          {filterSources().length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No {activeTab === "all" ? "" : activeTab} sources available
            </div>
          ) : (
            <ul className="space-y-4">
              {filterSources().map((source, idx) => {
                return (
                  <Card
                    key={idx}
                    className="border-l-primary/20 cursor-pointer border-l-4 transition-all hover:border-l-amber-500 hover:shadow-md"
                    onClick={() => window.open(source.url, "_blank")}
                  >
                    <CardContent className="px-4">
                      <div className="flex gap-4">
                        {/* Icon or Image */}
                        <div className="flex-shrink-0">
                          {source.hasImage && source.type === "photo" ? (
                            <div className="bg-muted h-16 w-16 overflow-hidden rounded-md">
                              <Image
                                src={source.thumbnail || "/placeholder.svg?height=64&width=64"}
                                alt={source.title}
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                              />
                            </div>
                          ) : (
                            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-md">
                              {getSourceIcon(source.type)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-2 line-clamp-2 text-sm font-medium">{source.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                            {source.description}
                          </p>
                          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{source.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>{source.author}</span>
                            </div>
                            {source.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{source.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badge and Preview indicator */}
                        <div className="flex flex-row items-center justify-center gap-2">
                          <Badge variant="outline" className={getTypeColor(source.type)}>
                            {source.type}
                          </Badge>
                          <ExternalLink className="text-muted-foreground h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  //   <li
                  //     key={idx}
                  //     className="group rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/50"
                  //   >
                  //     <div
                  //       className="flex items-start gap-4"
                  //       onClick={() => window.open(source.url, "_blank")}
                  //     >
                  //       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                  //         <TypeIcon className="h-5 w-5 text-gray-500" />
                  //       </div>
                  //       <div className="flex flex-col space-y-2">
                  //         <div className="flex items-center gap-2">
                  //           {source.url ? (
                  //             <a
                  //               href={source.url}
                  //               target="_blank"
                  //               rel="noopener noreferrer"
                  //               className="inline-flex items-center gap-1 font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600"
                  //             >
                  //               {source.title}
                  //               <ExternalLink className="h-3 w-3" />
                  //             </a>
                  //           ) : (
                  //             <strong className="text-gray-900">{source.title}</strong>
                  //           )}
                  //           <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  //             {source.type}
                  //           </span>
                  //         </div>
                  //         {source.author && (
                  //           <span className="text-sm text-gray-600">by {source.author}</span>
                  //         )}
                  //       </div>
                  //     </div>
                  //   </li>
                )
              })}
            </ul>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
