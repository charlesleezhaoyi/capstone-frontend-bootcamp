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
  const fetchEventsByNpoId = async (npoId: number) => {
    const fetchedEvents = await fetch(
      process.env.REACT_APP_BACKEND_URL! + "/npoEvents/" + npoId + "/events/",
      {
        method: "GET",
      }
    );
    const fetchedEventsData = await fetchedEvents.json();
    return fetchedEventsData;
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

  return { fetchEventById, fetchEventsByNpoId };
};
