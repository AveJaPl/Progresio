"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Parameter } from "@/app/types/Parameter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { getData, postData } from "@/app/utils/sendRequest";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Loading from "@/app/components/loading";
import { useAppContext } from "@/app/context/DashboardContext";
import { CheckCircle, Hash, TextCursorInput } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DailyParameters() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    data: [] as { id: string; value: any }[],
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshParameters } = useAppContext();

  const fetchParameters = async () => {
    const getResponse = await getData("/api/parameters");
    if (getResponse.status !== 200) {
      return;
    }
    setParameters(getResponse.data);
    updateFormDataForDate(new Date(), getResponse.data);
  };

  // Funkcja do aktualizacji formData dla wybranej daty
  const updateFormDataForDate = (date: Date, params: Parameter[]) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const initialFormData = params.map((param) => ({
      id: param.id,
      value:
        param.dataEntries.find(
          (entry) =>
            new Date(entry.date).toISOString() === targetDate.toISOString()
        )?.value || "",
    }));

    setFormData({
      date: targetDate,
      data: initialFormData,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchParameters().then(() => setLoading(false));
  }, []);

  const handleSubmit = async (
    dataToPost: Record<string, any>,
    overwrite: boolean
  ) => {
    console.log(dataToPost);
    const { status } = await postData("/api/daily-parameters", {
      ...dataToPost,
      overwrite,
    });

    if (status === 400) {
      setModalOpen(true);
      return;
    }

    if (status === 200) {
      refreshParameters();
      fetchParameters();
    }

    toast({
      variant: status === 200 ? "default" : "destructive",
      title: status === 200 ? "Success" : "Error",
      description:
        status === 200
          ? "Parameters have been successfully added."
          : "Failed to add parameters.",
    });
    return;
  };

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      data: prev.data.map((param) =>
        param.id === id ? { ...param, value } : param
      ),
    }));
  };

  const handleUpdate = (overwriteFlag = false) => {
    const mappedData = formData.data.map((param) => {
      const parameterDefinition = parameters.find((p) => p.id === param.id);
      let value = param.value;

      if (parameterDefinition?.type === "number") {
        value = Number(param.value);
      } else if (parameterDefinition?.type === "boolean") {
        value = param.value === "true" || param.value === true;
      }

      return {
        id: param.id,
        value: value.toString(),
      };
    });

    handleSubmit(
      {
        date: formData.date,
        data: mappedData,
      },
      overwriteFlag
    );
  };

  if (loading) {
    return (
      <Card className="flex flex-col col-span-3">
        <Loading />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col col-span-3">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle>Your Habits</CardTitle>
        <div className="sm:w-52">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="sm:w-full sm:justify-between flex gap-4 sm:gap-0"
              >
                <span className="hidden sm:flex">
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </span>
                <span className="flex sm:hidden">
                  {formData.date ? format(formData.date, "P") : "Pick a date"}
                </span>
                <CalendarIcon className="h-6 w-6 sm:h-4 sm:w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  setFormData((prev) => ({
                    ...prev,
                    date: date || new Date(),
                  }));
                  updateFormDataForDate(date || new Date(), parameters);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px]">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {parameters.map((parameter) => {
              const paramData = formData.data.find(
                (item) => item.id === parameter.id
              );

              return (
                <Card key={parameter.id}>
                  <CardHeader className="flex flex-row justify-start items-center space-y-0 gap-2 pb-4">
                    {parameter.type === "boolean" && (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    )}
                    {parameter.type === "number" && (
                      <Hash className="text-blue-500 w-5 h-5" />
                    )}
                    {parameter.type === "string" && (
                      <TextCursorInput className="text-purple-500 w-5 h-5" />
                    )}
                    <CardTitle>{parameter.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {parameter.type === "boolean" ? (
                      <Select
                        value={String(paramData?.value)}
                        onValueChange={(value) =>
                          handleInputChange(parameter.id, value === "true")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={parameter.type === "number" ? "number" : "text"}
                        value={paramData?.value || ""}
                        onChange={(e) => {
                          handleInputChange(parameter.id, e.target.value);
                        }}
                        placeholder={
                          parameter.type === "number"
                            ? "Enter a number"
                            : "Enter a value"
                        }
                        className="w-full text-base sm:text-sm"
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end p-4">
        <Button onClick={() => handleUpdate()}>Update</Button>
      </CardFooter>
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="p-2 space-y-6">
          <AlertDialogHeader className="space-y-4">
            <Card className="bg-background border-none">
              <CardHeader className="p-4">
                <CardTitle>Data Already Exists</CardTitle>
              </CardHeader>
              <CardContent>
                Data for this date already exists. Do you want to overwrite it?
              </CardContent>
              <CardFooter className="flex justify-end p-4 space-x-4">
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setModalOpen(false);
                      toast({
                        variant: "default",
                        title: "Cancelled",
                        description: "Data was not overwritten.",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={() => {
                      handleUpdate(true);
                      setModalOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                </AlertDialogAction>
              </CardFooter>
            </Card>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
