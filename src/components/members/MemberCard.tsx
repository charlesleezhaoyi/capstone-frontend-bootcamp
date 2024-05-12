import React, { FC, useEffect, useState } from "react";
import { Member } from "../../hooks/useMembers";

import defaultUserImg from "../images/defaultUser.png";
import { Card, CardHeader, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";

interface MemberProps {
  member: Member;
}

export const MemberCard: FC<MemberProps> = (props) => {
  const { full_name, occupation, employee_at, display_img_url } = props.member;
  const roleName = props.member.npoMembers[0].roles.name;
  const [profileImg, setProfileImg] = useState<string>();

  useEffect(function loadProfileImg() {
    console.log(display_img_url);
    setProfileImg(display_img_url);
  }, []);

  const loadFallbackImg = () => {
    setProfileImg(defaultUserImg);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="h-fit">
          <CardHeader>
            <div className="aspect-square overflow-clip flex flex-row items-center justify-center">
              <img
                className="h-full w-full object-cover rounded-md"
                alt="User Profile"
                src={profileImg}
                onError={loadFallbackImg}
              />
            </div>
          </CardHeader>
          <CardFooter className="flex flex-col">
            <h3>{full_name}</h3>
            <span>{roleName}</span>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent closeButton={false}>
        <DialogHeader className="flex flex-row">
          <div className="md:h-40 h-28 md:w-40 w-28 flex flex-row items-center justify-center">
            <img
              className="h-full w-full object-cover rounded-md"
              alt="User Profile"
              src={profileImg}
              onError={loadFallbackImg}
            />
          </div>
          <div className="ml-5">
            <h3 className="md:mt-7">{full_name}</h3>
            <div className="md:mt-4 text-left">{roleName}</div>
          </div>
        </DialogHeader>
        <div className="flex -flex-row flex-wrap gap-5">
          <div>
            <span className="font-bold">Occupation: </span>
            {occupation}
          </div>
          <div>
            <span className="font-bold">Employed At: </span>
            {employee_at}
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="flex flex-row justify-center w-full">
            <Button className="text-white">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
