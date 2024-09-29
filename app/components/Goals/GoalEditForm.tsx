"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { IGoal, GoalFormEditData } from "@/app/types/Goal";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
export default function GoalEditForm({
  goals,
  onSubmit,
  loading,
}: {
  goals: IGoal[];
  onSubmit: (data: GoalFormEditData, id: string) => void;
  loading: boolean;
}) {
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [formData, setFormData] = useState<GoalFormEditData>({
    title: "",
    description: "",
    deadline: new Date(),
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const filteredGoals = goals.filter((goal) => goal.status === "Active");

  // Aktualizuj dane formularza po wybraniu celu
  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    const goal = goals.find((goal) => goal.id === goalId);
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || "",
        deadline: new Date(goal.deadline),
      });
    }
  };
  const handleSubmit = () => {
    if (selectedGoalId) {
      if (
        formData.title === "" ||
        formData.deadline === new Date() ||
        formData.description === ""
      ) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }

      onSubmit(formData, selectedGoalId);
      setSelectedGoalId("");
      setFormData({
        title: "",
        description: "",
        deadline: new Date(),
      });
    }
  };

  return (
    <Card className="w-full flex lg:w-1/2 flex-col">
      <CardHeader className="grid grid-cols-2 space-y-0 h-20">
        <h2 className="text-xl font-semibold">Edit Goal</h2>
        <Select value={selectedGoalId} onValueChange={handleGoalSelect}>
          <SelectTrigger id="goal">
            <SelectValue placeholder={loading ? "Loading..." : "Select Goal"} />
          </SelectTrigger>
          <SelectContent>
            {filteredGoals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4 h-full">
        {selectedGoalId && (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Nazwa celu"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="text-base sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.deadline
                      ? format(formData.deadline, "PPP")
                      : "Wybierz datę"}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => {
                      setFormData({
                        ...formData,
                        deadline: date || new Date(),
                      });
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description for your goal"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="text-base sm:text-sm"
              />
            </div>
            <div className="flex justify-end items-end col-span-2 xl:col-span-1">
              <Button
                onClick={() => {
                  handleSubmit();
                }}
                disabled={!selectedGoalId}
              >
                Save changes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
