import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { useUser } from "../../UserContext";
import axios from "axios";

const LoginButton = ({ npo_name }: { npo_name: string }) => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { loginUserContext } = useUser();

  const login = (npo_name: string) => {
    loginWithRedirect({
      appState: { targetUrl: `/${npo_name}/events ` },
    });
    checkUser();
  };

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
          const output = await axios.post("http://localhost:3001/npoMembers/", {
            member_id: getMemberId.data.data,
          });
          loginUserContext(
            getMemberId.data.data,
            output.data[0].npo_id,
            output.data[0].role_id
          );
        }
      }
    } catch (error) {
      console.error("Error during login process:", error);
    }
  };

  return (
    <Button variant="ghost" className="w-full" onClick={() => login(npo_name)}>
      Login
    </Button>
  );
};

export default LoginButton;
