import React, { FC, useEffect, useState, ReactNode } from "react";
import { useEvents, type Event } from "../hooks/useEvents";
import { useParams } from "react-router-dom";
import { PartyPopper } from "lucide-react";

const defaultEventImage = (
  <div className="bg-secondary-background flex justify-center p-5 rounded-md">
    <PartyPopper className="w-1/3 h-1/3 block" color="grey" />
  </div>
);

export const EventPage: FC = () => {
  const [event, setEvent] = useState<Event>();
  const { npoId, eventId } = useParams();
  const { fetchEventById } = useEvents();

  const [eventImageElement, setEventImageElement] = useState<
    ReactNode | undefined
  >(defaultEventImage);

  const setEventImageToDefault = () => {
    setEventImageElement(defaultEventImage);
  };

  const loadEventImageElement = () => {
    console.log(event?.event_photo_url);
    if (event?.event_photo_url) {
      setEventImageElement(
        <div className="flex items-center justify-center p-10">
          <img
            src={event.event_photo_url}
            alt="event banner"
            onError={setEventImageToDefault}
            className="rounded-lg"
          />
        </div>
      );
    }
  };

  useEffect(() => loadEventImageElement(), [event]);

  const fetchEventsAsync = async () => {
    try {
      const fetchedEvent = await fetchEventById(Number(eventId));
      setEvent(fetchedEvent);
      console.log(fetchedEvent);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventsAsync();
  }, []);

  return (
    <div className="min-h-full w-full border-t-2 border-l-2 border-secondary">
      {eventImageElement}
      <h1>npo id: {npoId}</h1>
      <h1>event id {eventId}</h1>
    </div>
  );
};
