import React, { FC, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export const Events: FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!isAuthenticated) {
  //       loginWithRedirect();
  //     }
  //   }
  // }
  // , [isAuthenticated, isLoading, loginWithRedirect]);

  const [isLoadingPage, setIsLoadingPage] = React.useState(true);

  useEffect(() => {
    console.log(user);
    if (user && user.email && !user.email_verified) {
      setIsLoadingPage(true);
      navigate("/individual-onboarding");
    } else {
      setIsLoadingPage(false);
    }
  }, [user, navigate]);

  if (isLoadingPage) {
    return <h1>Loading...</h1>;
  }

  return <h1 className="bg-gray-600 w-full text-white">Events</h1>;
};
