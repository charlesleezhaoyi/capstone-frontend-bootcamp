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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Events = {
  createdAt: string;
  updatedAt: string;
  date: string;
  event_name: string;
  event_overview: string;
  event_photo_url: string;
  id: number;
  location: string;
  npo_id: number;
  organiser: {
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
  organiser_id: number;
  price: number;
  time: string;
};
export type EventValue =
  | string
  | number
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

export const columns = (
  // updateEvent: (
  //   id: number,
  //   organiserId: number,
  //   updateData: object
  // ) => Promise<void>,
  deleteEvent: (id: number, organiserId: number) => Promise<void>
): ColumnDef<Events, EventValue>[] => [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "event_name",
    header: "Event Name",
    accessorFn: (event: Events) => event.event_name,
  },
  // {
  //   accessorKey: "event_overview",
  //   header: "Event Overview",
  // },
  // {
  //   accessorKey: "location",
  //   header: "Location",
  // },
  {
    accessorKey: "date",
    header: "Date",
    accessorFn: (event: Events) => event.date,
  },
  {
    accessorKey: "time",
    header: "Time",
    accessorFn: (event: Events) => event.time,
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated At",
  // },
  {
    accessorKey: "price",
    header: "Price",
    accessorFn: (event: Events) => event.price,
  },
  // {
  //   accessorKey: "organiser_email",
  //   header: "Organiser Email",
  // },

  {
    id: "actions",
    cell: (cell) => {
      const event = cell.row.original;

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
            // onClick={async () => {
            //   await updateEvent(event.id, event.organiser_id, updateData);
            // }}
            >
              Update Event Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () =>
                await deleteEvent(event.id, event.organiser_id)
              }
            >
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
