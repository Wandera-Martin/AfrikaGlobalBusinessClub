import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '../services/businessApi';
import { fetchEvents, Event } from '../services/eventsApi';
import EventCard from '../components/Dashboard/EventCard';



const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState<BusinessProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profile, eventsData] = await Promise.all([
        fetchBusinessProfile(),
        fetchEvents()
      ]);
      setProfileStatus(profile);
      setEvents(eventsData);
    } catch (err) {
      console.error("Error loading events", err);
    } finally {
      setLoading(false);
    }
  };

  const showBanner =
    profileStatus !== null &&
    !profileStatus.onboarding_completed &&
    profileStatus.onboarding_skipped;

  return (
    <>
      {/* ── NAV ── */}
      

      
        {/* ── MAIN CONTENT ── */}
        <div className="w-full">
            <div className="mb-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-extrabold mb-2">Upcoming Events</h1>
                <p className="text-orange-50 max-w-xl">Join leading African businesses in exclusive networking sessions, summits, and expert-led virtual events.</p>
              </div>
              <div className="absolute -right-5 -bottom-10 opacity-10 text-[180px] leading-none pointer-events-none">📅</div>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.length > 0 ? (
                  events.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onJoinSuccess={loadData} 
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-4xl mb-3">🗓️</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No upcoming events</h3>
                    <p className="text-gray-500 text-sm">Check back later for new events organized by Trade Africa Group.</p>
                  </div>
                )}
              </div>
            )}
        </div>
    </>
  );
};

export default EventsPage;
