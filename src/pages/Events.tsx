import React, { FC, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

import { AllEvents } from "../components/events/AllEvents";
import { MyEvents } from "../components/events/MyEvents";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "../components/ui/tabs";

const isUserLoggedIn = true;

export const Events: FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-500 w-full min-h-full">
      <Tabs defaultValue="all">
        <TabsList className="bg-white border-t-2 border-secondary p-3 h-fit w-full rounded-none justify-start">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
          >
            <h4>All Events</h4>
          </TabsTrigger>
          {isUserLoggedIn && (
            <TabsTrigger
              value="my"
              className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
            >
              <h4>My Events</h4>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <AllEvents />
        </TabsContent>
        {isUserLoggedIn && (
          <TabsContent value="my" className="mt-0">
            <MyEvents />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
