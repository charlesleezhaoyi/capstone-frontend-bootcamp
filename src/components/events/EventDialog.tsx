import React, { FC, useState, ReactNode } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { Calendar } from "../ui/calendar";
import axios from "axios";
import { useUser } from "../../UserContext";
import { useEvents, Event } from "../../hooks/useEvents";
import { PartyPopper } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "../../firebase";
import { isKeyObject } from "util/types";

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
  //UserContext
  const { userId, userRole, userNpo } = useUser();

  //Initiate useEvent hook
  const { fetchEventById } = useEvents();

  //EventDataState
  const [newEventData, setNewEventData] = useState<Event | undefined>(
    undefined
  );

  //Image handling
  const defaultEventImage = (
    <div className="bg-secondary-background flex justify-center items-center p-5 h-full w-full">
      <PartyPopper className="w-full h-full block" color="grey" />
    </div>
  );
  const [eventImageElement, setEventImageElement] = useState<
    ReactNode | undefined
  >(defaultEventImage);
  const setEventImageToDefault = () => {
    setEventImageElement(defaultEventImage);
  };
  const storage = getStorage(firebaseApp);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //Form Definition
  const formSchema = z.object({
    organiser_id: z.string(),
    event_photo_url: z
      .instanceof(FileList)
      .refine(
        (file) => file?.length === 1,
        "Event cover photos are highly encouraged"
      ),
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
      event_photo_url: undefined,
      event_name: "",
      event_overview: "",
      date: "",
      time: "",
      location: "",
      price: "",
    },
  });

  const fileRef = form.register("event_photo_url");

  const { fetchEventsByNpoId } = useEvents();
  const updateEventsAsync = async () => {
    try {
      const fetchedData = await fetchEventsByNpoId();
      if (eventObjectSetter) {
        eventObjectSetter(fetchedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("button click");
    const file = values.event_photo_url[0];
    const eventImageRef = ref(storage, `images/eventImages/${file.name}`);
    const uploadTaskSnapshot = await uploadBytes(eventImageRef, file);
    console.log("image uploaded");
    const fileURL = await getDownloadURL(uploadTaskSnapshot.ref);
    const newEventData = {
      event_id: event?.id,
      event_photo_url: fileURL,
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
          `http://localhost:3001/npoEvents/${userNpo}/`,
          newEventData
        );
        // form.reset({
        //   organiser_id: event.organiser_id ? event.organiser_id.toString() : "",
        //   event_photo_url: undefined,
        //   event_name: event.event_name || "",
        //   event_overview: event.event_overview || "",
        //   date: event.date ? new Date(event.date).toISOString() : "",
        //   time: event.time || "",
        //   location: event.location || "",
        //   price: event.price ? event.price.toString() : "",
        // });
        setPreviewURL(null);
      } else {
        // If no event was passed in, create a new event
        response = await axios.post(
          `http://localhost:3001/npoEvents/${userNpo}`,
          newEventData
        );
        // form.reset({
        //   organiser_id: "",
        //   event_photo_url: undefined,
        //   event_name: "",
        //   event_overview: "",
        //   date: "",
        //   time: "",
        //   location: "",
        //   price: "",
        // });
        // setPreviewURL(null);
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
              <div className="h-24 overflow-hidden rounded-md flex flex-row items-center justify-center">
                {previewURL ? (
                  <img src={previewURL} alt="Event Preview" />
                ) : (
                  eventImageElement
                )}
              </div>
              <FormField
                control={form.control}
                name="event_photo_url"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Pictures to make your event awesome</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          placeholder="Event Cover Photo"
                          {...fileRef}
                          onChange={handleImagePreview}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
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
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
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
                        <Input placeholder="0" {...field} />
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
