"use client";

// components/LastGoals.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { IGoal } from "@/app/types/Goal";
import { getData } from "@/app/utils/sendRequest";
import { useToast } from "@/hooks/use-toast";

export default function LastGoals() {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const { toast } = useToast();

  const fetchUpcomingGoals = async () => {
    const { status, data } = await getData("/api/goals/upcoming");
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch upcoming goals",
        variant: "destructive",
      });
      return;
    }
    setGoals(data);
  };

  useEffect(() => {
    fetchUpcomingGoals();
  }, []);

  return (
    <Card className="col-span-2 hidden xl:block xl:order-2">
      <CardHeader>
        <CardTitle>Upcoming Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal, index) => (
              <TableRow key={index}>
                <TableCell>{goal.title}</TableCell>
                <TableCell>
                  {new Date(goal.deadline).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
