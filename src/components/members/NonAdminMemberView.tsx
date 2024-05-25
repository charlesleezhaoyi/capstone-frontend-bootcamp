import React, { FC, useEffect, useState } from "react";
import { MemberCard } from "./MemberCard";
import { useMembers, type Member } from "../../hooks/useMembers";

export const NonAdminMemberView: FC = () => {
  const [npoMembers, setNpoMembers] = useState<Member[]>();

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

  const memberCards = npoMembers?.map((member: Member) => (
    <MemberCard key={member.id} member={member} />
  ));

  return (
    <div className="bg-gray-500 w-full min-h-full h-fit items-start grid lg:gap-8 lg:p-8 md:grid-cols-3 md:gap-4 md:p-4 sm:grid-cols-2 grid-cols-1 gap-10 p-10 ">
      {memberCards}
    </div>
  );
};
