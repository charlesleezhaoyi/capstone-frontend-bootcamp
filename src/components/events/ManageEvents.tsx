import React, { FC, useState, useEffect } from "react";
import { DataTable } from "../events/EventControlTable/EventControlTable";
import {
  columns,
  EventColumnAttributes,
  EventValue,
} from "../events/EventControlTable/eventControlColumns";
import { UpdateEventDialog } from "./UpdateEventDialog";
import { CreateEventDialog } from "./CreateEventDialog";
import { Event } from "../../hooks/useEvents";
import { useEvents } from "../../hooks/useEvents";
import { useUser } from "../../UserContext";
import axios from "axios";
import { set } from "date-fns";
import { Button } from "../ui/button";

export default function ManageEvents() {
  const [events, setEvents] = useState<EventColumnAttributes[]>([]);
  const { fetchEventsByNpoId } = useEvents();
  // const [updateDialogClosed, setUpdateDialogClosed] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { userNpo } = useUser();
  // const [rsvpCount, setRsvpCount] = useState(0);

  const [reload, setReload] = useState(false);

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvents = await fetchEventsByNpoId();
      setEvents(fetchedEvents);
      console.log(fetchedEvents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync(); // Fetch events when the component mounts

    if (!updateDialogOpen) {
      setUpdateDialogOpen(false); // Reset the state after fetching the events
    }
    if (!createDialogOpen) {
      setCreateDialogOpen(false); // Reset the state after fetching the events
    }
  }, [updateDialogOpen, reload, createDialogOpen]);

  const deleteEvent = async (eventId: number, organiserId: number) => {
    try {
      console.log(eventId, organiserId);
      const response = await axios.delete(
        `http://localhost:3001/npoEvents/${userNpo}`,
        {
          data: {
            organiser_id: organiserId,
            event_id: eventId,
          },
        }
      );
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
    <div className="hidden h-screen flex-1 flex-col space-y-8 p-8 md:flex bg-white">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of all the events you're organising
            </p>
          </div>
          <Button
            className="text-white bg-black"
            onClick={() => setCreateDialogOpen(true)}
          >
            Create
          </Button>
        </div>
        <CreateEventDialog
          npo_id={userNpo}
          isOpen={createDialogOpen}
          setIsOpen={setCreateDialogOpen}
          onDialogClose={() => {
            setCreateDialogOpen(false);
          }}
        />
        <UpdateEventDialog
          npo_id={userNpo}
          isOpen={updateDialogOpen}
          setIsOpen={setUpdateDialogOpen}
          onDialogClose={() => {
            setUpdateDialogOpen(false);
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
          setUpdateDialogOpen,
          setSelectedEvent
        )}
        // onRowClick={(row) =>
        //   setSelectedEvent({ ...row, date: new Date(row.date) })
        // }
        deleteEvent={deleteEvent}
        // fetchRsvpCount={fetchRsvpCount}
      />
      <div className="hidden h-screen flex-1 flex-col space-y-8 p-8 md:flex bg-white max-w-7xl mx-auto"></div>
    </div>
  );
}
