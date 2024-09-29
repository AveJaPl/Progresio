// components/GoalTable.tsx

"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { IGoal } from "@/app/types/Goal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import AddGoalModal from "@/app/components/Goals/AddGoalModal";
import EditGoalModal from "@/app/components/Goals/EditGoalModal";

type GoalTableProps = {
  goals: IGoal[];
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
  onCreateGoal: (data: any) => void;
  onEdit: (data: any, id: string) => void;
};

export default function GoalTable({
  goals,
  onDelete,
  onReset,
  onCreateGoal,
  onEdit,
}: GoalTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch = goal.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const descriptionMatchesSearch = goal.description
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const dateMatchesSearch = format(new Date(goal.deadline), "PPP", {
      locale: enUS,
    })
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && goal.status.toLowerCase() === "active") ||
      (filter === "completed" && goal.status.toLowerCase() === "completed");
    return (
      (matchesSearch || descriptionMatchesSearch || dateMatchesSearch) &&
      matchesFilter
    );
  });

  return (
    <>
      <Card className="h-full border-0 lg:border-[1px] lg:border-border">
        <CardHeader className="flex flex-row lg:justify-between justify-end space-y-0 px-0 lg:p-6">
          <h2 className="hidden lg:block text-xl font-semibold">Goals</h2>

          <div className="flex justify-end w-full lg:w-1/2 gap-4">
            <Input
              type="text"
              placeholder="Search goals"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-2/3 lg:w-56 text-base sm:text-sm"
            />
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "active" | "completed")
              }
            >
              <SelectTrigger className="w-1/3 lg:w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 lg:p-6">
          <ScrollArea className="lg:h-[calc(70vh-250px)] w-full p-0 lg:p-4">
            <ScrollBar />
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filteredGoals.length === 0 ? (
                <div className="text-muted-foreground text-center col-span-3">
                  No goals found
                </div>
              ) : (
                filteredGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className="grid grid-rows-3 grid-cols-[1fr_auto]"
                  >
                    <CardHeader className="col-span-3 flex flex-row justify-between space-y-0">
                      <h2>{goal.title}</h2>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(goal.deadline), "PPP", {
                          locale: enUS,
                        })}
                      </div>
                    </CardHeader>
                    <CardContent className="row-span-2 min-h-32 text-sm pl-6 pb-6 pr-2 text-muted-foreground">
                      <ScrollArea className="h-36 w-full">
                        <pre className="whitespace-pre-wrap">
                          {goal.description}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="row-span-2 flex flex-col items-end justify-end h-full pb-6 pr-6 pl-0">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          className="order-2 sm:order-1"
                          onClick={() => onDelete(goal.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          className="order-1 sm:order-2"
                          disabled={goal.status.toLowerCase() === "active"}
                          onClick={() => onReset(goal.id)}
                        >
                          Reset
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Przyciski do otwierania modali na urządzeniach mobilnych */}
      <div className="fixed bottom-4 left-4 lg:hidden">
        <Button onClick={() => setAddDialogOpen(true)}>Add Goal</Button>
      </div>
      <div className="fixed bottom-4 right-4 lg:hidden">
        <Button onClick={() => setEditDialogOpen(true)}>Edit</Button>
      </div>

      {/* Modal dodawania celu */}
      <AddGoalModal
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreateGoal={onCreateGoal}
      />

      {/* Modal edycji celu */}
      <EditGoalModal
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        goals={goals}
        onEdit={onEdit}
      />
    </>
  );
}
