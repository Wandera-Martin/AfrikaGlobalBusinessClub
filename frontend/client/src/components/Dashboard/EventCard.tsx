import React, { useState } from 'react';
import { Event, joinEvent } from '../../services/eventsApi';
import { useToast } from '../../context/ToastContext';

interface EventCardProps {
  event: Event;
  onJoinSuccess: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onJoinSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleJoin = async () => {
    if (event.has_registered) return;
    
    setIsSubmitting(true);
    try {
      await joinEvent(event.id);
      showToast('Successfully registered for the event!', 'success');
      onJoinSuccess();
    } catch (err: any) {
      showToast(err.message || 'Failed to register', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventDate = new Date(event.event_date);
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[eventDate.getMonth()];
  const day = eventDate.getDate();
  const timeString = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      {event.image_banner ? (
        <div className="h-40 w-full overflow-hidden relative">
          <img 
            src={event.image_banner} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      ) : (
        <div className="h-32 w-full bg-gradient-to-r from-navy to-indigo-900 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col relative z-10">
        <div className="flex gap-4">
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-blue-50 text-blue-900 rounded-xl w-16 h-16 border border-blue-100 shadow-sm -mt-12 relative z-20 bg-white">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider leading-none mb-1">{month}</span>
            <span className="text-2xl font-black leading-none">{day}</span>
          </div>
          
          <div className={`flex-grow ${event.image_banner ? '' : '-mt-2'}`}>
            <div className="flex items-center gap-2 mb-1 hidden">
              <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                Active
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-1">
              {event.title}
            </h3>
            <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-3">
              <span>🕒 {timeString}</span>
              <span>•</span>
              <span className="truncate max-w-[140px]" title={event.location}>
                {event.is_virtual ? '🌐 Virtual Event' : `📍 ${event.location}`}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed mt-2 line-clamp-3">
          {event.description}
        </p>

        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-gray-500">
              {event.capacity ? `${event.registered_count} / ${event.capacity} Attending` : `${event.registered_count} Attending`}
            </div>
            {event.capacity && event.registered_count >= event.capacity && !event.has_registered && (
              <span className="text-xs font-bold text-red-600">Event Full</span>
            )}
          </div>
          
          {event.has_registered ? (
            <button
              disabled
              className="w-full py-2.5 bg-green-50 text-green-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 border border-green-200"
            >
              ✓ You're Going!
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isSubmitting || (event.capacity !== null && event.registered_count >= event.capacity)}
              className="w-full py-2.5 bg-navy hover:bg-blue-900 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-navy"
            >
              {isSubmitting ? 'Registering...' : 'RSVP Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
