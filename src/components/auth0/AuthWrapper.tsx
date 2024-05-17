import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, ReactNode } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";

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
  const [isLoadingPage, setIsLoadingPage] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // If the user is not authenticated, we start the login process
        loginWithRedirect();
      } else if (user && !user.email_verified) {
        setIsLoadingPage(true);
        navigate("/individual-onboarding");
      } else if (user && user.email_verified) {
        getAccessTokenSilently();
        loginUserContext(user.id);
        setIsLoadingPage(false);
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
    loginUserContext,
    navigate,
  ]);

  if (isLoadingPage) {
    return <h1>Loading...</h1>;
  }

  return isAuthenticated ? children : null;
};

export default AuthWrapper;
