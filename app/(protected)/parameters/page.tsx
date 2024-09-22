// app/parameters/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Parameter } from "@/app/types/Parameter";
import ParametersList from "@/app/components//Parameters/ParametersList";
import AddParameterDialog from "@/app/components//Parameters/AddParameterDialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Parameters() {
  const [parameters, setParameters] = useState<Parameter[]>([]);

  const fetchParameters = () => {
    fetch("/api/parameters", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setParameters(data));
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  return (
    <Card className="grid border-none col-span-3 grid-rows[1fr,1fr,auto]">
      <div className="p-4">
        <ParametersList parameters={parameters} onDelete={fetchParameters} />
      </div>
      <div className="fixed bottom-4 right-4">
        <AddParameterDialog onParameterAdded={fetchParameters} />
      </div>
    </Card>
  );
}
