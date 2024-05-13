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
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  genders: z.string({ required_error: "Please select a gender." }),
  company: z.string({ required_error: "Please enter a company name." }),
  email: z.string({ required_error: "Please enter an email address." }),
  cv_url: z.string({ required_error: "Please enter a CV URL." }),
  portfolio_url: z.string({ required_error: "Please enter a portfolio URL." }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  name: "Your name",
  dob: new Date("2023-01-23"),
};

// Main component
export function IndividualOnboarding() {
  const form: UseFormReturn<AccountFormValues> = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const [name, setName] = useState<string>("Your name");
  const [dob, setDob] = useState<Date>(new Date());
  const [gender, setGender] = useState<string>("M");
  const [company, setCompany] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  function onSubmit(data: AccountFormValues): void {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name field */}
        {genders && (
          <>
            <h1 className="flex flex-col py-2 px-8">Welcome to GoodHub SEA</h1>
            <h3 className="flex flex-col py-2 px-8">
              We are so glad to have you with us! Tell us about yourself!
            </h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setDob(date as Date);
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
            <Select>
              <SelectGroup className="flex flex-col py-1 px-8">
                <SelectLabel>Gender</SelectLabel>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder="Gender"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setGender(e.target.value)
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </SelectGroup>
            </Select>
            <FormField<FormValues>
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="The company you're working at"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString()
                          : field.value
                      }
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the company you're working at
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<FormValues>
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col py-2 px-8">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString()
                          : field.value
                      }
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the email you'll be using for your account. We will
                    also reach out to you for information if you're registering
                    your company on our platform
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RadioGroup
              defaultValue="option-one"
              className="flex flex-col py-2 px-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">
                  I am registering a non-profit with GoodHub SEA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">
                  I am a community member of a community on GoodHub SEA
                </Label>
              </div>
            </RadioGroup>

            <Button type="submit" className="font-normal text-white mx-8">
              Next
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
