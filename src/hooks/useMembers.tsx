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
