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
import { useNavigate } from "react-router";

// Type definitions

interface FormValues {
  npo_name: string;
  key_activities: string; //change to enum later
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

const defaultValues: Partial<AccountFormValues> = {
  npo_name: "GoodHub SEA",
  key_activities: "Community Building",
  company_website_url: "https://goodhubsea.com",
  country_incorporated: "Singapore",
  acra: undefined,
  company_size: "1-10",
};

// Main component
export function CorporateOnboarding() {
  const form: UseFormReturn<AccountFormValues> = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  // console.log(form.formState.errors);
  // console.log(form.getValues());

  const fileRef = form.register("acra");

  const navigate = useNavigate();

  function onSubmit(data: AccountFormValues): void {
    const {
      npo_name,
      key_activities,
      company_website_url,
      country_incorporated,
      company_size,
      acra,
    } = data;
    // console.log(data);
    navigate("/individual-onboarding");
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
        {/*Key Activities*/}
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
                  <SelectItem value="Community Building">
                    Community Building
                  </SelectItem>
                  <SelectItem value="Educational Programmes">
                    Educational Programmes
                  </SelectItem>
                  <SelectItem value="Charitable Causes">
                    Charitable Causes
                  </SelectItem>
                  <SelectItem value="Direct Aid Provision">
                    Direct Aid Provision
                  </SelectItem>
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
