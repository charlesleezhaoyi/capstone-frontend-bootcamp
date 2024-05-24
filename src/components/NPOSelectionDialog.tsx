import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormDescription,
} from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useUser } from "../UserContext";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

interface NPOSelectionDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onNPOSelect: (npoId: number) => void;
}

export const NPOSelectionDialog: FC<NPOSelectionDialogProps> = ({
  isOpen,
  setIsOpen,
  onNPOSelect,
}) => {
  const { userId } = useUser();
  const [npoOptions, setNpoOptions] = useState([]);

  const formSchema = z.object({
    npo_name: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      npo_name: "",
    },
  });

  useEffect(() => {
    // const fetchNPOs = async () => {
    //   const response = await axios.post(
    //     "http://localhost:3001/npoMembers/getNpoMemberRole",
    //     {
    //       member_id: userId,
    //     }
    //   );
    //   setNpoOptions(response.data);
    // };
    // fetchNPOs();
  }, [userId]);

  const handleNPOSelect = (npoId: number) => {
    onNPOSelect(npoId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent closeButton={false}>
        <DialogHeader>Welcome to the application!</DialogHeader>
        <Form {...form}>
          <FormControl>
            <FormLabel htmlFor="npo_name">Select an NPO</FormLabel>
            <Select>
              <SelectTrigger>Please select an NPO</SelectTrigger>
              <SelectContent>
                {npoOptions.map((npo: any) => (
                  <SelectItem
                    key={npo.npo_id}
                    value={npo.npo_id}
                    onSelect={() => handleNPOSelect(npo.npo_id)}
                  >
                    {npo.npo_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </Form>
        <DialogFooter>
          <DialogClose onClick={() => setIsOpen(false)}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
