// app/goals/page.tsx

"use client";

import { useState, useEffect } from "react";
import GoalForm from "@/app/components/Goals/GoalForm";
import GoalTable from "@/app/components/Goals/GoalTable";
import { IGoal, GoalFormData } from "@/app/types/Goal";
import GoalEditForm from "@/app/components/Goals/GoalEditForm";
import { GoalFormEditData } from "@/app/types/Goal";
import { useToast } from "@/hooks/use-toast";
import { getData, postData } from "@/app/utils/sendRequest";
import Loading from "@/app/components/loading";

export default function Goals() {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fetchGoals = async () => {
    try {
      const { status, data } = await getData("/api/goals");

      if (status !== 200) {
        toast({
          title: "Error",
          description: "Failed to fetch goals",
          variant: "destructive",
        });
        return;
      }
      setGoals(data);
    } catch (error) {
      console.error("Błąd podczas pobierania celów:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGoals();
    setLoading(false);
  }, []);

  const addGoal = async (data: GoalFormData) => {
    const { status } = await postData("/api/goals", {
      title: data.title,
      status: "Active",
      deadline: data.deadline.toISOString(),
      description: data.description,
    });

    toast({
      title: status === 201 ? "Goal added" : "Error",
      description:
        status === 201
          ? "Goal has been added successfully"
          : "Failed to add goal.",
      variant: status === 201 ? "default" : "destructive",
    });

    await fetchGoals();
  };

  const editGoal = async (data: GoalFormEditData, id: string) => {
    await fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        deadline: data.deadline.toISOString(),
        description: data.description,
      }),
    })
      .then(() => {
        toast({
          title: "Goal edited",
          description: "Goal has been edited successfully",
        });
        fetchGoals();
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to edit goal.",
          variant: "destructive",
        });
      });
  };
  const deleteGoal = async (id: string) => {
    await fetch(`/api/goals/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        toast({
          title: "Goal deleted",
          description: "Goal has been deleted successfully",
        });
        fetchGoals();
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete goal.",
          variant: "destructive",
        });
      });
  };

  if (loading) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        <div className="flex flex-row gap-4">
          <GoalForm onSubmit={addGoal} />
          <GoalEditForm goals={goals} onSubmit={editGoal} loading={loading} />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Formularz dodawania nowego celu */}
      <div className="flex flex-row gap-4">
        <GoalForm onSubmit={addGoal} />
        <GoalEditForm goals={goals} onSubmit={editGoal} loading={loading} />
      </div>

      {/* Tabela z listą celów */}
      <GoalTable goals={goals} onDelete={deleteGoal} />
    </div>
  );
}
