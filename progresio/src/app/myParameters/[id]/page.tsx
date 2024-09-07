// src/app/myParameters/[id]/page.tsx (Server Component)
"use client";

import ProgressDetailsBoolean from "@/app/components/ProgressDetailsBoolean";
import ProgressDetailsFloat from "@/app/components/ProgressDetailsFloat";
import ProgressDetailsInt from "@/app/components/ProgressDetailsInt";
import { useEffect, useState } from "react";

interface Progress {
  id: number;
  date: string;
  value: string;
  parameterId: number;
}

interface ParameterWithProgress {
  id: number;
  name: string;
  type: string;
  progress: Progress[];
}

export default function ParameterPage({ params }: { params: { id: string } }) {
  const [parameter, setParameter] = useState<ParameterWithProgress | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        const res = await fetch(`/api/parameters/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch parameter");
        }
        const data = await res.json();
        setParameter(data.parameter);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParameter();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!parameter) {
    return <div>No parameter found</div>;
  }

  // Choose the correct component based on the parameter type
  let ProgressComponent;
  switch (parameter.type) {
    case "float":
      ProgressComponent = ProgressDetailsFloat;
      break;
    case "int":
      ProgressComponent = ProgressDetailsInt;
      break;
    case "boolean":
      ProgressComponent = ProgressDetailsBoolean;
      break;
    default:
      return <div>Unsupported parameter type</div>; // Handle unsupported types
  }

  return (
    <div>
      <h1>Parameter: {parameter.name}</h1>
      <p>Type: {parameter.type}</p>
      {/* Render the appropriate component */}
      <ProgressComponent progress={parameter.progress} />
    </div>
  );
}
