"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { UpdateEventDialog } from "../UpdateEventDialog";
import { useState, Dispatch, SetStateAction } from "react";
import { Event } from "../../../hooks/useEvents";

export type EventValue =
  | string
  | number
  | Date
  | boolean
  | {
      createdAt: string;
      cv_url: string;
      date_of_birth: string;
      display_img_url: string;
      email: string;
      employee_at: string;
      full_name: string;
      gender: string;
      id: number;
      is_onboarded: boolean;
      occupation: string;
      portfolio_link_url: string;
      updatedAt: string;
    };
export type EventColumnAttributes = Event & {
  event_name: string;
  date: Date;
  time: string;
  price: number;
};

type EventActionsCellProps = {
  event: EventColumnAttributes;
  deleteEvent: (id: number, organiserId: number) => Promise<void>;
  eventObjectSetter: React.Dispatch<React.SetStateAction<Event[]>>;
  setUpdateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
};

const EventActionsCell: React.FC<EventActionsCellProps> = ({
  event,
  deleteEvent,
  eventObjectSetter,
  setUpdateDialogOpen,
  setSelectedEvent,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>View Event</DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            console.log("Update Event Details clicked");
            setSelectedEvent(event);
            setUpdateDialogOpen(true);
          }}
        >
          Update Event Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteEvent(event.id, event.organiser_id)}
        >
          Delete Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = (
  deleteEvent: (id: number, organiserId: number) => Promise<void>,
  eventObjectSetter: Dispatch<SetStateAction<Event[]>>,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSelectedEvent: Dispatch<SetStateAction<Event | undefined>>
): ColumnDef<EventColumnAttributes, EventValue>[] => [
  {
    accessorKey: "event_name",
    header: "Event Name",
    accessorFn: (event: EventColumnAttributes) => event.event_name,
  },
  {
    accessorKey: "date",
    header: "Date",
    accessorFn: (event: EventColumnAttributes) =>
      new Date(event.date).toISOString().slice(0, 10),
  },
  {
    accessorKey: "time",
    header: "Time",
    accessorFn: (event: EventColumnAttributes) => {
      const [hours, minutes] = event.time.split(":").map(Number);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} SGT`;
    },
  },
  // {
  //   accessorKey: "attendees",
  //   header: "Number of attendees",
  //   accessorFn: (event: EventColumnAttributes) => event.rsvpCount,
  //   },
  {
    accessorKey: "price",
    header: "Price",
    accessorFn: (event: EventColumnAttributes) => {
      const displayedPrice = event.price.toFixed(2);
      return `$${displayedPrice}`;
    },
  },
  {
    id: "actions",
    cell: (cell: any) => {
      const event = cell.row.original;
      return (
        <EventActionsCell
          event={event}
          deleteEvent={deleteEvent}
          eventObjectSetter={eventObjectSetter}
          setUpdateDialogOpen={setDialogOpen}
          setSelectedEvent={setSelectedEvent}
        />
      );
    },
  },
];
