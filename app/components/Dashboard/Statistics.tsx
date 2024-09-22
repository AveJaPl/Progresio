"use client";

// components/Statistics.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { IGoal } from "@/app/types/Goal";

export default function Statistics() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("/api/goals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const totalGoals = data.length;
        const completedGoals = data.filter(
          (goal: IGoal) => goal.status === "Completed"
        ).length;
        const progress = Math.round((completedGoals / totalGoals) * 100);
        setProgress(progress);
      });
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statystyki</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>Postęp Twoich celów:</p>
          <Progress value={progress} className="w-full mt-2" />
          <p className="text-sm text-gray-500 mt-1">{progress}% ukończone</p>
        </div>
        <div className="mt-4">
          <p></p>
          <p className="text-sm text-gray-500 mt-1">{progress} dni</p>
        </div>
      </CardContent>
    </Card>
  );
}
