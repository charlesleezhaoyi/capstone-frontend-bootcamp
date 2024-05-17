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
      process.env.REACT_APP_BACKEND_URL! + "/events/" + npoId,
      {
        method: "GET",
      }
    );
    const fetchedEventsData = await fetchedEvents.json();
    return fetchedEventsData;
  };

  return { fetchEventsByNpoId };
};
