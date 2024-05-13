import React, { FC } from "react";
import { EventCard } from "./EventCard";

export const AllEvents: FC = () => {
  return (
    <div className="grid lg:gap-8 lg:p-8 md:grid-cols-2 md:gap-4 md:p-4 grid-cols-1 gap-10 p-10">
      <EventCard />
    </div>
  );
};
