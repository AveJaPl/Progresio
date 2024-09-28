"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // import Checkbox from shadcn UI
import { Label } from "@/components/ui/label"; // optional for better accessibility
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/context/DashboardContext";
import Loading from "@/app/loading";

export default function GoalsList() {
  const [completedGoals, setCompletedGoals] = useState<{
    [key: string]: boolean;
  }>({});
  const { goals, loadingGoals, updateGoals } = useAppContext();

  const handleCheckboxChange = (goalId: string) => {
    setCompletedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId], // Toggle completion status
    }));
  };

  const handleSubmit = async () => {
    const completedGoalIds = Object.entries(completedGoals)
      .filter(([, value]) => value)
      .map(([key]) => key);

    await updateGoals(completedGoalIds);
  };

  return (
    <Card className="w-full xl:col-span-1 xl:h-full">
      <CardHeader>
        <CardTitle>Your Active Goals</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <ul>
          <ScrollArea className="h-80 w-full">
            {loadingGoals ? (
              <Loading />
            ) : goals.length === 0 ? (
              <li className="text-center text-gray-500 py-4">
                No active goals
              </li>
            ) : (
              goals.map((goal) => (
                <li
                  key={goal.id}
                  className="grid grid-cols-[1fr_auto] items-center border-border border-b py-4 pr-6"
                  onClick={() => handleCheckboxChange(goal.id)}
                >
                  <Label
                    className={`${
                      completedGoals[goal.id]
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {goal.title}
                  </Label>
                  <Checkbox checked={completedGoals[goal.id]} />
                </li>
              ))
            )}
          </ScrollArea>
        </ul>
        <div className="flex justify-end">
          <Button
            variant="default"
            className="mt-4"
            disabled={Object.values(completedGoals).every((value) => !value)}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
