import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => loginWithRedirect()}
    >
      Login
    </Button>
  );
};

export default LoginButton;
