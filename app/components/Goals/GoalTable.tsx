// components/GoalTable.tsx

"use client";

import { format } from "date-fns";
import { pl, enUS } from "date-fns/locale";
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
} from "@/components/ui/select"; // Import Select components
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type GoalTableProps = {
  goals: IGoal[];
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
};

export default function GoalTable({
  goals,
  onDelete,
  onReset,
}: GoalTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all"); // New state for filter

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

  const formattedDescription = (description: string) => {
    return description.length > 50
      ? description.slice(0, 50) + "..."
      : description;
  };
  const formattedMobileDescription = (description: string) => {
    return description.length > 100
      ? description.slice(0, 100) + "..."
      : description;
  };

  return (
    <>
      <Card className="h-full hidden">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <h2 className="text-xl font-semibold">Goals</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search goals"
              className="w-56 md:w-72 xl:w-96"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* Filter Select */}
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "active" | "completed")
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-9 gap-4 space-y-2 border-border border-b-2 py-2">
            <div className="col-span-1">Title</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Deadline</div>
            <div className="col-span-1">Delete</div>
            <div className="col-span-1">Reset Status</div>
          </div>
          <ScrollArea className="h-[calc(100vh-650px)] w-full">
            {filteredGoals.map((goal) => (
              <div
                key={goal.id}
                className="grid grid-cols-9 gap-4 border-border border-b py-2 items-center"
              >
                <div className="col-span-1">{goal.title}</div>
                <div className="col-span-3" title={goal.description}>
                  {formattedDescription(goal.description as string)}
                </div>
                <div className="col-span-1">{goal.status}</div>
                <div className="col-span-2">
                  {format(new Date(goal.deadline), "PPP", { locale: enUS })}
                </div>
                <div className="col-span-1">
                  <Button onClick={() => onDelete(goal.id)}>Delete</Button>
                </div>
                <div className="col-span-1">
                  <Button
                    disabled={goal.status.toLowerCase() === "active"}
                    onClick={() => onReset(goal.id)}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader className="flex flex-row justify-between space-y-0">
          <h2 className="text-xl font-semibold">Goals</h2>

          <div className="flex justify-end w-1/2 gap-4">
            <Input
              type="text"
              placeholder="Search goals"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "active" | "completed")
              }
            >
              <SelectTrigger className="w-40">
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
        <CardContent>
          <ScrollArea className="h-[calc(70vh-250px)] w-full p-4">
            <ScrollBar />
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filteredGoals.map((goal) => (
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
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
