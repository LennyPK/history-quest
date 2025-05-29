import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Lock } from 'lucide-react';
import { HistoricEvent } from '../types/event';

interface EventItemProps {
  event: HistoricEvent;
  onClick?: (event: HistoricEvent) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (event.isFullyImplemented && onClick) {
      console.log("Event clicked:", event.name);
      onClick(event);
    }
  };

  return (
    <div onClick={handleClick}>
      <Card 
        className={`w-64 h-80 overflow-hidden p-0 transition-all duration-200 ${
          event.isFullyImplemented 
            ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
            : 'opacity-75 cursor-not-allowed'
        }`}
      >
        <div className="relative h-35 w-full">
          {event.isFullyImplemented ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {!event.isFullyImplemented && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        <CardContent className="pt-0 px-4 h-40 flex flex-col justify-between -mt-4">
          <div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{event.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{event.date}</p>
            <p className="text-sm text-gray-600 line-clamp-3 mb-1">{event.blurb}</p>
          </div>
          
          <div className="flex items-center justify-between -mt-8">
            <div className="flex items-center gap-1 -mt-4">
              <span className="text-xs text-gray-500 mr-1">Difficulty:</span>
              {getDifficultyStars(event.difficulty)}
            </div>
            {!event.isFullyImplemented && (
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventItem;