import React, { FC, useState } from "react";
import { NonAdminMemberView } from "../components/members/NonAdminMemberView";
import { AdminMemberView } from "../components/members/AdminMemberView";
import { useUser } from "../UserContext";

const isCurrentUserAdmin = true;

export const Members: FC = () => {
  const [isAdmin, setAdmin] = useState<boolean>(isCurrentUserAdmin);
  return isAdmin ? <AdminMemberView /> : <NonAdminMemberView />;
};
