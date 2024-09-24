// app/parameters/page.tsx
"use client";
import { useEffect, useState } from "react";
import ParametersList from "@/app/components//Parameters/ParametersList";
import AddParameterDialog from "@/app/components//Parameters/AddParameterDialog";
import { Card } from "@/components/ui/card";
import { ParameterWithCount } from "@/app/types/Parameter";
import { getData } from "@/app/utils/sendRequest";

export default function Parameters() {
  const [parameters, setParameters] = useState<ParameterWithCount[]>([]);

  const fetchParameters = async () => {
    const getResponse = await getData("/api/parameters");
    setParameters(getResponse.data);
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  return (
    <Card className="grid border-none col-span-3 grid-rows[1fr,1fr,auto]">
      <div className="p-4">
        <ParametersList
          parameters={parameters}
          onDelete={fetchParameters}
          onUpdate={fetchParameters}
        />
      </div>
      <div className="fixed bottom-4 left-4">
        <AddParameterDialog onParameterAdded={fetchParameters} />
      </div>
    </Card>
  );
}
