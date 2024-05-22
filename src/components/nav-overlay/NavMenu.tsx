import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { SheetClose } from "../ui/sheet";

// Icons
import { CalendarDays } from "lucide-react";
import { SquareUserRound } from "lucide-react";

interface InSheetProps {
  inSheet?: boolean;
}

export const NavMenu: FC<InSheetProps> = (props) => {
  const wrapChild = (isWrap: boolean | undefined, children: ReactNode) => {
    if (isWrap) {
      return <SheetClose>{children}</SheetClose>;
    }
    return children;
  };
  return (
    <div
      className={`sticky top-0 flex-col h-full w-full ${
        props.inSheet && "pt-5"
      }`}
    >
      <NavLink
        to="/allNpos/events"
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
        to="members"
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
