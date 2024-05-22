import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";

interface UserContextType {
  userId: string;
  userRole: string;
  userNpo: string;
  loginUserContext: (id: string, role: string, npo: string) => void;
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
  const [userRole, setUserRole] = useState("");
  const [userNpo, setUserNpo] = useState("");

  const loginUserContext = (id: string, role: string, npo: string) => {
    setUserId(id);
    setUserRole(role);
    setUserNpo(npo);
  };

  const logoutUserContext = () => {
    setUserId("");
    setUserRole("");
    setUserNpo("");
  };

  return (
    <UserContext.Provider
      value={{ userId, userRole, userNpo, loginUserContext, logoutUserContext }}
    >
      {children}
    </UserContext.Provider>
  );
};
