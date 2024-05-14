import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, ReactNode } from "react";

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

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // If the user is not authenticated, we start the login process
        loginWithRedirect();
      } else if (user && user.email) {
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  ]);

  return isAuthenticated ? children : null;
};

export default AuthWrapper;
