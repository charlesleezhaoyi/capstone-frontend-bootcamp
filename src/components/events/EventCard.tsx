import React, { FC, ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { PartyPopper } from "lucide-react";
import { Event } from "@/src/hooks/useEvents";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";

const defaultEventImage = (
  <div className="bg-secondary-background flex justify-center items-center p-5 h-full w-full">
    <PartyPopper className="w-full h-full block" color="grey" />
  </div>
);

interface EventProps {
  event: Event;
}

export const EventCard: FC<EventProps> = (props) => {
  const {
    id,
    event_overview,
    event_name,
    event_photo_url,
    date,
    time,
    location,
    price,
  } = props.event;
  const [eventImageElement, setEventImageElement] = useState<
    ReactNode | undefined
  >(defaultEventImage);
  const [navigateToEventPage, setNavigateToEventPage] =
    useState<boolean>(false);
  const { pathname } = useLocation();
  const setEventImageToDefault = () => {
    setEventImageElement(defaultEventImage);
  };

  const loadEventImageElement = () => {
    if (event_photo_url) {
      setEventImageElement(
        <img
          src={event_photo_url}
          alt="event banner"
          onError={setEventImageToDefault}
        />
      );
    }
  };

  useEffect(() => loadEventImageElement(), []);

  const checkPathBeforeAppend = (path: string) => {
    const lastChar = path[path.length - 1];
    if (lastChar === "/") {
      return path;
    }
    return path + "/";
  };

  return (
    <Card onClick={() => setNavigateToEventPage(true)}>
      {navigateToEventPage && (
        <Navigate to={checkPathBeforeAppend(pathname) + id} />
      )}
      <CardHeader>
        <CardTitle>{event_name}</CardTitle>
        <CardDescription>{event_overview}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="h-24 overflow-hidden rounded-md flex flex-row items-center justify-center">
          {eventImageElement}
        </div>
        <div className="h-40">
          <div className="mt-3">
            When: {new Date(date).toLocaleDateString() + " " + time}
          </div>
          <div className="mt-3">Where: {location}</div>
          <div className="mt-3">Fee: ${price}</div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-right w-full border-t-2 pt-6">
          Coming: 10 Tentative: 2
        </div>
      </CardFooter>
    </Card>
  );
};
