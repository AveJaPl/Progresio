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

interface DailyParametersProps {
  onSubmit: (data: Record<string, any>) => void;
}

export default function DailyParameters({ onSubmit }: DailyParametersProps) {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch("/api/parameters", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data: Parameter[]) => {
        setParameters(data);
        // Inicjalizuj formData na podstawie pobranych parametrów
        const initialFormData: Record<string, any> = {};
        data.forEach((param) => {
          initialFormData[param.id] = param.goalValue;
        });
        setFormData(initialFormData);
      });
  }, []);

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = () => {
    // check for any wrong values in booleand fields
    const booleanFields = parameters.filter(
      (param) => param.type === "boolean"
    );
    const newRecords = {} as Record<string, any>;
    let dataToSubmit = formData;
    if (booleanFields.length > 0) {
      booleanFields.forEach((param) => {
        if (formData[param.id] == "No") {
          newRecords[param.id] = false;
        } else if (formData[param.id] == "Yes") {
          newRecords[param.id] = true;
        } else {
          newRecords[param.id] = formData[param.id];
        }
      });

      for (const [key, value] of Object.entries(newRecords)) {
        dataToSubmit[key] = value;
      }
    }
    onSubmit(dataToSubmit);
  };

  return (
    <Card className="flex flex-col border-none col-span-3">
      <CardHeader>
        <CardTitle>Your Daily Parameters</CardTitle>
      </CardHeader>
      <CardContent className="h-full grid grid-cols-5 gap-4 grid-rows-2">
        {parameters.map((parameter) => (
          <Card key={parameter.id} className="mb-4 grid">
            <CardHeader>
              <CardTitle>{parameter.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {parameter.type === "boolean" ? (
                <Select
                  value={formData[parameter.id] ? "Yes" : "No"}
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
                      ? Number(formData[parameter.id])
                      : formData[parameter.id]
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
        ))}
      </CardContent>
      <CardFooter className="flex justify-end items-end">
        <Button onClick={handleUpdate}>Update</Button>
      </CardFooter>
    </Card>
  );
}
