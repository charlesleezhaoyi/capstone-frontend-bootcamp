import React, { FC, useEffect, useState } from "react";
import { useMembers } from "../../hooks/useMembers";
import { MemberCard } from "./MemberCard";
import { Member } from "../../hooks/useMembers";

export const NonAdminMemberView: FC = () => {
  const [npoMembers, setNpoMembers] = useState<Member[]>();

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

  return (
    <div className="bg-gray-500 w-full h-fit grid lg:gap-8 lg:p-8 md:grid-cols-3 md:gap-4 md:p-4 sm:grid-cols-2 grid-cols-1 gap-10 p-10 ">
      <MemberCard />
      <MemberCard />
      <MemberCard />
      <MemberCard />
    </div>
  );
};
