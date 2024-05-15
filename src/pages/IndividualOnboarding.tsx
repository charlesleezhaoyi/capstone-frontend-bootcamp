// TypeScript imports
import React, { FC, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const accountFormSchema = z.object({
  dob: z.date({ required_error: "A date of birth is required." }),
  genders: z.string({ required_error: "Please select a gender." }),
  company: z.string({ required_error: "Please enter a company name." }),
  cv_url: z.string({ required_error: "Please enter a CV URL." }),
  portfolio_link_url: z.string({
    required_error: "Please enter a portfolio URL.",
  }),
  npo_name: z.string({ required_error: "Please enter the name of the NPO" }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Main component
export const IndividualOnboarding: FC = () => {
  const form: UseFormReturn<AccountFormValues> = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      dob: new Date(),
      genders: "",
      company: "",
      cv_url: "",
      portfolio_link_url: "",
      npo_name: "",
    },
  });

  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const [userEmail, setUserEmail] = React.useState<string>("");

  const userType = localStorage.getItem("userType");

  // Define a type for your user's metadata if it's structured
  interface UserMetadata {
    email: string;
  }

  useEffect(() => {
    if (!isLoading) {
      console.log(isAuthenticated, user, isLoading);
      if (!isAuthenticated) {
        // If the user is not authenticated, we start the login process
      } else if (user && user.email) {
        setUserEmail(user.email);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  function onSubmit(data: AccountFormValues): void {
    console.log(user);
    const { dob, genders, company, cv_url, portfolio_link_url, npo_name } =
      data;

    //Need to conditionally amend submitForm function to cater for different user types
    async function submitForm() {
      try {
        if (!isAuthenticated) {
          console.error("User is not authenticated");
          return;
        }

        const { dob, genders, company, cv_url, portfolio_link_url } =
          form.getValues();

        if (user) {
          await axios.put(`http://localhost:3001/members/update`, {
            full_name: "Charles",
            email: user.email,
            date_of_birth: dob,
            gender: genders,
            occupation: "",
            employee_at: company,
            cv_url: cv_url,
            portfolio_link_url: portfolio_link_url,
            is_onboarded: true,
          });
          const response = await axios.post(
            `http://localhost:3001/members/retrieve`,
            {
              email: user.email,
            }
          );
          const member_id = response.data.data;
          if (userType === "corporate") {
            await axios.post(`http://localhost:3001/npoMembers/assignNpo`, {
              npo_name: localStorage.getItem("npo_name"),
              member_id: member_id,
              role_id: 1,
            });
            navigate("/events");
          } else if (userType === "individual") {
            await axios.post(`http://localhost:3001/npoMembers/assignNpo`, {
              npo_name: npo_name,
              member_id: member_id,
              role_id: 3,
            });
            navigate("/events");
          } else {
            console.error("User not found");
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    submitForm();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name field */}
        <h1 className="flex flex-col py-2 px-8">Welcome to GoodHub SEA</h1>
        <h3 className="flex flex-col py-2 px-8">
          We are so glad to have you with us! Tell us about yourself!
        </h3>
        {/* Date of Birth field */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col py-1 px-8">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-[240px] pl-3 text-left font-normal", {
                        "text-muted-foreground": !field.value,
                      })}
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
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Gender Selection*/}
        <FormField
          control={form.control}
          name="genders"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Gender</FormLabel>
              <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What is your gender?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/*To prepopulate using dropdown in future*/}
        {userType === "individual" && (
          <>
            <FormField
              control={form.control}
              name="npo_name"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>
                    What is the name of the NPO you'd like to join
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type the name of the NPO you'd like to join (case sensitive & spelling sensitive)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your request to join the community will be sent to the admin
                    and you'll be notified once you're in!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>
                    Where are you currently working at (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="GoodHub SEA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*Company Website URL*/}
            <FormField
              control={form.control}
              name="cv_url"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>CV URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Share a link to your CV" {...field} />
                  </FormControl>
                  <FormDescription>
                    Share the link to your CV for us to find out more about you!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*Company Website URL*/}
            <FormField
              control={form.control}
              name="portfolio_link_url"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>Portfolio URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tell us a little more about what you have done outside of work"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share the link to your portfolio for us to find out more!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" className="font-normal text-white mx-8">
          Submit
        </Button>
      </form>
    </Form>
  );
};
