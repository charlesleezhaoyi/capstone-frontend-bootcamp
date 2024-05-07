import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "../../App";

const root = createRoot(document.getElementById("root")!);

root.render(
  <Auth0Provider
    domain="dev-75ifw6lzojcgig6l.us.auth0.com"
    clientId="REAZfqYGbS9C1CyIACzjDbNbtUSPEnzo"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
