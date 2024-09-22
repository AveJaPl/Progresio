// app/goals/page.tsx

"use client";

import { useState, useEffect } from "react";
import GoalForm from "@/app/components/Goals/GoalForm";
import GoalTable from "@/app/components/Goals/GoalTable";
import { IGoal, GoalFormData } from "@/app/types/Goal";
import GoalEditForm from "@/app/components/Goals/GoalEditForm";
import { GoalFormEditData } from "@/app/types/Goal";
import { useToast } from "@/hooks/use-toast";

export default function Goals() {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const { toast } = useToast();
  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      if (!response.ok) {
        throw new Error("Nie udało się pobrać celów.");
      }
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Błąd podczas pobierania celów:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (data: GoalFormData) => {
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        status: "Active",
        deadline: data.deadline.toISOString(),
        description: data.description,
      }),
    })
      .then(() => {
        toast({
          title: "Goal added",
          description: "Goal has been added successfully",
        });
        fetchGoals();
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to add goal.",
          variant: "destructive",
        });
      });
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

  return (
    <div className="space-y-4">
      {/* Formularz dodawania nowego celu */}
      <div className="flex flex-row gap-4">
        <GoalForm onSubmit={addGoal} />
        <GoalEditForm goals={goals} onSubmit={editGoal} />
      </div>

      {/* Tabela z listą celów */}
      <GoalTable goals={goals} onDelete={deleteGoal} />
    </div>
  );
}
