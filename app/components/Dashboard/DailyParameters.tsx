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
import { Label } from "@/components/ui/label";
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

export default function DailyParameters() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    data: [] as { id: string; value: any }[],
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const fetchParameters = async () => {
    const getResponse = await getData("/api/parameters");
    if (getResponse.status !== 200) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch parameters",
      });
      return;
    }
    setParameters(getResponse.data);
    const initialFormData = getResponse.data.map((param: Parameter) => ({
      id: param.id,
      value: param.type === "boolean" ? false : "",
    }));

    setFormData((prev) => ({
      ...prev,
      data: initialFormData,
    }));
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleSubmit = async (
    dataToPost: Record<string, any>,
    overwrite: boolean
  ) => {
    const { status } = await postData("/api/daily-parameters", {
      ...dataToPost,
      overwrite,
    });

    if (status === 400) {
      setModalOpen(true);
      return;
    }

    toast({
      variant: status === 200 ? "default" : "destructive",
      title: status === 200 ? "Success" : "Error",
      description:
        status === 200
          ? "Parameter added successfully"
          : "Failed to add parameters",
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

  return (
    <Card className="flex flex-col col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Daily Parameters</CardTitle>
        <div className="w-52">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  setFormData({ ...formData, date: date || new Date() });
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="h-full p-4 flex flex-row">
        <div className="w-3/4 h-full grid grid-cols-3 gap-4 grid-rows-[auto_1fr]">
          {parameters.map((parameter) => {
            const paramData = formData.data.find(
              (item) => item.id === parameter.id
            );

            return (
              <Card key={parameter.id} className="mb-4 grid border-none">
                <CardContent className="pb-0 space-y-2">
                  <Label>{parameter.name}</Label>
                  {parameter.type === "boolean" ? (
                    <Select
                      value={String(paramData?.value)}
                      onValueChange={(value) =>
                        handleInputChange(parameter.id, value === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Value" />
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
                      placeholder= {parameter.type === "number" ? "Enter a number" : "Enter a value"}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-end">
        <Button onClick={() => handleUpdate()}>Update</Button>
      </CardFooter>
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="p-6 space-y-6">
          <AlertDialogHeader className="space-y-4">
            <Card className="border-none shadow-lg">
              <CardHeader className="mb-6 p-4 pt-2 border-border border-b-2">
                <CardTitle>Data Already Exists</CardTitle>
              </CardHeader>
              <CardContent>
                Data for this date already exists. Do you want to overwrite it?
              </CardContent>
              <CardFooter className="flex justify-end p-0 space-x-4">
                <AlertDialogCancel asChild>
                  <Button
                    onClick={() => {
                      setModalOpen(false);
                      toast({
                        variant: "default",
                        title: "Ok!",
                        description: "Data not overwritten",
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
