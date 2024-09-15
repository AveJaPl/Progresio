"use client";

import ProgressComponent from "../../components/ProgressComponent";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/app/components/withAuth";
import { Parameter } from "@/types/types";
import Loading from "../../loading";

function ParameterPage({ params }: { params: { id: string } }) {
  const [parameter, setParameter] = useState<Parameter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        const res = await fetch(`/api/parameters/${params.id}`, {
          method: 'GET',
          credentials: 'include',
        });
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
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!parameter) {
    return <div>No parameter found</div>;
  }
  return (
    <>
      <ProgressComponent parameter={parameter} />
    </>
  );
}


export default withAuth(ParameterPage);