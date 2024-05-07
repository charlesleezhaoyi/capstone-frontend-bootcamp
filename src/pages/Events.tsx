import React, { FC } from "react";
import LoginButton from "../components/auth0/LoginButton";
import LogoutButton from "../components/auth0/LogoutButton";
import { Auth0Provider } from "@auth0/auth0-react";

export const Events: FC = () => {
  return (
    <h1 className="bg-gray-600 w-full text-white">
      Events
      <Auth0Provider
        domain="dev-75ifw6lzojcgig6l.us.auth0.com"
        clientId="REAZfqYGbS9C1CyIACzjDbNbtUSPEnzo"
      >
        <LoginButton />
        <LogoutButton />
      </Auth0Provider>
    </h1>
  );
};
