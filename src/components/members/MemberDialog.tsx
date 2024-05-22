import React, { FC, ReactNode, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { useMembers, type Member } from "../../hooks/useMembers";
import { ChevronDown, ChevronUp } from "lucide-react";

import { ImageWithFallback } from "./ImageWithFallback";

interface MemberDialogProps {
  data: Member;
  isAdmin: boolean;
  memberObjectSetter?: React.Dispatch<React.SetStateAction<Member[]>>;
  children: ReactNode;
}

export const MemberDialog: FC<MemberDialogProps> = ({
  data,
  children,
  isAdmin,
  memberObjectSetter,
}: MemberDialogProps) => {
  const [role, setRole] = useState<string>(data.npoMembers[0].roles.name);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { toast } = useToast();
  const { fetchMembersByNpoId } = useMembers();

  const updateMembersAsync = async () => {
    try {
      const fetchedData = await fetchMembersByNpoId(1);
      if (memberObjectSetter) {
        memberObjectSetter(fetchedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const originalRole: string = data.npoMembers[0].roles.name;

  const handleDropdownClick = (field: string) => {
    setRole(field);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const resetRole = () => {
    setRole(originalRole);
  };

  const handleChangeRole = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL! + "/npoMembers/assignRole",
        {
          method: "POST",
          body: JSON.stringify({ role_name: role, member_id: data.id }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      toast({
        title: "Success!",
        description: `${data.full_name}'s role has been changed from ${originalRole} to ${role}`,
      });
      updateMembersAsync();
    } catch (err) {
      toast({
        title: "Uh oh",
        description: `Something went wrong when changing ${data.full_name}'s role from ${originalRole} tp ${role} `,
      });
    }
  };

  const roleDropdown = (
    <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown}>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-background hover:bg-background"
          data-state={isDropdownOpen ? "open" : "closed"}
          aria-expanded={isDropdownOpen}
        >
          {role}
          {isDropdownOpen ? (
            <ChevronUp className="ml-2" />
          ) : (
            <ChevronDown className="ml-2" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleDropdownClick("Owner")}>
          Owner
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDropdownClick("Admin")}>
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDropdownClick("Member")}>
          Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Dialog>
      <DialogTrigger className="text-primary flex justify-center w-full">
        {children}
      </DialogTrigger>
      <DialogContent closeButton={false}>
        <DialogHeader className="flex flex-row">
          <div className="md:h-40 h-28 md:w-40 w-28 flex flex-row items-center justify-center">
            <ImageWithFallback
              src={data.display_img_url}
              alt="Member Profile"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="ml-5">
            <h3 className="md:mt-7">{data.full_name}</h3>
            <div className="md:mt-4 text-left">
              {isAdmin ? roleDropdown : data.npoMembers[0].roles.name}
            </div>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-start">
            <div className="font-bold">Occupation</div>
            <div>{data.occupation}</div>
          </div>
          <div className="flex flex-col justify-start">
            <div className="font-bold">Email</div>
            <div>{data.email}</div>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          {data.npoMembers[0].open_ended_ans_1 && (
            <div>
              <div className="font-bold">
                {data.npoMembers[0].npos.open_ended_qn_1}
              </div>
              <div>{data.npoMembers[0].open_ended_ans_1}</div>
            </div>
          )}
          {data.npoMembers[0].open_ended_ans_2 && (
            <div>
              <div className="font-bold">
                {data.npoMembers[0].npos.open_ended_qn_2}
              </div>
              <div>{data.npoMembers[0].open_ended_ans_2}</div>
            </div>
          )}
          {data.npoMembers[0].open_ended_ans_3 && (
            <div>
              <div className="font-bold">
                {data.npoMembers[0].npos.open_ended_qn_3}
              </div>
              <div>{data.npoMembers[0].open_ended_ans_3}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose className="flex flex-row justify-center w-full" asChild>
            <div className="gap-4">
              {originalRole !== role && (
                <Button
                  className="text-white md:w-20 w-14"
                  onClick={handleChangeRole}
                >
                  Change
                </Button>
              )}
              <Button className="text-white md:w-20 w-14" onClick={resetRole}>
                Close
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
