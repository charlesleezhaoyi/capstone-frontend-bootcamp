import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";

interface UserContextType {
  userId: string;
  loginUserContext: (id: string) => void;
  logoutUserContext: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: FunctionComponent<UserProviderProps> = ({
  children,
}) => {
  const [userId, setUserId] = useState("");

  const loginUserContext = (id: string) => {
    setUserId(id);
  };

  const logoutUserContext = () => {
    setUserId("");
  };

  return (
    <UserContext.Provider
      value={{ userId, loginUserContext, logoutUserContext }}
    >
      {children}
    </UserContext.Provider>
  );
};
