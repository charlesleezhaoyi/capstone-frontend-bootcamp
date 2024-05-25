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

interface UserContextType {
  userId: number;
  userRole: number;
  userNpo: number;
  rsvpedEvents: Event[];
  loginUserContext: (id: number, role: number, npo: number) => void;
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
  const [rsvpedEvents, setRsvpedEvents] = useState<Event[]>([]);

  const loginUserContext = (id: number, role: number, npo: number): void => {
    setUserId(id);
    setUserRole(role);
    setUserNpo(npo);
  };

  const logoutUserContext = (): void => {
    setUserId(0);
    setUserRole(0);
    setUserNpo(0);
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
