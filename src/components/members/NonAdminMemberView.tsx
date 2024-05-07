import React, { FC } from "react";
import { useMembers } from "../../hooks/useMembers";

export const NonAdminMemberView: FC = () => {
  const { fetchMembersByNpoId } = useMembers();
  fetchMembersByNpoId(1);

  return <h1>Members</h1>;
};
