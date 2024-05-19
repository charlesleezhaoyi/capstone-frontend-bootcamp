import React, { FC, useEffect, useState } from "react";
import { MemberControlTable } from "./MemberControlTable/MemberControlTable";
import {
  MemberColumnAttributes,
  columns,
} from "./MemberControlTable/memberControlColumns";
import { useMembers, type Member } from "../../hooks/useMembers";

export const AdminMemberView: FC = () => {
  const [npoMembers, setNpoMembers] = useState<Member[]>([]);

  const { fetchMembersByNpoId } = useMembers();

  const fetchMembersAsync = async () => {
    try {
      const fetchedMembers = await fetchMembersByNpoId(1);
      setNpoMembers(fetchedMembers);
      console.log(fetchedMembers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMembersAsync();
  }, []);

  const filterData = (inputData: Member[]): MemberColumnAttributes[] => {
    if (!inputData) {
      return [];
    }
    const outputData = inputData.map((member) => ({
      name: member.full_name,
      role: member.npoMembers[0].roles.name,
    }));
    return outputData;
  };

  return (
    <div className="bg-gray-500 w-full min-h-full h-fit items-start p-10 ">
      <MemberControlTable columns={columns} data={filterData(npoMembers)} />
    </div>
  );
};
