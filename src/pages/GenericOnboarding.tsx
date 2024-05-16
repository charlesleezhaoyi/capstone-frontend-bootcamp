// TypeScript imports
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useState } from "react";
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
import WelcomeImage from "../assets/WelcomeImage.png";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

interface FormValues {
  name: string;
  email: string;
}

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z.string({ required_error: "Please enter an email address." }),
  type: z.enum(["individual", "corporate"], {
    required_error: "Please select an option.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  name: "Your name",
  email: "johndoe@gmail.com",
  type: "individual",
};

// Main component
export function GenericOnboarding() {
  const { loginWithRedirect } = useAuth0();
  const form: UseFormReturn<AccountFormValues> = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const [name, setName] = useState<string>("Your name");
  const [userEmail, setUserEmail] = useState<string>("");
  const [individual, setIndividual] = useState<boolean>(true);
  const [corporate, setCorporate] = useState<boolean>(false);
  const navigate = useNavigate();

  function onSubmit(data: AccountFormValues): void {
    const { name, email, type } = data;
    if (type === "individual") {
      // Redirect to /individual-onboarding
      localStorage.setItem("userType", "individual");
      axios
        .post(`http://localhost:3001/members/`, { email })
        .then((response) => {
          if (response.status === 200) {
            // Redirect to /individual-onboarding
            // navigate("/individual-onboarding");
          } else {
            throw new Error("Failed to submit form");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      loginWithRedirect({
        authorizationParams: { screen_hint: "signup", login_hint: email },
      });
    } else if (type === "corporate") {
      // Redirect to /corporate-onboarding
      localStorage.setItem("userType", "corporate");
      setUserEmail(email);
      axios
        .post(`http://localhost:3001/members/`, { email })
        .then((response) => {
          if (response.status === 200) {
            // Redirect to /individual-onboarding
            // navigate("/individual-onboarding");
          } else {
            throw new Error("Failed to submit form");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      navigate("/corporate-onboarding", { state: { email } });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name field */}
        <h1 className="flex flex-col py-2 px-8">Welcome to GoodHub SEA</h1>
        <h3 className="flex flex-col py-2 px-8">
          Thank you for your interest in GoodHub SEA - tell us more about
          yourself!
        </h3>
        {/* SVG Image */}
        <img
          className="flex flex-col py-2 px-8 mx-auto"
          src={WelcomeImage}
          alt=""
          style={{ maxWidth: "50%", height: "auto" }}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                This is the email you'll be using for your account. We will also
                reach out to you for information if you're registering your
                company on our platform
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Select non-profit or community member radio group*/}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel></FormLabel>
              <RadioGroup
                defaultValue="individual"
                onValueChange={field.onChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="option-two" />
                  <Label htmlFor="option-two">
                    I am a community member of a community on GoodHub SEA
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporate" id="option-one" />
                  <Label htmlFor="option-one">
                    I am registering a non-profit with GoodHub SEA
                  </Label>
                </div>
              </RadioGroup>
            </FormItem>
          )}
        />
        {/* Next Button */}
        <Button type="submit" className="font-normal text-white mx-8">
          Next
        </Button>
      </form>
    </Form>
  );
}
