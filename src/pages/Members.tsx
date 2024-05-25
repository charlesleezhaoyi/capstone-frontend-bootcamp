import React, { FC } from "react";
import { NonAdminMemberView } from "../components/members/NonAdminMemberView";
import { AdminMemberView } from "../components/members/AdminMemberView";
import { useUser } from "../UserContext";

export const Members: FC = () => {
  const { userRole } = useUser();
  return userRole < 3 ? <AdminMemberView /> : <NonAdminMemberView />;
};
