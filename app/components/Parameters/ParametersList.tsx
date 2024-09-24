// components/ParametersList.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ParameterWithCount } from "@/app/types/Parameter";

interface ParametersListProps {
  parameters: ParameterWithCount[];
  onDelete: (id: string) => void;
  onUpdate: (parameter: ParameterWithCount) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Parameter name is required"),
  type: z.enum(["number", "string", "boolean"]),
  goalOperator: z.enum(["=", ">", "<", ">=", "<="]).optional(),
  goalValue: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ParametersList({
  parameters,
  onDelete,
  onUpdate,
}: ParametersListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] =
    useState<ParameterWithCount | null>(null);

  const filteredParameters = parameters.length ? parameters.filter((parameter) => {
    return parameter.name.toLowerCase().includes(search.toLowerCase());
  }) : [];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "number",
      goalOperator: "=",
      goalValue: "",
    },
  });

  useEffect(() => {
    if (selectedParameter) {
      form.reset({
        name: selectedParameter.name,
        type: selectedParameter.type,
        goalOperator: selectedParameter.goalOperator || "=",
        goalValue: selectedParameter.goalValue || "",
      });
    }
  }, [selectedParameter, form]);

  const handleDelete = (id: string) => {
    fetch(`/api/parameters/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Parameter deleted successfully",
            variant: "default",
          });
          onDelete(id);
        } else {
          throw new Error("Failed to delete parameter");
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete parameter",
          variant: "destructive",
        });
      });
  };

  const handleEditClick = (parameter: ParameterWithCount) => {
    setSelectedParameter(parameter);
    setEditDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (selectedParameter) {
      fetch(`/api/parameters/${selectedParameter.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            toast({
              title: "Success",
              description: "Parameter updated successfully",
              variant: "default",
            });
            onUpdate({ ...selectedParameter, ...data });
            setEditDialogOpen(false);
            setSelectedParameter(null);
          } else {
            return response.json().then((errorData) => {
              throw new Error(errorData.error || "Failed to update parameter");
            });
          }
        })
        .catch((error: Error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between px-0 py-4">
        <CardTitle className="hidden xl:block">Parameters</CardTitle>
        <Input
          placeholder="Search parameters"
          className="w-full xl:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredParameters.map((parameter) => (
          <Card
            key={parameter.id}
            className="grid hover:scale-[1.01] cursor-pointer"
            onClick={() => router.push(`/parameters/${parameter.id}`)}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{parameter.name}</CardTitle>
              <Badge variant="outline" className={`bg-primary`}>
                {parameter.type}
              </Badge>
            </CardHeader>
            <CardFooter className="flex justify-between p-4">
              <Button
                variant="outline"
                className="border-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(parameter);
                }}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(parameter.id);
                }}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Parameter Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="p-6 space-y-6">
          <AlertDialogHeader className="space-y-4">
            <Card className="border-none shadow-lg">
              <CardHeader className="mb-6 p-4 pt-2 border-border border-b-2">
                <CardTitle>Edit Parameter</CardTitle>
              </CardHeader>
              {selectedParameter && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid grid-cols-2 gap-4">
                      {/* Parameter Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Parameter Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Water [L]" {...field} />
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
                                disabled={selectedParameter.dataEntriesCount > 0}
                                onValueChange={(value) => {
                                  field.onChange(value as FormData["type"]);
                                  form.setValue(
                                    "type",
                                    value as FormData["type"]
                                  );
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
                            {selectedParameter.dataEntriesCount > 0 && (
                              <p className="text-sm text-gray-500">
                                Type cannot be changed because data entries exist.
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Goal Operator and Goal Value */}
                      {/* Only render if no data entries exist */}
                      {selectedParameter.dataEntriesCount === 0 && (
                        <>
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
                                      value={field.value}
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
                                      value={field.value}
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
                                          : "Enter text..."
                                      }
                                      type={
                                        form.watch("type") === "number"
                                          ? "number"
                                          : "text"
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end p-0 space-x-4">
                      <AlertDialogCancel asChild>
                        <Button
                          type="button"
                          onClick={() => {
                            form.reset();
                            setEditDialogOpen(false);
                            setSelectedParameter(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </AlertDialogCancel>
                      {/* Submit button */}
                      <Button type="submit">Save Changes</Button>
                    </CardFooter>
                  </form>
                </Form>
              )}
            </Card>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
