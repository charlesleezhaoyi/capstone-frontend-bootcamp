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
      const fetchedData = await fetchMembersByNpoId();
      setNpoMembers(fetchedData);
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
      display_pic_url: member.display_img_url,
      name: member.full_name,
      role: member.npoMembers[0].roles.name,
      data: member,
      memberObjectSetter: setNpoMembers,
    }));
    return outputData;
  };

  return (
    <div className="bg-gray-500 w-full min-h-full h-fit items-start p-10 ">
      <MemberControlTable columns={columns} data={filterData(npoMembers)} />
    </div>
  );
};
