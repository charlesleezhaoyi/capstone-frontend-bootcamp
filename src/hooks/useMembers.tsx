//create interface for fetched object
interface NpoMember {
  id: number;
  npo_id: number;
  member_id: number;
  role_id: number;
  open_ended_ans_1: string | null;
  open_ended_ans_2: string | null;
  open_ended_ans_3: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: number;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  occupation: string;
  employee_at: string;
  email: string;
  cv_url: string;
  portfolio_link_url: string;
  is_onboarded: boolean;
  createdAt: string;
  updatedAt: string;
  npoMembers: NpoMember[];
}

export const useMembers = () => {
  const fetchMembersByNpoId = async (npoId: number) => {
    const fetchedMembers = await fetch(
      process.env.REACT_APP_BACKEND_URL! + "/members/" + npoId,
      {
        method: "GET",
      }
    );
    const fetchedMembersData = await fetchedMembers.json();
    return fetchedMembersData;
  };

  return { fetchMembersByNpoId };
};
