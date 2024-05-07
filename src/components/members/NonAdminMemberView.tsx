import React, { FC } from "react";
import { useMembers } from "../../hooks/useMembers";
import { Card, CardHeader, CardFooter } from "../ui/card";

export const NonAdminMemberView: FC = () => {
  const { fetchMembersByNpoId } = useMembers();
  fetchMembersByNpoId(1);

  return (
    <div className="bg-gray-500 w-full">
      <Card>
        <CardHeader></CardHeader>
      </Card>
    </div>
  );
};
