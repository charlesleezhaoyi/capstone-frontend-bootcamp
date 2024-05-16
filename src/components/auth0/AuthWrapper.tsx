import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, ReactNode } from "react";
import { useUser } from "@/src/UserContext";

interface AuthWrapperProps {
  children: React.ReactElement | null;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children = null }) => {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const { loginUserContext } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // If the user is not authenticated, we start the login process
        loginWithRedirect();
      } else if (user && user.email_verified) {
        // If the user is authenticated, we check if the email is verified
        getAccessTokenSilently();
        loginUserContext(user.id);
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
    loginUserContext,
  ]);

  return isAuthenticated ? children : null;
};

export default AuthWrapper;
