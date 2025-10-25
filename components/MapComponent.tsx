import historicalData from "@/lib/data/mapdata.json"
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps"
import React, { useMemo, useState } from "react"

interface HistoricalEvent {
  id: string
  title: string
  date: string
  location: { lat: number; lng: number }
  description: string
  type: string
  participants: string[]
  casualties: string
}

interface MapComponentProps {
  eventId: string
  setActiveTab: (tab: string) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ eventId, setActiveTab }) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<HistoricalEvent | null>(null)
  const [highlightedEvent, setHighlightedEvent] = useState<HistoricalEvent | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const currentData = historicalData[eventId as keyof typeof historicalData]

  const handleViewDetails = () => {
    setActiveTab("details")
  }

  // Filter and search events
  const filteredEvents = useMemo(() => {
    if (!currentData?.events) return []

    return currentData.events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || event.type === filterType
      return matchesSearch && matchesType
    })
  }, [currentData?.events, searchTerm, filterType])

  // Get unique event types for filter
  const eventTypes = useMemo(() => {
    if (!currentData?.events) return []
    return [...new Set(currentData.events.map((event) => event.type))]
  }, [currentData?.events])

  const getMarkerColor = (eventType: string) => {
    const colors = {
      invasion: "#FF4444",
      attack: "#FF6B6B",
      "air-campaign": "#4A90E2",
      "naval-battle": "#2E86AB",
      siege: "#8B0000",
      "tank-battle": "#D4AF37",
      liberation: "#4CAF50",
      offensive: "#FF8C00",
      "river-crossing": "#20B2AA",
      "atomic-bombing": "#9932CC",
      surrender: "#32CD32",
      assembly: "#FFD700",
      "political-formation": "#87CEEB",
      uprising: "#FF4500",
      declaration: "#6A5ACD",
      march: "#FF69B4",
      execution: "#8B0000",
      "reign-of-terror": "#DC143C",
      coup: "#4682B4",
    }
    return colors[eventType as keyof typeof colors] || "#666666"
  }

  const getEventIcon = (eventType: string) => {
    const icons = {
      invasion: "⚔️",
      attack: "💥",
      "air-campaign": "✈️",
      "naval-battle": "🚢",
      siege: "🏰",
      "tank-battle": "🚗",
      liberation: "🎉",
      offensive: "⚡",
      "river-crossing": "🌉",
      "atomic-bombing": "☢️",
      surrender: "🏳️",
      assembly: "📜",
      "political-formation": "🏛️",
      uprising: "🔥",
      declaration: "📖",
      march: "🚶‍♀️",
      execution: "⚰️",
      "reign-of-terror": "🔪",
      coup: "🏴",
    }
    return icons[eventType as keyof typeof icons] || "📍"
  }

  const handleMarkerClick = (event: HistoricalEvent) => {
    setSelectedEvent(event)
    setHighlightedEvent(event)
  }

  const handleCardClick = (event: HistoricalEvent) => {
    setSelectedEvent(event)
    setHighlightedEvent(event)
    // Scroll to top to see the map
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMarkerHover = (event: HistoricalEvent) => {
    setHoveredEvent(event)
  }

  const handleMarkerLeave = () => {
    setHoveredEvent(null)
  }

  const renderMapContent = () => {
    if (!currentData) {
      return (
        <div className="p-4 text-center text-gray-500">
          Historical data not found for: {eventId}
        </div>
      )
    }

    return (
      <div className="relative h-full w-full">
        <APIProvider apiKey={process.env.GOOGLE_API_KEY || ""}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={currentData.mapZoom}
            defaultCenter={currentData.mapCenter}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId="77c887a07c2c59f8651bae4f"
            onClick={() => setSelectedEvent(null)}
          >
            {currentData.events.map((event) => (
              <Marker
                key={event.id}
                position={event.location}
                title={event.title}
                onClick={() => handleMarkerClick(event)}
                onMouseOver={() => handleMarkerHover(event)}
                onMouseOut={handleMarkerLeave}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="${getMarkerColor(event.type)}" stroke="${highlightedEvent?.id === event.id ? "#000000" : "#ffffff"}" stroke-width="${highlightedEvent?.id === event.id ? "4" : "2"}" opacity="${highlightedEvent?.id === event.id ? "1" : "0.8"}"/>
                      <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${getEventIcon(event.type)}</text>
                    </svg>
                  `)}`,
                  scaledSize:
                    typeof google !== "undefined" ? new google.maps.Size(32, 32) : undefined,
                  anchor: typeof google !== "undefined" ? new google.maps.Point(16, 16) : undefined,
                }}
              />
            ))}
          </Map>
        </APIProvider>

        {/* Hover Tooltip */}
        {hoveredEvent && (
          <div className="absolute right-4 top-20 z-10 max-w-sm rounded-lg bg-black bg-opacity-80 p-3 text-white shadow-lg">
            <div className="mb-2 flex items-center">
              <span className="mr-2 text-lg">{getEventIcon(hoveredEvent.type)}</span>
              <h4 className="font-bold">{hoveredEvent.title}</h4>
            </div>
            <p className="text-sm text-gray-200">{hoveredEvent.date}</p>
          </div>
        )}

        {/* Selected Event Detail Panel */}
        {selectedEvent && (
          <div className="absolute bottom-4 left-4 right-4 max-h-48 overflow-y-auto rounded-2xl border border-white/20 bg-gray-800/50 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-2xl">{getEventIcon(selectedEvent.type)}</span>
                <div>
                  <h3
                    className="cursor-pointer text-lg font-bold text-white drop-shadow-lg hover:underline"
                    onClick={handleViewDetails}
                  >
                    {selectedEvent.title}
                  </h3>

                  <p className="text-sm font-semibold text-gray-200">{selectedEvent.date}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedEvent(null)
                  setHighlightedEvent(null)
                }}
                className="text-xl text-white drop-shadow-lg hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <p className="mb-3 text-sm text-white drop-shadow">{selectedEvent.description}</p>
            <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
              <div>
                <strong className="text-white drop-shadow">Participants:</strong>
                <ul className="mt-1">
                  {selectedEvent.participants.map((participant, idx) => (
                    <li key={idx} className="ml-2 text-gray-200">
                      • {participant}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-white drop-shadow">Casualties:</strong>
                <p className="mt-1 text-gray-200">{selectedEvent.casualties}</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Count Badge */}
        <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
          {currentData.events.length} Events
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="map-container h-150 relative w-full overflow-hidden rounded-lg border">
        {renderMapContent()}
      </div>

      <div className="mb-6 w-full text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {currentData?.title || "Historical Map"}
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">{currentData?.description}</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {getEventIcon(type)}{" "}
                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Historical Events ({filteredEvents.length})
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleCardClick(event)}
              className={`transform cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                highlightedEvent?.id === event.id
                  ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: getMarkerColor(event.type) }}
                  >
                    {getEventIcon(event.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">{event.title}</h3>
                  <p className="mb-2 text-xs font-medium text-gray-500">{event.date}</p>
                  <p className="line-clamp-3 text-xs text-gray-600">{event.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                      {event.type.replace("-", " ")}
                    </span>
                    {highlightedEvent?.id === event.id && (
                      <span className="text-xs font-medium text-blue-600">● Selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No events found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapComponent
