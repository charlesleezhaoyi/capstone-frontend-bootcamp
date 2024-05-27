import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";

interface Event {
  id: number;
}

interface Member {
  id: number;
  full_name: string;
  date_of_birth: Date;
  gender: string;
  occupation: string;
  employee_at?: string;
  email: string;
  cv_url?: string | undefined;
  portfolio_link_url?: string | undefined;
  display_img_url?: string | undefined;
  is_onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserContextType {
  userId: number;
  userRole: number;
  userNpo: number;
  // userNpoName: string;
  rsvpedEvents: Event[];
  userInfo: Member | undefined;
  loginUserContext: (
    id: number,
    role: number,
    npo: number,
    // npoName: string,
    info?: Member
  ) => void;
  logoutUserContext: () => void;
  addToRsvpedEvents: (eventId: number) => void;
  removeRsvpedEvents: (eventId: number) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: FunctionComponent<UserProviderProps> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number>(0);
  const [userRole, setUserRole] = useState<number>(0);
  const [userNpo, setUserNpo] = useState<number>(0);
  // const [userNpoName, setUserNpoName] = useState<string>("");
  const [userInfo, setUserInfo] = useState<Member | undefined>({
    id: 0,
    full_name: "",
    date_of_birth: new Date(),
    gender: "",
    occupation: "",
    employee_at: "",
    email: "",
    cv_url: "",
    portfolio_link_url: "",
    display_img_url: "",
    is_onboarded: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [rsvpedEvents, setRsvpedEvents] = useState<Event[]>([]);

  const loginUserContext = (
    id: number,
    role: number,
    npo: number,
    // npoName: string,
    info?: Member
  ): void => {
    console.log("context updated");
    setUserId(id);
    setUserRole(role);
    setUserNpo(npo);
    // setUserNpoName(npoName);
    setUserInfo(info);
  };

  const logoutUserContext = (): void => {
    setUserId(0);
    setUserRole(0);
    setUserNpo(0);
    // setUserNpoName("");
    setUserInfo(undefined);
  };

  const addToRsvpedEvents = (eventId: number): void => {
    setRsvpedEvents((prevEventIds: Event[]) => [
      ...prevEventIds,
      { id: eventId },
    ]);
  };

  const removeRsvpedEvents = (eventId: number): void => {
    setRsvpedEvents((prevEventIds: Event[]) =>
      prevEventIds.filter((event) => event.id !== eventId)
    );
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        userRole,
        userNpo,
        // userNpoName,
        userInfo,
        rsvpedEvents,
        addToRsvpedEvents,
        removeRsvpedEvents,
        loginUserContext,
        logoutUserContext,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
