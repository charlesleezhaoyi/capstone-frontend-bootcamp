import React, { FC, useEffect, useState, ReactNode } from "react";
import { useEvents, type Event } from "../hooks/useEvents";
import { useParams } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import { CalendarClock } from "lucide-react";

const defaultEventImage = (
  <div className="bg-secondary-background flex justify-center items-center p-5 rounded-md h-full w-full">
    <PartyPopper className="w-1/2 h-1/2 block" color="grey" />
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
        <img
          src={event.event_photo_url}
          alt="event banner"
          onError={setEventImageToDefault}
          className="rounded-lg"
        />
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-full w-full border-l-2 border-secondary overflow-scroll">
      <div>
        <div className="flex items-center justify-center rounded-lg h-52 overflow-hidden m-10">
          {eventImageElement}
        </div>
        <div className="grid gap-5 pl-10 mb-10">
          <div>
            <span>{event && new Date(event?.date).toLocaleDateString()}</span>
            <h1>{event?.event_name}</h1>
            <span>{event?.event_overview}</span>
          </div>
          <div>
            <h5>Date and Time</h5>
            <div className="flex flex-row items-center gap-3 mt-2">
              <CalendarClock />
              <span>{event && new Date(event?.date).toLocaleString()}</span>
            </div>
          </div>
          <div>
            <h5>Location</h5>
            <span>{event?.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
