import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    authorizationParams={{
      redirect_uri: "http://localhost:3000/events",
      audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
      scope:
        "openid profile email read:current_user update:current_user_metadata",
    }}
    // redirect_uri= "http://localhost:3000/events" // Remove this line
    // useRefreshTokens={true}
    // cacheLocation="localstorage"
  >
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
