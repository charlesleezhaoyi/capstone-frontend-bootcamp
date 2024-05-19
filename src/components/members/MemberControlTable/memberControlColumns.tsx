import React from "react";
import { ColumnDef } from "@tanstack/react-table";

export type MemberColumnAttributes = {
  name: string;
  role: string;
};

export const columns: ColumnDef<MemberColumnAttributes>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];
