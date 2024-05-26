import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, ReactNode } from "react";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../ui/dialog";
import axios from "axios";
import { NPOSelectionDialog } from "../NPOSelectionDialog";
import { get } from "http";

interface AuthWrapperProps {
  children: React.ReactElement | null;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children = null }) => {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const { loginUserContext, userId, userNpo, userRole } = useUser();
  const [isLoadingPage, setIsLoadingPage] = React.useState(false);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [userSelectedNpo, setUserSelectedNpo] = React.useState(0);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (isAuthenticated) {
          if (user && user.email && user.email_verified) {
            const memberInfo = await axios.post(
              "http://localhost:3001/members/retrieve",
              {
                email: user.email,
              }
            );
            loginUserContext(memberInfo.data.data.id, 0, 0, "");
            const npos = await axios.post("http://localhost:3001/npoMembers/", {
              member_id: memberInfo.data.data.id,
            });
            if (npos.data.length > 1) {
              //NPOSelectionDialog is not tested
              setIsDialogOpen(true);
            } else {
              const role = await axios.post(
                "http://localhost:3001/npoMembers/getNpoMembersRole",
                {
                  member_id: memberInfo.data.data.id,
                  npo_id: npos.data[0].npo_id,
                }
              );
              loginUserContext(
                memberInfo.data.data.id,
                role.data[0].role_id,
                npos.data[0].npo_id,
                memberInfo.data.data
              );
            }
          }
        }
      } catch (error) {
        console.error("Error during login process:", error);
      }
    };

    if (!isLoading) {
      if (!isAuthenticated) {
        loginWithRedirect();
      } else if (user && !user.email_verified) {
        setIsLoadingPage(false);
        navigate("/individual-onboarding");
      } else if (user && user.email_verified) {
        getAccessTokenSilently();
        checkUser();
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
    navigate,
  ]);

  useEffect(() => {
    if (userSelectedNpo && user && user.email) {
      const fetchRoleAndLogin = async () => {
        const memberInfo = await axios.post(
          "http://localhost:3001/members/retrieve",
          {
            email: user.email,
          }
        );
        const role = await axios.post(
          "http://localhost:3001/npoMembers/getNpoMembersRole",
          {
            member_id: memberInfo.data.data.id,
            npo_id: userSelectedNpo,
          }
        );
        loginUserContext(
          memberInfo.data.data.id,
          role.data.data[0].role_id,
          userSelectedNpo,
          memberInfo.data.data
        );
      };
      fetchRoleAndLogin();
    }
  }, [userSelectedNpo, user, loginUserContext]);

  if (isLoadingPage) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {isAuthenticated ? children : null}
      <NPOSelectionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onNPOSelect={(npoId) => {
          setUserSelectedNpo(npoId);
        }}
      />
    </>
  );
};

export default AuthWrapper;
