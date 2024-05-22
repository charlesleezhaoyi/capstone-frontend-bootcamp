import React, { FC, useState, useEffect } from "react";
import { DataTable } from "../events/EventControlTable/EventControlTable";
import {
  Events,
  columns,
  EventValue,
} from "../events/EventControlTable/eventControlColumns";
import { EventDialog } from "./EventDialog";
import { Event } from "../../hooks/useEvents";
import { useEvents } from "../../hooks/useEvents";
// import { Button } from "../ui/button";
import axios from "axios";

export default function ManageEvents() {
  const [events, setEvents] = useState<Events[]>([]);
  const { fetchEventsByNpoId } = useEvents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  //update with dynamic endpoint to npo_id
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

  //update with dynamic endpoint to npo_id
  // const updateEvent = async (
  //   eventId: number,
  //   organiserId: number,
  //   updateData: object
  // ) => {
  //   try {
  //     console.log(eventId, organiserId);
  //     const response = await axios.put(`http://localhost:3001/npoEvents/1`, {
  //       organiser_id: organiserId,
  //       event_id: eventId,
  //       ...updateData,
  //     });
  //     if (response.status !== 200) {
  //       console.log(response.data);
  //       throw new Error("Failed to update event");
  //     }
  //     // Re-fetch events after a successful update
  //     fetchEventsAsync();
  //   } catch (error) {
  //     console.error("Failed to update event:", error);
  //   }
  // };

  //create events with dynamic endpoint to npo_id
  interface EventData {
    organiser_id: number;
    event_name: string;
    event_overview: string;
    date: string;
    time: string;
    location: string;
    price: number;
  }

  // const createEvent = async (npo_id: number, eventData: EventData) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:3001/npoEvents/${npo_id}/events`,
  //       {
  //         ...eventData,
  //       }
  //     );
  //     if (response.status !== 200) {
  //       console.log(response.data);
  //       throw new Error("Failed to create event");
  //     }
  //     // Re-fetch events after a successful creation
  //     fetchEventsAsync();
  //   } catch (error) {
  //     console.error("Failed to create event:", error);
  //   }
  // };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex bg-white">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the events you're organising
          </p>
        </div>
        <EventDialog npo_id={1}></EventDialog>
      </div>
      <DataTable<Events, EventValue>
        data={events}
        columns={columns(deleteEvent)}
        deleteEvent={deleteEvent}
      />
    </div>
  );
}
