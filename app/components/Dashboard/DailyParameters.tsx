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

export default function DailyParameters() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    data: [] as { id: string; value: any }[],
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

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
      value: param.type === "boolean" ? true : "",
    }));

    setFormData((prev) => ({
      ...prev,
      data: initialFormData,
    }));
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleSubmit = async (dataToPost: Record<string, any>) => {
    const {status} = await postData("/api/daily-parameters", dataToPost);
    
    // TODO obsłużyć Modal który pyta czy wysłać dane z tego samego dnia -> zobacz api/daily-parameters.ts code 400
    // if (status == 400) {
    //   setModalOpen(true);
    //   return;
    // }

    toast({
      variant: status == 200 ? "default" : "destructive",
      title: status == 200 ? "Success" : "Error",
      description: status == 200 ? "Parameter added successfully" : "Failed to add parameters",
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

  const handleUpdate = () => {
    // check for any wrong values in booleand fields
    const booleanFields = parameters.filter(
      (param) => param.type === "boolean"
    );
    let dataToSubmit = [...formData.data];
    if (booleanFields.length > 0) {
      booleanFields.forEach((param) => {
        const fieldIndex = dataToSubmit.findIndex(
          (item) => item.id === param.id
        );

        if (fieldIndex !== -1) {
          const fieldValue = dataToSubmit[fieldIndex].value;

          // Correct the boolean field values
          if (fieldValue === "No") {
            dataToSubmit[fieldIndex].value = false;
          } else if (fieldValue === "Yes") {
            dataToSubmit[fieldIndex].value = true;
          }
        }
      });
    }

    const mappedData = dataToSubmit.map((param) => ({
      ...param,
      value: param.value.toString(),
    }));

    handleSubmit({
      date: formData.date,
      data: mappedData,
    });
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
                      value={paramData?.value ? "Yes" : "No"}
                      onValueChange={(value) =>
                        handleInputChange(parameter.id, value === "Yes")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Value" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={parameter.type === "number" ? "number" : "text"}
                      value={
                        parameter.type === "number"
                          ? Number(paramData?.value)
                          : paramData?.value || ""
                      }
                      onChange={(e) => {
                        const value =
                          parameter.type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                        handleInputChange(parameter.id, value);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-end">
        <Button onClick={handleUpdate}>Update</Button>
      </CardFooter>
    </Card>
  );
}
