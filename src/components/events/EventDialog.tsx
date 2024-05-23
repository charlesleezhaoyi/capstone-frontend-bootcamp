import React, { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { Calendar } from "../ui/calendar";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useUser } from "../../UserContext";
import { useEvents, Event } from "../../hooks/useEvents";
import { copyFile } from "fs";

interface EventDialogProps {
  npo_id: number;
  onDialogClose: () => void;
  eventObjectSetter?: React.Dispatch<React.SetStateAction<Event[]>>;
  event?: Event;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const EventDialog: FC<EventDialogProps> = ({
  npo_id,
  onDialogClose,
  eventObjectSetter,
  event,
  isOpen,
  setIsOpen,
}) => {
  // console.log(event);
  const { userId, userRole, userNpo } = useUser();

  const formSchema = z.object({
    organiser_id: z.string(),
    event_name: z.string(),
    event_overview: z.string(),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    price: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organiser_id: "",
      event_name: "",
      event_overview: "",
      date: "",
      time: "",
      location: "",
      price: "",
    },
  });

  React.useEffect(() => {
    if (event) {
      form.reset({
        organiser_id: event.organiser_id ? event.organiser_id.toString() : "",
        event_name: event.event_name || "",
        event_overview: event.event_overview || "",
        date: event.date ? new Date(event.date).toISOString() : "",
        time: event.time || "",
        location: event.location || "",
        price: event.price ? event.price.toString() : "",
      });
    }
  }, [event, form.reset]);

  const { fetchEventsByNpoId } = useEvents();
  const updateEventsAsync = async () => {
    try {
      const fetchedData = await fetchEventsByNpoId(1);
      if (eventObjectSetter) {
        eventObjectSetter(fetchedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("button click");
    const newEventData = {
      event_id: event?.id,
      npo_id: userNpo,
      organiser_id: userId,
      event_name: values.event_name,
      event_overview: values.event_overview,
      date: values.date,
      time: values.time,
      location: values.location,
      price: values.price,
    };

    try {
      let response;
      console.log("button click");
      if (event) {
        // If an event was passed in, update the existing event
        console.log(newEventData);
        response = await axios.put(
          `http://localhost:3001/npoEvents/1/`,
          newEventData
        );
      } else {
        // If no event was passed in, create a new event
        response = await axios.post(
          "http://localhost:3001/npoEvents/1",
          newEventData
        );
      }

      toast({
        title: "Success!",
        description: `Event has been ${
          event ? "updated" : "created"
        } successfully. Response code: ${response.status}`,
      });

      onDialogClose();
    } catch (err) {
      toast({
        title: "Uh oh",
        description: `An error occurred. `,
      });
    }
  }
  const { toast } = useToast();

  return (
    <div>
      <Button
        className="text-white w-sm text-md rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        Create
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="text-primary flex justify-end w-full"></DialogTrigger>
        <DialogContent closeButton={false}>
          <DialogHeader>Create Event</DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the name of the event
                    </FormDescription>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="event_overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Overview</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Overview" {...field} />
                    </FormControl>
                    <FormDescription>
                      Share with your members, what this event is all about
                    </FormDescription>
                  </FormItem>
                )}
              ></FormField>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Event</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                {
                                  "text-muted-foreground": !field.value,
                                }
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date.toISOString());
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Time of Event</FormLabel>
                      <FormControl>
                        <Input placeholder="16:00:00 SGT" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex gap-4 ">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Free of charge" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex gap-4 justify-center w-full">
                <Button className="text-white md:w-20 w-14" type="submit">
                  {event ? "Update" : "Create"}
                </Button>
                <DialogClose
                  className="text-black md:w-20 w-14"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Close
                </DialogClose>
              </div>
            </form>
          </Form>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
