import React, { useState, useMemo } from "react"
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps"
import historicalData from "@/lib/data/mapdata.json"

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
    
    return currentData.events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || event.type === filterType
      return matchesSearch && matchesType
    })
  }, [currentData?.events, searchTerm, filterType])

  // Get unique event types for filter
  const eventTypes = useMemo(() => {
    if (!currentData?.events) return []
    return [...new Set(currentData.events.map(event => event.type))]
  }, [currentData?.events])

  const getMarkerColor = (eventType: string) => {
    const colors = {
      'invasion': '#FF4444',
      'attack': '#FF6B6B',
      'air-campaign': '#4A90E2',
      'naval-battle': '#2E86AB',
      'siege': '#8B0000',
      'tank-battle': '#D4AF37',
      'liberation': '#4CAF50',
      'offensive': '#FF8C00',
      'river-crossing': '#20B2AA',
      'atomic-bombing': '#9932CC',
      'surrender': '#32CD32',
      'assembly': '#FFD700',
      'political-formation': '#87CEEB',
      'uprising': '#FF4500',
      'declaration': '#6A5ACD',
      'march': '#FF69B4',
      'execution': '#8B0000',
      'reign-of-terror': '#DC143C',
      'coup': '#4682B4'
    }
    return colors[eventType as keyof typeof colors] || '#666666'
  }

  const getEventIcon = (eventType: string) => {
    const icons = {
      'invasion': '⚔️',
      'attack': '💥',
      'air-campaign': '✈️',
      'naval-battle': '🚢',
      'siege': '🏰',
      'tank-battle': '🚗',
      'liberation': '🎉',
      'offensive': '⚡',
      'river-crossing': '🌉',
      'atomic-bombing': '☢️',
      'surrender': '🏳️',
      'assembly': '📜',
      'political-formation': '🏛️',
      'uprising': '🔥',
      'declaration': '📖',
      'march': '🚶‍♀️',
      'execution': '⚰️',
      'reign-of-terror': '🔪',
      'coup': '🏴'
    }
    return icons[eventType as keyof typeof icons] || '📍'
  }

  const handleMarkerClick = (event: HistoricalEvent) => {
    setSelectedEvent(event)
    setHighlightedEvent(event)
  }

  const handleCardClick = (event: HistoricalEvent) => {
    setSelectedEvent(event)
    setHighlightedEvent(event)
    // Scroll to top to see the map
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMarkerHover = (event: HistoricalEvent) => {
    setHoveredEvent(event)
  }

  const handleMarkerLeave = () => {
    setHoveredEvent(null)
  }

  const renderMapContent = () => {
    if (!currentData) {
      return <div className="p-4 text-center text-gray-500">Historical data not found for: {eventId}</div>
    }

    return (
      <div className="w-full h-full relative">
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
                      <circle cx="16" cy="16" r="12" fill="${getMarkerColor(event.type)}" stroke="${highlightedEvent?.id === event.id ? '#000000' : '#ffffff'}" stroke-width="${highlightedEvent?.id === event.id ? '4' : '2'}" opacity="${highlightedEvent?.id === event.id ? '1' : '0.8'}"/>
                      <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${getEventIcon(event.type)}</text>
                    </svg>
                  `)}`,
                  scaledSize: typeof google !== "undefined" ? new google.maps.Size(32, 32) : undefined,
                  anchor: typeof google !== "undefined" ? new google.maps.Point(16, 16) : undefined,
                }}
              />
            ))}
          </Map>
        </APIProvider>

        {/* Hover Tooltip */}
        {hoveredEvent && (
          <div className="absolute top-20 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-lg max-w-sm z-10">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{getEventIcon(hoveredEvent.type)}</span>
              <h4 className="font-bold">{hoveredEvent.title}</h4>
            </div>
            <p className="text-sm text-gray-200">{hoveredEvent.date}</p>
          </div>
        )}

        {/* Selected Event Detail Panel */}
        {selectedEvent && (
          <div className="absolute bottom-4 left-4 right-4 bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg max-h-48 overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getEventIcon(selectedEvent.type)}</span>
                <div>
                  <h3 
                    className="font-bold text-lg text-white drop-shadow-lg cursor-pointer hover:underline"
                    onClick={handleViewDetails}
                  >
                    {selectedEvent.title}
                  </h3>
                  
                  <p className="text-sm text-gray-200 font-semibold">{selectedEvent.date}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setHighlightedEvent(null);
                }}
                className="text-white hover:text-gray-300 text-xl drop-shadow-lg"
              >
                ×
              </button>
            </div>
            <p className="text-sm mb-3 text-white drop-shadow">{selectedEvent.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <strong className="text-white drop-shadow">Participants:</strong>
                <ul className="mt-1">
                  {selectedEvent.participants.map((participant, idx) => (
                    <li key={idx} className="ml-2 text-gray-200">• {participant}</li>
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
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {currentData.events.length} Events
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="map-container w-full h-150 relative border rounded-lg overflow-hidden">
        {renderMapContent()}
      </div>
      
      <div className="w-full text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentData?.title || 'Historical Map'}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{currentData?.description}</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {getEventIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Historical Events ({filteredEvents.length})
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleCardClick(event)}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 ${
                highlightedEvent?.id === event.id 
                  ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: getMarkerColor(event.type) }}
                  >
                    {getEventIcon(event.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h3>
                  <p className="text-xs text-gray-500 mb-2 font-medium">{event.date}</p>
                  <p className="text-xs text-gray-600 line-clamp-3">{event.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {event.type.replace('-', ' ')}
                    </span>
                    {highlightedEvent?.id === event.id && (
                      <span className="text-xs text-blue-600 font-medium">● Selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No events found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapComponent