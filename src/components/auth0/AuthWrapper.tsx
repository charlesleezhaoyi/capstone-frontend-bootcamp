import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, ReactNode } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [isLoadingPage, setIsLoadingPage] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (isAuthenticated) {
          if (user && user.email && user.email_verified) {
            const getMemberId = await axios.post(
              "http://localhost:3001/members/retrieve",
              {
                email: user.email,
              }
            );
            const output = await axios.post(
              "http://localhost:3001/npoMembers/",
              {
                member_id: getMemberId.data.data,
              }
            );
            loginUserContext(
              getMemberId.data.data,
              output.data[0].role_id,
              output.data[0].npo_id
            );
          }
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };

    if (!isLoading) {
      if (!isAuthenticated) {
        loginWithRedirect();
      } else if (user && !user.email_verified) {
        setIsLoadingPage(false);
        navigate("/individual-onboarding");
      } else if (user && user.email_verified) {
        getAccessTokenSilently();
        checkUser();
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
