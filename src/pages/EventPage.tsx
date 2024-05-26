import React, { FC, useEffect, useState, ReactNode } from "react";
import { useEvents, type Event, type EventMembers } from "../hooks/useEvents";
import { useUser } from "../UserContext";
import { useParams } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import { CalendarClock } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/members/ImageWithFallback";
import defaultUserImg from "../assets/defaultUser.png";

const defaultEventImage = (
  <div className="bg-secondary-background flex justify-center items-center p-5 rounded-md h-full w-full">
    <PartyPopper className="w-1/2 h-1/2 block" color="grey" />
  </div>
);

export const EventPage: FC = () => {
  const [event, setEvent] = useState<Event>();
  const [attendees, setAttendees] = useState<ReactNode[]>([]);
  const [rsvpCount, setRsvpCount] = useState(null);
  const [eventImageElement, setEventImageElement] = useState<
    ReactNode | undefined
  >(defaultEventImage);
  const { eventId } = useParams();
  const { userId, rsvpedEvents, addToRsvpedEvents, removeRsvpedEvents } =
    useUser();
  const {
    rsvpToEvent,
    removeRsvpToEvent,
    countRsvpGivenEventId,
    fetchEventById,
    fetchEventAttendeesById,
  } = useEvents();

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

  const hasRSVPed = rsvpedEvents.some((event) => event.id === Number(eventId));

  const handleRsvpClick = async () => {
    try {
      await rsvpToEvent(Number(eventId), userId);
      addToRsvpedEvents(Number(eventId));
    } catch (error) {}
  };

  const handleRemoveRsvpClick = async () => {
    try {
      await removeRsvpToEvent(Number(eventId), userId);
      removeRsvpedEvents(Number(eventId));
    } catch (error) {}
  };

  useEffect(() => {
    const fetchRsvpCount = async () => {
      const rsvpCount = await countRsvpGivenEventId(Number(eventId));
      setRsvpCount(rsvpCount);
    };

    fetchRsvpCount();
  }, [hasRSVPed, rsvpedEvents, removeRsvpToEvent]);

  const fetchEventAsync = async () => {
    try {
      const fetchedEvent = await fetchEventById(Number(eventId));
      setEvent(fetchedEvent);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEventAttendeesAsync = async () => {
    try {
      const fetchedAttendees = await fetchEventAttendeesById(Number(eventId));
      const fetchedAttendeesDisplay = fetchedAttendees.map(
        (attendee: EventMembers) => (
          <div className="flex flex-row items-center">
            <ImageWithFallback
              src={attendee.members.display_img_url}
              alt="navbar profile"
              fallback={defaultUserImg}
              className="h-8 w-8 inline-block mr-3"
            />
            <span>{attendee.members.full_name}</span>
          </div>
        )
      );
      setAttendees(fetchedAttendeesDisplay);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEventAttendeesAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRSVPed]);

  return (
    <div className="min-h-full w-full border-l-2 border-secondary py-10">
      <div className="flex items-center justify-center rounded-lg h-52 overflow-hidden mx-10 mb-10">
        {eventImageElement}
      </div>
      <div className="grid gap-5 px-10">
        <div>
          <span>{event && new Date(event?.date).toLocaleDateString()}</span>
          <div className="flex flex-row justify-between w-full">
            <h1 className="inline">{event?.event_name}</h1>

            <Button
              className={`text-right inline ${
                hasRSVPed
                  ? "text-black bg-white hover:bg-white"
                  : "text-white bg-black hover:bg-black"
              }`}
              onClick={hasRSVPed ? handleRemoveRsvpClick : handleRsvpClick}
            >
              {hasRSVPed ? "I'm not going" : "I'm going"}
            </Button>
          </div>
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
        {attendees.length > 0 && (
          <div>
            <div className="mb-2">
              <h5 className="inline mr-3">Attendees</h5>
              <span>Going: {rsvpCount}</span>
            </div>
            {attendees}
          </div>
        )}
      </div>
    </div>
  );
};
