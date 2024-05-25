import { useUser } from "../UserContext";
import { useState } from "react";
import axios from "axios";

interface Member {
  id: number;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  occupation: string;
  employee_at: string;
  email: string;
  cv_url: string;
  portfolio_link_url: string;
  display_img_url: string;
  is_onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Event {
  id: number;
  organiser_id: number;
  npo_id: number;
  event_overview: string;
  event_name: string;
  event_photo_url?: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  organiser: Member;
}

export const useEvents = () => {
  const { userNpo } = useUser();
  const [rsvpStatus, setRsvpStatus] = useState<Record<number, boolean>>({});
  const fetchEventsByNpoId = async () => {
    // Not working on initial render
    if (userNpo) {
      const fetchedEvents = await fetch(
        process.env.REACT_APP_BACKEND_URL! +
          "/npoEvents/" +
          userNpo +
          "/events/",
        {
          method: "GET",
        }
      );
      const fetchedEventsData = await fetchedEvents.json();
      return fetchedEventsData;
    }
  };

  const fetchEventById = async (eventId: number) => {
    const fetchedEvent = await fetch(
      process.env.REACT_APP_BACKEND_URL! + "/npoEvents/" + eventId,
      {
        method: "GET",
      }
    );
    const fetchedEventData = await fetchedEvent.json();
    return fetchedEventData;
  };

  const rsvpToEvent = async (eventId: number, memberId: number) => {
    const rsvpedEvent = await axios.post(
      process.env.REACT_APP_BACKEND_URL! + "/eventMembers/rsvpEvent",
      {
        member_id: memberId,
        event_id: eventId,
      }
    );
    setRsvpStatus((prevStatus) => ({ ...prevStatus, [eventId]: true }));
  };

  const removeRsvpToEvent = async (eventId: number, memberId: number) => {
    const removedRsvpedEvent = await axios.post(
      process.env.REACT_APP_BACKEND_URL! + "/eventMembers/removeRsvpEvent",
      {
        member_id: memberId,
        event_id: eventId,
      }
    );
    setRsvpStatus((prevStatus) => ({ ...prevStatus, [eventId]: false }));
  };

  const checkRsvpToEvent = async (eventId: number, memberId: number) => {
    const setRsvpStatus = await axios.post(
      process.env.REACT_APP_BACKEND_URL! + "/eventMembers/checkRSVPStatus",
      {
        member_id: memberId,
        event_id: eventId,
      }
    );
  };

  return {
    fetchEventById,
    fetchEventsByNpoId,
    rsvpToEvent,
    removeRsvpToEvent,
    rsvpStatus,
    checkRsvpToEvent,
  };
};
