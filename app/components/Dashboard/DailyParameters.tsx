"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Parameter } from "@/app/types/Parameter";

export default function DailyParameters() {
  const [parameters, setParameters] = useState<Parameter[]>([]);

  useEffect(() => {
    fetch("/api/parameters", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setParameters(data));
  }, []);

  const handleClick = () => {
    fetch("/api/parameters", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(parameters),
    });
  };

  return (
    <Card className="grid border-none col-span-3 grid-rows[1fr,1fr,auto]">
      <CardHeader>
        <CardTitle>Your daily Parameters</CardTitle>
      </CardHeader>
      <CardContent className="h-full"></CardContent>
      <CardFooter className="flex justify-end items-end">
        <Button onClick={handleClick}>Update</Button>
      </CardFooter>
    </Card>
  );
}
