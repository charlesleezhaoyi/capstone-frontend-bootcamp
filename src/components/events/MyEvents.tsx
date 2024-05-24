import React, { FC, useState, useEffect } from "react";
import { Event, useEvents } from "../../hooks/useEvents";
import { EventCard } from "./EventCard";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";

export const MyEvents: FC = () => {
  const [events, setEvents] = useState<Event[]>();
  const { fetchEventsByNpoId } = useEvents();

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvents = await fetchEventsByNpoId();
      setEvents(fetchedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync();
  }, []);

  const eventCards = events?.map((event: Event) => (
    <EventCard key={event.id} event={event} />
  ));

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="sticky top-0 bg-white border-t-2 border-secondary p-3 h-fit w-full rounded-none justify-start">
        <TabsTrigger
          value="upcoming"
          className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
        >
          <h5>Upcoming Events</h5>
        </TabsTrigger>

        <TabsTrigger
          value="past"
          className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
        >
          <h5>Past Events</h5>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="mt-0">
        <div className="grid lg:gap-8 lg:p-8 lg:grid-cols-3 md:gap-4 md:p-4 md:grid-cols-2 grid-cols-1 gap-10 p-10">
          {eventCards}
        </div>
      </TabsContent>
      <TabsContent value="past" className="mt-0">
        <div className="grid lg:gap-8 lg:p-8 lg:grid-cols-3 md:gap-4 md:p-4 md:grid-cols-2 grid-cols-1 gap-10 p-10">
          {eventCards}
        </div>
      </TabsContent>
    </Tabs>
  );
};
