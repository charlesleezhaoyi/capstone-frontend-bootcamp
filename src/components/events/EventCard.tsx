import React, { FC, ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { PartyPopper } from "lucide-react";
import { Event, useEvents } from "../../hooks/useEvents";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { useUser } from "../../UserContext";

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
  const { rsvpToEvent, removeRsvpToEvent } = useEvents();
  const setEventImageToDefault = () => {
    setEventImageElement(defaultEventImage);
  };
  const { userId, rsvpedEvents, addToRsvpedEvents, removeRsvpedEvents } =
    useUser();

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

  const hasRSVPed = rsvpedEvents.some((event) => event.id === id);

  const handleRsvpClick = async () => {
    try {
      await rsvpToEvent(id, userId);
      addToRsvpedEvents(id);
    } catch (error) {}
  };

  const handleRemoveRsvpClick = async () => {
    try {
      await removeRsvpToEvent(id, userId);
      removeRsvpedEvents(id);
    } catch (error) {}
  };

  return (
    <Card>
      {navigateToEventPage && (
        <Navigate to={checkPathBeforeAppend(pathname) + id} />
      )}
      <CardHeader onClick={() => setNavigateToEventPage(true)}>
        <CardTitle onClick={() => setNavigateToEventPage(true)}>
          {event_name}
        </CardTitle>
        <CardDescription onClick={() => setNavigateToEventPage(true)}>
          {event_overview}
        </CardDescription>
      </CardHeader>
      <CardContent
        className="flex flex-col"
        onClick={() => setNavigateToEventPage(true)}
      >
        <div className="h-24 overflow-hidden rounded-md flex flex-row items-center justify-center">
          {eventImageElement}
        </div>
        <div className="h-40">
          <div className="mt-3">
            When: {new Date(date).toLocaleDateString() + " " + time}
          </div>
          <div className="mt-3">Where: {location}</div>
          <div className="mt-3">Fee: ${price}</div>
          <div className="mt-3">Coming: 10 Tentative: 2</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={`text-right w-full ${
            hasRSVPed
              ? "text-black bg-white hover:bg-white"
              : "text-white bg-black hover:bg-black"
          }`}
          onClick={hasRSVPed ? handleRemoveRsvpClick : handleRsvpClick}
        >
          {hasRSVPed ? "I'm not going" : "I'm going"}
        </Button>
      </CardFooter>
    </Card>
  );
};
