import React from "react";
import { User, useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import axios from "axios";

interface VerifyEmailButtonProps {
  disabled: boolean;
}

const VerifyEmailButton: React.FC<VerifyEmailButtonProps> = ({ disabled }) => {
  const { user } = useAuth0();
  const [sentVerifyEmail, setSentVerifyEmail] = React.useState<boolean>(false);

  const requestAuth0ExplorerToken = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_AUTH0_ENDPOINT_URL ?? "",
        {
          client_id: process.env.REACT_APP_AUTH0_API_EXPLORER_CLIENT_ID,
          client_secret: process.env.REACT_APP_AUTH0_API_CLIENT_SECRET,
          audience: process.env.REACT_APP_AUTH0_API_EXPLORER_AUDIENCE,
          grant_type: "client_credentials",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("token retrieved", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendVerificationEmail = async (user: User | undefined) => {
    console.log("Sending verification email to user", user);

    if (!user) {
      throw new Error("User is not authenticated");
    }

    if (user.email_verified) {
      console.log("User is already verified");
      return;
    }

    const url = process.env.REACT_APP_AUTH0_EMAIL_ENDPOINT_URL;
    if (!url) {
      throw new Error("REACT_APP_AUTH0_EMAIL_ENDPOINT_URL is not defined");
    }

    try {
      const token = await requestAuth0ExplorerToken();
      if (!token || !token.access_token) {
        throw new Error("Token or access token is not defined");
      }

      let data = JSON.stringify({
        user_id: user.sub,
        client_id: process.env.REACT_APP_AUTH0_API_EXPLORER_CLIENT_ID,
      });

      console.log(token.access_token, data);

      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      setSentVerifyEmail(true);

      setTimeout(() => {
        setSentVerifyEmail(false);
      }, 500000);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <Button
      variant="secondary"
      className="flex flex-col py-2 px-8 space-y-8 font-normal text-white mx-8"
      onClick={() => sendVerificationEmail(user)}
      disabled={sentVerifyEmail}
    >
      Resend Verification Email
    </Button>
  );
};

export default VerifyEmailButton;
