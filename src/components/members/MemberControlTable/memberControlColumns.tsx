import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PenLine } from "lucide-react";
import { type Member } from "@/src/hooks/useMembers";
import { MemberDialog } from "../MemberDialog";

export type MemberColumnAttributes = {
  name: string;
  role: string;
  data: Member;
  memberObjectSetter?: React.Dispatch<React.SetStateAction<Member[]>>;
};

export const columns: ColumnDef<MemberColumnAttributes>[] = [
  { accessorKey: "name", header: "Name" },
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
