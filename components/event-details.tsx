import { Details, EventDetailItem } from "@/lib/types/event"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "./ui/card"

interface EventDetailsProps {
  details: Details[]
}

export default function EventDetails({ details }: EventDetailsProps) {
  const [expanded, setExpanded] = useState({
    causes: false,
    majorEvents: false,
    keyParticipants: false,
    outcomes: false,
  })

  const toggle = (section: keyof typeof expanded) => {
    setExpanded({ ...expanded, [section]: !expanded[section] })
  }

  const renderDetailList = (items?: EventDetailItem[], titleKey?: keyof EventDetailItem) => (
    <ul className="mt-3 list-disc space-y-3 pl-5">
      {items?.map((item, idx) => (
        <li key={idx} className="text-gray-700">
          <strong className="text-gray-900">{item.title || item.name}</strong>
          {item.text && `: ${item.text}`}
          {item.role && ` — ${item.role}`}
        </li>
      ))}
    </ul>
  )

  const detail = details[0]

  if (!detail) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No details available for this event.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-6 pt-6">
        {/* Causes */}
        <section className="border-b border-gray-100 pb-4 last:border-0">
          <button
            onClick={() => toggle("causes")}
            className="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 hover:text-blue-600"
          >
            <span>Causes</span>
            {expanded.causes ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded.causes ? "max-h-96" : "max-h-0"}`}
          >
            {renderDetailList(detail.causes, "title")}
          </div>
        </section>

        {/* Major Events */}
        <section className="border-b border-gray-100 pb-4 last:border-0">
          <button
            onClick={() => toggle("majorEvents")}
            className="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 hover:text-blue-600"
          >
            <span>Major Events</span>
            {expanded.majorEvents ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            )}
          </button>
          {expanded.majorEvents && (
            <div>
              {/* Float the image+caption container, not just the image */}
              <div className="float-right mb-2 ml-4 w-[420px]">
                <figure>
                  <Image
                    src={detail.majorEventImage}
                    alt={"Major Event Image"}
                    width={420}
                    height={220}
                    className="block rounded-lg shadow-sm"
                  />
                  {detail.imageCaption && (
                    <figcaption className="mt-1 text-center text-xs italic text-gray-500">
                      {detail.imageCaption}
                    </figcaption>
                  )}
                </figure>
              </div>
              {renderDetailList(detail["major-events"], "title")}
              <div className="clear-both" />
            </div>
          )}
        </section>

        {/* Key Participants */}
        <section className="border-b border-gray-100 pb-4 last:border-0">
          <button
            onClick={() => toggle("keyParticipants")}
            className="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 hover:text-blue-600"
          >
            <span>Key Participants</span>
            {expanded.keyParticipants ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded.keyParticipants ? "max-h-96" : "max-h-0"}`}
          >
            {renderDetailList(detail["key-participants"], "name")}
          </div>
        </section>

        {/* Outcomes */}
        <section className="border-b border-gray-100 pb-4 last:border-0">
          <button
            onClick={() => toggle("outcomes")}
            className="flex w-full items-center justify-between text-lg font-semibold transition-colors duration-200 hover:text-blue-600"
          >
            <span>Outcomes</span>
            {expanded.outcomes ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded.outcomes ? "max-h-96" : "max-h-0"}`}
          >
            {renderDetailList(detail.outcomes, "title")}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
