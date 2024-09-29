// components/AddParameterDialog.tsx
"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { ParameterInput } from "@/app/types/Parameter";
import { useToast } from "@/hooks/use-toast";
import { postData } from "@/app/utils/sendRequest";

interface AddParameterDialogProps {
  onParameterAdded: () => void;
}

export default function AddParameterDialog({
  onParameterAdded,
}: AddParameterDialogProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Definicja schematu walidacji z użyciem zod
  const formSchema = z.object({
    name: z.string().min(1, "Parameter name is required"),
    type: z.enum(["number", "string", "boolean"]),
    goalOperator: z.string().optional(),
    goalValue: z.string().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<ParameterInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      goalValue: "",
      goalOperator: ">=",
      type: "number",
    },
  });

  const onSubmit = async(dataToPost: ParameterInput) => {

    const { status } = await postData("/api/parameters", dataToPost);
    toast({
      title: status === 201 ? "Parameter added" : "Error",
      description:
        status === 201
          ? "Parameter has been added successfully"
          : "Failed to add parameter.",
      variant: status === 201 ? "default" : "destructive",
    });

    if (status !== 201) {
      return;
    }

    onParameterAdded();
    form.reset();
    setDialogOpen(false);

  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" onClick={() => setDialogOpen(true)}>
          Add Habit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-6 space-y-6">
        <AlertDialogHeader className="space-y-4">
          <Card className="border-none shadow-lg">
            <CardHeader className="mb-6 p-4 pt-2 border-border border-b-2">
              <CardTitle>Add Habit</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="grid grid-cols-2 gap-4">
                  {/* Parameter Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Habit Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Water [L]" {...field} className="text-base sm:text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("type", value as FormData["type"]);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="string">Text</SelectItem>
                              <SelectItem value="boolean">Y/N</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Goal Operator */}
                  {form.watch("type") === "number" && (
                    <FormField
                      control={form.control}
                      name="goalOperator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Operator</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="=">=</SelectItem>
                                <SelectItem value=">">&gt;</SelectItem>
                                <SelectItem value="<">&lt;</SelectItem>
                                <SelectItem value=">=">&gt;=</SelectItem>
                                <SelectItem value="<=">&lt;=</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/* Goal Value */}
                  {form.watch("type") === "boolean" ? (
                    <FormField
                      control={form.control}
                      name="goalValue"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Goal Value</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Value" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="goalValue"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Goal Value</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                form.watch("type") === "number"
                                  ? "0"
                                  : "Dear Diary ..."
                              }
                              type={
                                form.watch("type") === "number"
                                  ? "number"
                                  : "text"
                              }
                              {...field}
                              className="text-base sm:text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-end p-0 space-x-4">
                  <AlertDialogCancel asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        form.reset();
                        setDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  {/* Submit button */}
                  <Button type="submit">Confirm</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
