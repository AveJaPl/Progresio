"use client"

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

export default function LastGoals() {
  const [goals, setGoals] = useState<IGoal[]>([]);

  useEffect(() => {
    fetch("/api/goals/upcoming", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setGoals(data));
  }
  , []);

  return (
    <Card className="col-span-2">
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
                <TableCell>{(new Date(goal.deadline)).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
