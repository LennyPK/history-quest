'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import eventsData from '../../data/eventdata.json';
import { HistoricEvent } from '../../types/event';

export default function TimelinePage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [event, setEvent] = useState<HistoricEvent | null>(null);
  
  useEffect(() => {
    if (eventId) {
      const foundEvent = eventsData.find(e => e.id === eventId) as HistoricEvent;
      setEvent(foundEvent);
    }
  }, [eventId]);

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Loading event...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name} Timeline</h1>
      <p className="text-lg text-gray-600 mb-6">{event.blurb}</p>
      
      {/* Your timeline component content goes here */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Timeline content for {event.name} will be displayed here.</p>
      </div>
    </div>
  );
}