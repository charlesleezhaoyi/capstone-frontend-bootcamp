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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Type definitions

interface FormValues {
  npo_name: string;
  key_activities: string; //change to enum later
  company_description: string;
  company_website_url: string;
  country_incorporated: string; //change to enum later
  company_size: string; //change to enum later
  company_logo_url: string;
  acra: File;
  is_whitelabelled: boolean;
  event_module: boolean;
  discussion_module: boolean;
  membership_mgmt: string; //change to enum later
}

const accountFormSchema = z.object({
  npo_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  company_description: z.string({}),
  company_website_url: z.string().url(),
  key_activities: z.string({}),
  country_incorporated: z.string({}),
  company_size: z.string({}),
  // company_logo_url: z.string().url(),
  acra: z
    .instanceof(FileList)
    .refine((file) => file?.length == 1, "ACRA BizFile is required."),
  // is_whitelabelled: z.boolean({ message: "Please select an option" }),
  // event_module: z.boolean({ message: "Please select an option" }),
  // discussion_module: z.boolean({ message: "Please select an option" }),
  // membership_mgmt: z.string({ message: "Please select an option" }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Main component
export function CorporateOnboarding() {
  const location = useLocation();
  const { email } = location.state;
  const form: UseFormReturn<AccountFormValues> = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  });

  // console.log(form.formState.errors);
  // console.log(form.getValues());

  const fileRef = form.register("acra");

  const { loginWithRedirect } = useAuth0();

  function onSubmit(data: AccountFormValues): void {
    const {
      npo_name,
      key_activities,
      company_website_url,
      country_incorporated,
      company_size,
      company_description,
      acra,
    } = data;

    async function submitForm() {
      try {
        localStorage.setItem("npo_name", npo_name);
        await axios.post(`http://localhost:3001/npos/createNpo`, {
          name: npo_name,
          key_activities: key_activities,
          company_website_url: company_website_url,
          country_incorporated: country_incorporated,
          company_size: company_size,
          company_description: company_description,
          company_logo_url: "http://insertlogo.com", //to fix
          acra_url: "http://insertacra.com", //to fix
          is_whitelabelled: false,
          event_module: false,
          discussion_module: false,
          membership_mgmt: "premium",
          is_verified: false,
        });

        const response = await axios.put(
          `http://localhost:3001/members/update`,
          {
            email: email,
            full_name: "Charles Lee",
            date_of_birth: "1990-02-29",
            gender: "male",
            occupation: "Software Engineer",
            employee_at: "GoodHub SEA",
            cv_url: "https://www.linkedin.com/in/charleslee",
            portfolio_link_url: "www.goodhubsea.com",
            is_onboarded: true,
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to submit form");
        }

        console.log("Form submitted successfully", response.data);

        loginWithRedirect({
          authorizationParams: {
            screen_hint: "signup",
            login_hint: email,
          },
        });
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
        <FormField
          control={form.control}
          name="npo_name"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>
                What's the name of the non-profit company you're looking to
                onboard?
              </FormLabel>
              <FormControl>
                <Input placeholder="GoodHub SEA" {...field} />
              </FormControl>
              <FormDescription>
                This is your registered company which you'd like to use GoodHub
                SEA with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Company Description*/}
        <FormField
          control={form.control}
          name="company_description"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="A story about what your company is all about"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell us more about what your company does, its mission & vision!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Key Activities - to change SelectItem later*/}
        <FormField
          control={form.control}
          name="key_activities"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Key Activities</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What does your company do?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Social Services">
                    Social Services
                  </SelectItem>
                  <SelectItem value="Education">
                    Educational Programmes
                  </SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/*Company Website URL*/}
        <FormField
          control={form.control}
          name="company_website_url"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Company Website URL</FormLabel>
              <FormControl>
                <Input placeholder="The company you're working at" {...field} />
              </FormControl>
              <FormDescription>
                Share the link to your company website for us to find out more!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Country Incorporated*/}
        <FormField
          control={form.control}
          name="country_incorporated"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Country Incorporated</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What does your company do?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Brunei">Brunei</SelectItem>
                  <SelectItem value="Cambodia">Cambodia</SelectItem>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                  <SelectItem value="Laos">Laos</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                  <SelectItem value="Myanmar">Myanmar</SelectItem>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="Thailand">Thailand</SelectItem>
                  <SelectItem value="Vietnam">Vietnam</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/*Company Size*/}
        <FormField
          control={form.control}
          name="company_size"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Company Size</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How big is your team?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-30">11-30</SelectItem>
                  <SelectItem value="31-50">31-50</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/*ACRA File Upload*/}
        <FormField
          control={form.control}
          name="acra"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col py-2 px-8">
                <FormLabel>ACRA Biz File</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="ACRA" {...fileRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" className="font-normal text-white mx-8">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export {};
