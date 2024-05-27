import React, { FC, ReactNode, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SheetClose } from "../ui/sheet";

// Icons
import { CalendarDays } from "lucide-react";
import { SquareUserRound } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useUser } from "../../UserContext";
import { useParams } from "react-router-dom";

interface InSheetProps {
  inSheet?: boolean;
}

export const NavMenu: FC<InSheetProps> = (props) => {
  const { userId } = useUser();
  const [npoNameParam, setNpoNameParam] = useState("allNpos"); // Initialize npoIdParam state

  const wrapChild = (isWrap: boolean | undefined, children: ReactNode) => {
    if (isWrap) {
      return <SheetClose>{children}</SheetClose>;
    }
    return children;
  };

  useEffect(() => {
    const getUserNPO = async () => {
      try {
        console.log(userId);
        const response = await axios.post(
          "http://localhost:3001/npoMembers/getNpoNameByMemberID",
          {
            member_id: userId,
          }
        );
        setNpoNameParam(response.data.replace(/\s/g, "").toLowerCase());
      } catch (error: any) {
        if (
          error.response &&
          error.response.msg === "Member has multiple NPOs"
        ) {
          setNpoNameParam("allNpos");
          // setNpoFilter(true);
        }
        console.error(error);
      }
    };

    getUserNPO();
  }, [userId]);

  return (
    <div
      className={`sticky top-0 flex-col h-full w-full ${
        props.inSheet && "pt-5"
      }`}
    >
      <NavLink
        to={`/${npoNameParam}/events`}
        className={({ isActive }) =>
          `flex transition-all text-secondary text-2xl font-semibold hover:text-primary rounded-lg px-3 py-1 ${
            isActive ? "text-secondary-foreground bg-secondary-background" : ""
          }`
        }
      >
        {wrapChild(
          props.inSheet,
          <div className="flex flex-row justify-start items-center gap-3 w-full">
            <CalendarDays className="h-5 w-5" />
            <span>Events</span>
          </div>
        )}
      </NavLink>
      <NavLink
        to={`/${npoNameParam}/members`}
        className={({ isActive }) =>
          `flex transition-all text-secondary text-2xl font-semibold hover:text-primary rounded-lg px-3 py-1 ${
            isActive ? "text-secondary-foreground bg-secondary-background" : ""
          }`
        }
      >
        {wrapChild(
          props.inSheet,
          <div className="flex flex-row justify-start items-center gap-3 w-full">
            <SquareUserRound className="h-5 w-5" />
            <span>Members</span>
          </div>
        )}
      </NavLink>
      <hr className="h-[2px] border-0 bg-secondary mt-2"></hr>
    </div>
  ) as JSX.Element;
};
