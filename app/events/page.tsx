'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EventItem from './EventItem';
import { HistoricEvent } from '../types/event';
import eventsData from '../data/eventdata.json';

export default function EventsPage() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<HistoricEvent | null>(null);
  const events = eventsData as HistoricEvent[];

  const handleEventClick = (event: HistoricEvent) => {
    if (event.isFullyImplemented) {
      setSelectedEvent(event);
      console.log('Navigating to event:', event.name);
      router.push(`/events/timeline?id=${event.id}`);
    }
  };

  const fullyImplementedCount = events.filter(e => e.isFullyImplemented).length;
  const totalCount = events.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Historic Events</h1>
        <p className="text-lg text-gray-600 mb-2">
          Explore pivotal moments in history through interactive experiences.
        </p>
        <p className="text-sm text-gray-500">
          {fullyImplementedCount} of {totalCount} events available to play
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={handleEventClick}
          />
        ))}
      </div>
    </div>
  );
}