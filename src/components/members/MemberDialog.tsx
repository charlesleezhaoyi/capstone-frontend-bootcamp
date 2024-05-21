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
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-start">
            <div className="font-bold">Occupation</div>
            <div>{data.occupation}</div>
          </div>
          <div className="flex flex-col justify-start">
            <div className="font-bold">Email</div>
            <div>{data.email}</div>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          {data.npoMembers[0].open_ended_ans_1 && (
            <div>
              <div className="font-bold">
                {data.npoMembers[0].npos.open_ended_qn_1}
              </div>
              <div>{data.npoMembers[0].open_ended_ans_1}</div>
            </div>
          )}
          {data.npoMembers[0].open_ended_ans_2 && (
            <div>
              <div className="font-bold">
                {data.npoMembers[0].npos.open_ended_qn_2}
              </div>
              <div>{data.npoMembers[0].open_ended_ans_2}</div>
            </div>
          )}
          {data.npoMembers[0].open_ended_ans_3 && (
            <div>
              <div className="font-bold">
                {data.npoMembers[0].npos.open_ended_qn_3}
              </div>
              <div>{data.npoMembers[0].open_ended_ans_3}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose className="flex flex-row justify-center w-full" asChild>
            <div>
              <Button className="text-white md:w-20 w-14">Close</Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
