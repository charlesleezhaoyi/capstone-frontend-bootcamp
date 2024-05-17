import React, { FC, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export const Events: FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return <h1 className="bg-gray-600 w-full text-white">Events</h1>;
};
