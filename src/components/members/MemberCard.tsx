import React, { FC } from "react";
import { Member } from "../../hooks/useMembers";

import { Card, CardHeader, CardFooter } from "../ui/card";

import { MemberDialog } from "./MemberDialog";
import { ImageWithFallback } from "./ImageWithFallback";
import defaultUserImg from "../../assets/defaultUser.png";

interface MemberProps {
  member: Member;
}

export const MemberCard: FC<MemberProps> = ({ member }: MemberProps) => {
  const { full_name, display_img_url } = member;
  const roleName = member.npoMembers[0].roles.name;

  return (
    <MemberDialog data={member} isAdmin={false}>
      <Card className="h-fit">
        <CardHeader>
          <div className="aspect-square overflow-clip flex flex-row items-center justify-center">
            <ImageWithFallback
              className="h-full w-full object-cover rounded-md"
              alt="User Profile"
              src={display_img_url}
              fallback={defaultUserImg}
            />
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col">
          <h3>{full_name}</h3>
          <span>{roleName}</span>
        </CardFooter>
      </Card>
    </MemberDialog>
  );
};
