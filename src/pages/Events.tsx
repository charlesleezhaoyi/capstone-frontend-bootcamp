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

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!isAuthenticated) {
  //       loginWithRedirect();
  //     }
  //   }
  // }
  // , [isAuthenticated, isLoading, loginWithRedirect]);

  const [isLoadingPage, setIsLoadingPage] = React.useState(true);

  useEffect(() => {
    console.log(user);
    if (user && user.email && !user.email_verified) {
      setIsLoadingPage(true);
      navigate("/individual-onboarding");
    }
  }, [user, navigate]);

  if (isLoadingPage) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="bg-gray-500 w-full min-h-full">
      <Tabs defaultValue="all">
        <TabsList className="bg-white border-t-2 border-secondary p-3 h-fit w-full rounded-none justify-start">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
          >
            <h2>All Events</h2>
          </TabsTrigger>
          {isUserLoggedIn && (
            <TabsTrigger
              value="my"
              className="data-[state=active]:bg-secondary-background data-[state=active]:text-foreground text-secondary mr-2"
            >
              <h2>My Events</h2>
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
