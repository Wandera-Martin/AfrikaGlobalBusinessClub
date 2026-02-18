import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/lib/mockData";
import { Calendar, Clock, Users, Video, Play } from "lucide-react";
import { toast } from "sonner";

const EventsPage = () => {
  const [events] = useState(mockEvents);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const filteredEvents = events.filter((e) => filter === "upcoming" ? !e.isPast : e.isPast);

  const handleRSVP = (eventId: string) => {
    toast.success("RSVP confirmed!", {
      description: "We'll send you a reminder before the event",
    });
  };

  const handleJoinLive = (eventId: string) => {
    toast.info("Redirecting to live session...");
  };

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events & Webinars</h1>
            <p className="text-gray-600">Learn, network, and grow with AGBC community events</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === "upcoming"
                  ? 'bg-agbc-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === "past"
                  ? 'bg-agbc-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                {/* Event Type Banner */}
                <div
                  className={`h-2 ${
                    event.type === "Webinar"
                      ? "bg-blue-500"
                      : event.type === "Workshop"
                      ? "bg-green-500"
                      : event.type === "Trade Mission"
                      ? "bg-purple-500"
                      : "bg-amber-500"
                  }`}
                />

                <div className="p-6">
                  {/* Type Badge */}
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                      event.type === "Webinar"
                        ? "bg-blue-50 text-blue-700"
                        : event.type === "Workshop"
                        ? "bg-green-50 text-green-700"
                        : event.type === "Trade Mission"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {event.type}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-agbc-blue" />
                      <span>{new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-agbc-blue" />
                      <span>
                        {new Date(event.eventDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} · {event.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-agbc-blue" />
                      <span>
                        {event.registrations} registered
                        {event.maxParticipants && ` / ${event.maxParticipants} max`}
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  {!event.isPast ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleRSVP(event.id)}
                        className="w-full bg-agbc-blue hover:bg-agbc-blue-dark"
                      >
                        RSVP Now
                      </Button>
                      {event.liveLink && (
                        <Button
                          onClick={() => handleJoinLive(event.id)}
                          variant="outline"
                          className="w-full"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Live Session
                        </Button>
                      )}
                    </div>
                  ) : (
                    event.replayUrl && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => toast.info("Opening replay...")}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Replay
                      </Button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {filter} events
              </h3>
              <p className="text-gray-600">Check back soon for new events!</p>
            </div>
          )}

          {/* CTA Banner */}
          {filter === "upcoming" && (
            <div className="mt-12 bg-gradient-to-r from-agbc-blue to-agbc-green rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Want to host an event?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Share your expertise with the AGBC community. We help promote events from members.
              </p>
              <Button className="bg-white text-agbc-blue hover:bg-gray-100">
                Propose an Event
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </UnifiedShell>
  );
};

export default EventsPage;
