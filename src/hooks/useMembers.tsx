import { useParams } from "react-router-dom";

interface Npo {
  id: number;
  name: string;
  key_activities: string;
  company_website_url: string;
  country_incorporated: string;
  company_description: string;
  company_size: "1-10" | "11-30" | "31-50";
  company_logo_url: string;
  acra_url: string;
  open_ended_qn_1?: string;
  open_ended_qn_2?: string;
  open_ended_qn_3?: string;
  is_whitelabelled: boolean;
  event_module: boolean;
  discussion_module: boolean;
  membership_mgmt: "premium" | "rulebased";
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface NpoMember {
  id: number;
  npo_id: number;
  member_id: number;
  role_id: number;
  open_ended_ans_1?: string;
  open_ended_ans_2?: string;
  open_ended_ans_3?: string;
  createdAt: string;
  updatedAt: string;
  roles: Role;
  npos: Npo;
}

export interface Member {
  id: number;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  occupation: string;
  employee_at?: string;
  email: string;
  cv_url?: string;
  portfolio_link_url?: string;
  display_img_url?: string;
  is_onboarded: boolean;
  createdAt: string;
  updatedAt: string;
  npoMembers: NpoMember[];
}

export const useMembers = () => {
  const { npo_url_extension } = useParams();
  const fetchMembersByNpoId = async () => {
    const fetchedMembers = await fetch(
      process.env.REACT_APP_BACKEND_URL! + "/npoMembers/" + npo_url_extension,
      {
        method: "GET",
      }
    );
    const fetchedMembersData = await fetchedMembers.json();
    console.log(fetchedMembersData);
    return fetchedMembersData;
  };

  return { fetchMembersByNpoId };
};
