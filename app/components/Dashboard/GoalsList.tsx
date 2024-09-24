"use client";

import { useEffect, useState } from "react";
import { IGoal } from "@/app/types/Goal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // import Checkbox from shadcn UI
import { Label } from "@/components/ui/label"; // optional for better accessibility
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getData } from "@/app/utils/sendRequest";
export default function GoalsList() {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<{
    [key: string]: boolean;
  }>({});
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
    setGoals(data);
    const initialCompletedGoals = data.reduce(
      (acc: { [key: string]: boolean }, goal: IGoal) => {
        acc[goal.id] = false; // Initially set all goals as not completed
        return acc;
      },
      {}
    );
    setCompletedGoals(initialCompletedGoals);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCheckboxChange = (goalId: string) => {
    setCompletedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId], // Toggle completion status
    }));
  };

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Your Active Goals</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <ul>
          <ScrollArea className="h-80 w-full">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="grid grid-cols-[1fr_auto] items-center border-border border-b py-4 pr-6"
                onClick={() => handleCheckboxChange(goal.id)}
              >
                <Label
                  className={`${
                    completedGoals[goal.id] ? "line-through text-gray-400" : ""
                  }`}
                >
                  {goal.title}
                </Label>
                <Checkbox checked={completedGoals[goal.id]} />
              </li>
            ))}
          </ScrollArea>
        </ul>
        <div className="flex justify-end">
          <Button variant="default" className="mt-4">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
