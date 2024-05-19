import React, { FC } from "react";
import { NonAdminMemberView } from "../components/members/NonAdminMemberView";
import { AdminMemberView } from "../components/members/AdminMemberView";

const isAdmin = true;

export const Members: FC = () => {
  return isAdmin ? <AdminMemberView /> : <NonAdminMemberView />;
};
