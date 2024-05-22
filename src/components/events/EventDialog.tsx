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

interface EventDialogProps {
  npo_id: number;
}
export const EventDialog: FC<EventDialogProps> = () => {
  const { userId, userRole, userNpo } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState({
    npo_id: "",
    organiser_id: "",
    event_name: "",
    event_overview: "",
    date: "",
    time: "",
    location: "",
    price: "",
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setEventData({
      npo_id: userNpo,
      organiser_id: userId,
      event_name: values.event_name,
      event_overview: values.event_overview,
      date: values.date,
      time: values.time,
      location: values.location,
      price: values.price,
    });
    console.log(userNpo);

    console.log(eventData);
    try {
      const response = await axios.post("http://localhost:3001/npoEvents/1", {
        ...eventData,
      });

      toast({
        title: "Success!",
        description: `Event has been created successfully. Response code: ${response.status}`,
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Uh oh",
        description: `An error occurred`,
      });
    }
  }

  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="text-primary flex justify-end w-full">
        <Button className="text-white w-sm text-md rounded-lg">Create</Button>
      </DialogTrigger>
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
                Create
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
  );
};
