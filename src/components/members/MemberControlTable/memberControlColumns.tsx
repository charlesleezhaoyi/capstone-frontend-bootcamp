import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PenLine } from "lucide-react";
import { type Member } from "@/src/hooks/useMembers";
import { MemberDialog } from "../MemberDialog";
import { ImageWithFallback } from "../ImageWithFallback";
import defaultUserImg from "../../../assets/defaultUser.png";

export type MemberColumnAttributes = {
  display_pic_url: string | undefined;
  name: string;
  role: string;
  data: Member;
  memberObjectSetter?: React.Dispatch<React.SetStateAction<Member[]>>;
};

export const columns: ColumnDef<MemberColumnAttributes>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div>
          <ImageWithFallback
            src={row.original.display_pic_url}
            alt="navbar profile"
            fallback={defaultUserImg}
            className="h-8 w-8 inline-block mr-3 rounded-md"
          />
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="text-right">Role</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("role")}</div>,
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const data: Member = row.original.data;
      const memberObjectSetter:
        | React.Dispatch<React.SetStateAction<Member[]>>
        | undefined = row.original.memberObjectSetter;

      return (
        <MemberDialog
          data={data}
          isAdmin={true}
          memberObjectSetter={memberObjectSetter}
        >
          <div>
            <PenLine />
          </div>
        </MemberDialog>
      );
    },
  },
];
