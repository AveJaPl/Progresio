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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { GoalFormData } from "@/app/types/Goal";
import { useToast } from "@/hooks/use-toast";

type AddGoalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (data: any) => void;
};

export default function AddGoalModal({
  isOpen,
  onClose,
  onCreateGoal,
}: AddGoalModalProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    status: "",
    deadline: new Date(),
    description: "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateSubmit = () => {
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
    onCreateGoal(formData);
    setFormData({
      title: "",
      status: "",
      deadline: new Date(),
      description: "",
    });
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* Set fixed height and make the modal a flex container */}
      <AlertDialogContent className="sm:max-w-lg h-[500px] flex flex-col justify-start">
        <AlertDialogHeader className="flex justify-center items-start">
          <h2 className="text-xl font-semibold">Create New Goal</h2>
        </AlertDialogHeader>
        {/* Make the content area scrollable and allow it to grow */}
        <div className="overflow-y-auto flex-grow">
          {/* Formularz dodawania celu */}
          <div className="flex flex-col space-y-4 p-2">
            <div>
              <Label htmlFor="title" className="mb-1">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Title for your goal"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="deadline" className="mb-1">
                Deadline
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.deadline
                      ? format(formData.deadline, "PPP")
                      : "Pick a date"}
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
                    initialFocus
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
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={7}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateSubmit}>Create goal</Button>
            </div>
          </div>
        </div>
        <AlertDialogCancel className="absolute top-4 right-4">
          Cancel
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
