import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { useUser } from "../../UserContext";

const LoginButton = ({ npoId }: { npoId: string }) => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  // const { loginUserContext } = useUser();

  const login = (npoId: string) => {
    loginWithRedirect({
      appState: { targetUrl: `/${npoId}/events ` },
    });
  };

  // const checkUser = async () => {
  //   try {
  //     if (isAuthenticated) {
  //       if (user) {
  //         console.log(user.email);
  //         const response = await fetch(
  //           process.env.REACT_APP_BACKEND_URL + `/members/retrieve`,
  //           {
  //             method: "POST",
  //             body: JSON.stringify({
  //               email: user.email,
  //             }),
  //             headers: {
  //               "Content-type": "application/json; charset=UTF-8",
  //             },
  //           }
  //         );
  //         console.log(response);
  //         // loginUserContext(response);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error during login process:", error);
  //   }
  // };

  // useEffect(() => {
  //   checkUser();
  // }, [isAuthenticated]);

  return (
    <Button variant="ghost" className="w-full" onClick={() => login(npoId)}>
      Login
    </Button>
  );
};

export default LoginButton;
