// TypeScript imports
import React, { FC } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "../components/ui/select";
import { useNavigate } from "react-router";

// Type definitions
type Gender = {
  label: string;
  value: string;
};

const genders: ReadonlyArray<Gender> = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

interface FormValues {
  name: string;
  dob: Date;
  genders: string;
  company: string;
  email: string;
  cv_url: string;
  portfolio_url: string;
}

const accountFormSchema = z.object({
  dob: z.date({ required_error: "A date of birth is required." }),
  genders: z.string({ required_error: "Please select a gender." }),
  company: z.string({ required_error: "Please enter a company name." }),
  cv_url: z.string({ required_error: "Please enter a CV URL." }),
  portfolio_url: z.string({ required_error: "Please enter a portfolio URL." }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  dob: new Date("2023-01-23"),
  company: "John Doe Pte Ltd",
  genders: "",
  cv_url: "https://www.linkedin.com/in/johndoe",
  portfolio_url: "https://www.johndoe.com",
};

// Main component
export const IndividualOnboarding: FC = () => {
  const form: UseFormReturn<AccountFormValues> = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  function onSubmit(data: AccountFormValues): void {
    const { dob, genders, company, cv_url, portfolio_url } = data;
    navigate("/events");
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
              <FormLabel>Company Website URL</FormLabel>
              <FormControl>
                <Input placeholder="Share a link to your CV" {...field} />
              </FormControl>
              <FormDescription>
                Share the link to your company website for us to find out more!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*Company Website URL*/}
        <FormField
          control={form.control}
          name="portfolio_url"
          render={({ field }) => (
            <FormItem className="flex flex-col py-2 px-8">
              <FormLabel>Portfolio URL</FormLabel>
              <FormControl>
                <Input placeholder="The company you're working at" {...field} />
              </FormControl>
              <FormDescription>
                Share the link to your portfolio for us to find out more!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="font-normal text-white mx-8">
          Submit
        </Button>
      </form>
    </Form>
  );
};
