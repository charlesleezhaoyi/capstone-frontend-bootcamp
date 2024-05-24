import React, { FC, useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { Event, useEvents } from "../../hooks/useEvents";

export const AllEvents: FC = () => {
  const [events, setEvents] = useState<Event[]>();
  const { fetchEventsByNpoId } = useEvents();

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvents = await fetchEventsByNpoId(1);
      console.log(fetchedEvents);
      setEvents(fetchedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync();
  }, []);

  const eventCards = Array.isArray(events)
    ? events.map((event: Event) => <EventCard key={event.id} event={event} />)
    : [];

  return (
    <div className="grid lg:gap-8 lg:p-8 lg:grid-cols-3 md:gap-4 md:p-4 md:grid-cols-2 grid-cols-1 gap-10 p-10">
      {eventCards}
    </div>
  );
};
