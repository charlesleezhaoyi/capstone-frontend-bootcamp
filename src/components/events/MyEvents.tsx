import React, { FC } from "react";
import { EventCard } from "./EventCard";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";

export const MyEvents: FC = () => {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="bg-white border-t-2 border-secondary p-3 h-fit w-full rounded-none justify-start">
        <TabsTrigger
          value="upcoming"
          className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
        >
          <h5>Upcoming Events</h5>
        </TabsTrigger>

        <TabsTrigger
          value="past"
          className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
        >
          <h5>Past Events</h5>
        </TabsTrigger>
      </TabsList>
      <div className="grid lg:gap-8 lg:p-8 md:grid-cols-2 md:gap-4 md:p-4 grid-cols-1 gap-10 p-10">
        <TabsContent value="upcoming" className="mt-0">
          <EventCard />
        </TabsContent>
        <TabsContent value="past" className="mt-0">
          <EventCard />
        </TabsContent>
      </div>
    </Tabs>
  );
};
