import React, { FC, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const Events: FC = () => {
  // const { isAuthenticated, user } = useAuth0();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated || !user?.email_verified) {
  //     navigate("/onboarding");
  //   }
  // });

  return <h1 className="bg-gray-600 w-full text-white">Events</h1>;
};
