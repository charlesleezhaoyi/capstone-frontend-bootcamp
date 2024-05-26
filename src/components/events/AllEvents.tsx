import React, { FC, useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { Event, useEvents } from "../../hooks/useEvents";
import { useUser } from "../../UserContext";

export const AllEvents: FC = () => {
  const [events, setEvents] = useState<Event[]>();
  const { fetchEventsByNpoId } = useEvents();
  const { userNpo } = useUser();

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvents = await fetchEventsByNpoId();
      const currentDate = new Date();
      const validEvents = fetchedEvents.filter(
        (event: Event) => new Date(event.date) >= currentDate
      );
      console.log(validEvents);
      setEvents(validEvents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync();
  }, [userNpo]);

  const eventCards = Array.isArray(events)
    ? events.map((event: Event) => <EventCard key={event.id} event={event} />)
    : [];

  return (
    <div className="grid lg:gap-8 lg:p-8 lg:grid-cols-3 md:gap-4 md:p-4 md:grid-cols-2 grid-cols-1 gap-10 p-10">
      {eventCards}
    </div>
  );
};
