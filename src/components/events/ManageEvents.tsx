import React, { FC, useState, useEffect } from "react";
import { DataTable } from "../ui/data-table";
import { Events, columns, EventValue } from "../ui/event-columns";
import { Event } from "../../hooks/useEvents";
import { useEvents } from "../../hooks/useEvents";
import axios from "axios";

export default function ManageEvents() {
  const [events, setEvents] = useState<Events[]>([]);
  const { fetchEventsByNpoId } = useEvents();

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvents = await fetchEventsByNpoId(1);
      setEvents(fetchedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync();
  }, []);

  const deleteEvent = async (eventId: number, organiserId: number) => {
    try {
      console.log(eventId, organiserId);
      const response = await axios.delete(`http://localhost:3001/npoEvents/1`, {
        data: {
          organiser_id: organiserId,
          event_id: eventId,
        },
      });
      if (response.status !== 200) {
        console.log(response.data);
        throw new Error("Failed to delete event");
      }
      // Re-fetch events after a successful deletion
      fetchEventsAsync();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the events you're organising
          </p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <UserNav />
        </div> */}
      </div>
      <DataTable<Events, EventValue>
        data={events}
        columns={columns(deleteEvent)}
        deleteEvent={deleteEvent}
      />
    </div>
  );
}
