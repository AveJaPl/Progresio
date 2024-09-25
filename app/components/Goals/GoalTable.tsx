// components/GoalTable.tsx

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import { IGoal } from "@/app/types/Goal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
type GoalTableProps = {
  goals: IGoal[];
  onDelete: (id: string) => void;
};

export default function GoalTable({ goals, onDelete }: GoalTableProps) {
  const [search, setSearch] = useState("");
  const filteredGoals = goals.filter((goal) =>
    goal.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold">Goals</h2>
        <Input
          type="text"
          placeholder="Search goals"
          className=" w-56 md:w-72 xl:w-96"
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-4 space-y-2 border-border border-b-2 py-2">
          <div className="col-span-3">Title</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Deadline</div>
          <div className="col-span-1">Actions</div>
        </div>
        <ScrollArea className="h-[calc(100vh-650px)] w-full">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="grid grid-cols-8 gap-4 space-y-2 border-border border-b py-2"
            >
              <div className="col-span-3">{goal.title}</div>
              <div className="col-span-1">{goal.status}</div>
              <div className="col-span-3">
                {format(new Date(goal.deadline), "PPP", { locale: enUS })}
              </div>
              <div className="col-span-1">
                <Button onClick={() => onDelete(goal.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
