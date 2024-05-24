import React, { FC, useState, useEffect } from "react";
import { DataTable } from "../events/EventControlTable/EventControlTable";
import {
  columns,
  EventColumnAttributes,
  EventValue,
} from "../events/EventControlTable/eventControlColumns";
import { EventDialog } from "./EventDialog";
import { Event } from "../../hooks/useEvents";
import { useEvents } from "../../hooks/useEvents";
import axios from "axios";
import { set } from "date-fns";

export default function ManageEvents() {
  const [events, setEvents] = useState<EventColumnAttributes[]>([]);
  const { fetchEventsByNpoId } = useEvents();
  const [dialogClosed, setDialogClosed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );

  useEffect(() => {
    if (dialogClosed) {
      fetchEventsAsync();
      setDialogClosed(false); // Reset the state after fetching the events
    }
  }, [dialogClosed]);

  const [reload, setReload] = useState(false);

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvents = await fetchEventsByNpoId(7);
      setEvents(fetchedEvents);
      console.log(fetchedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync(); // Fetch events when the component mounts

    if (dialogClosed) {
      setDialogClosed(false); // Reset the state after fetching the events
    }
  }, [dialogClosed, reload]);

  //update with dynamic endpoint to npo_id
  const deleteEvent = async (eventId: number, organiserId: number) => {
    try {
      console.log(eventId, organiserId);
      const response = await axios.delete(`http://localhost:3001/npoEvents/7`, {
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
      setReload(!reload);
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
        <EventDialog
          npo_id={1}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          onDialogClose={() => {
            setDialogClosed(true);
            setDialogOpen(false);
            setSelectedEvent(undefined);
          }}
          event={selectedEvent}
        />
      </div>
      <DataTable<EventColumnAttributes, EventValue>
        data={events}
        columns={columns(
          deleteEvent,
          setEvents,
          setDialogOpen,
          setSelectedEvent
        )}
        onRowClick={(row) =>
          setSelectedEvent({ ...row, date: new Date(row.date) })
        }
        deleteEvent={deleteEvent}
      />
    </div>
  );
}
