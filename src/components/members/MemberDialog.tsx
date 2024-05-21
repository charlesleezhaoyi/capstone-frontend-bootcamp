import React, { FC, ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

import { type Member } from "@/src/hooks/useMembers";
import { ImageWithFallback } from "./ImageWithFallback";

interface MemberDialogProps {
  data: Member;
  children: ReactNode;
}

export const MemberDialog: FC<MemberDialogProps> = ({
  data,
  children,
}: MemberDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className="text-primary flex justify-center w-full">
        {children}
      </DialogTrigger>
      <DialogContent closeButton={false}>
        <DialogHeader className="flex flex-row">
          <div className="md:h-40 h-28 md:w-40 w-28 flex flex-row items-center justify-center">
            <ImageWithFallback
              src={data.display_img_url}
              alt="Member Profile"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="ml-5">
            <h3 className="md:mt-7">{data.full_name}</h3>
            <div className="md:mt-4 text-left">
              {data.npoMembers[0].roles.name}
            </div>
          </div>
        </DialogHeader>

        <DialogFooter>
          <DialogClose className="flex flex-row justify-center w-full">
            <Button className="text-white">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
