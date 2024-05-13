import React, { FC, ReactNode, useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { ElementType } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";

const defaultEventImage = (
  <div className="bg-secondary-background flex justify-center p-5 rounded-md">
    <PartyPopper className="w-1/3 h-1/3 block" color="grey" />
  </div>
);

export const EventCard: FC = () => {
  const [eventImageElement, setEventImageElement] = useState<
    ReactNode | undefined
  >(defaultEventImage);

  const loadEventImageElement = () => {
    const imageCondition = false;
    if (imageCondition) {
      setEventImageElement(<div>real image</div>);
    }
  };

  useEffect(() => loadEventImageElement(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Name</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col ">
        {eventImageElement}
        <div className="mt-3">When:</div>
        <div className="mt-3">Where:</div>
        <div className="mt-3">Fee:</div>
      </CardContent>
      <CardFooter>
        <div className="text-right w-full border-t-2 pt-6">Footer</div>
      </CardFooter>
    </Card>
  );
};
