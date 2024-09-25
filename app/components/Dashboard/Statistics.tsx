"use client";

// components/Statistics.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { IGoal } from "@/app/types/Goal";
import { getData } from "@/app/utils/sendRequest";
import { useToast } from "@/hooks/use-toast";

export default function Statistics() {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const fetchGoals = async () => {
    const { status, data } = await getData("/api/goals");
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch goals",
        variant: "destructive",
      });
      return;
    }

    const totalGoals = data.length;
    const completedGoals = data.filter(
      (goal: IGoal) => goal.status === "Completed"
    ).length;
    const progress = Math.round((completedGoals / totalGoals) * 100);
    setProgress(progress);
  };

  useEffect(() => {
    fetchGoals();
  }, []);
  return (
    <Card className="order-2 xl:order-4">
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
