"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { GoalFormEditData, IGoal } from "@/app/types/Goal";
import { useToast } from "@/hooks/use-toast";

type EditGoalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  goals: IGoal[];
  onEdit: (data: any, id: string) => void;
};

export default function EditGoalModal({
  isOpen,
  onClose,
  goals,
  onEdit,
}: EditGoalModalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [editFormData, setEditFormData] = useState<GoalFormEditData>({
    title: "",
    description: "",
    deadline: new Date(),
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    const goal = goals.find((goal) => goal.id === goalId);
    if (goal) {
      setEditFormData({
        title: goal.title,
        description: goal.description || "",
        deadline: new Date(goal.deadline),
      });
    }
  };

  const handleEditSubmit = () => {
    if (selectedGoalId) {
      if (
        editFormData.title === "" ||
        editFormData.deadline === new Date() ||
        editFormData.description === ""
      ) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }
      onEdit(editFormData, selectedGoalId);
      setSelectedGoalId("");
      setEditFormData({
        title: "",
        description: "",
        deadline: new Date(),
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* Make the modal a flex container and align items to the start */}
      <AlertDialogContent className="sm:max-w-lg h-[calc(100vh-100px)] sm:h-[580px] flex flex-col justify-start pt-5">
        <AlertDialogHeader
            className="flex items-start justify-center"
        >
          <h2 className="text-xl font-semibold">Edit Goal</h2>
        </AlertDialogHeader>
        {/* Allow the content area to grow and remove extra padding */}
        <div className="overflow-y-auto flex-grow">
          {/* Formularz edycji celu */}
          <div className="flex flex-col space-y-4 p-2">
            <div>
              <Label htmlFor="goal-select" className="mb-1">
                Select Goal
              </Label>
              <Select value={selectedGoalId} onValueChange={handleGoalSelect}>
                <SelectTrigger id="goal-select">
                  <SelectValue placeholder="Select Goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals
                    .filter((goal) => goal.status === "Active")
                    .map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedGoalId && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="title" className="mb-1">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Title of the goal"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    className="text-base sm:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline" className="mb-1">
                    Deadline
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {editFormData.deadline
                          ? format(editFormData.deadline, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editFormData.deadline}
                        onSelect={(date) => {
                          setEditFormData({
                            ...editFormData,
                            deadline: date || new Date(),
                          });
                          setCalendarOpen(false);
                        }}
                        
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="description" className="mb-1">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Description for your goal"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    className="text-base sm:text-sm"
                    rows={7}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleEditSubmit} disabled={!selectedGoalId}>
                    Save changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <AlertDialogCancel className="absolute top-4 right-4">
          Cancel
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
