"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { GoalFormData } from "@/app/types/Goal";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function GoalForm({
  onSubmit,
}: {
  onSubmit: (data: GoalFormData) => void;
}) {
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    status: "",
    deadline: new Date(),
    description: "",
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (
      formData.title === "" ||
      formData.status === "" ||
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
    onSubmit(formData);
    setFormData({
      title: "",
      status: "",
      deadline: new Date(),
      description: "",
    });
  };

  return (
    <Card className="w-1/2 flex flex-col">
      <CardHeader className="h-20">
        <h2 className="text-xl font-semibold">Create new goal</h2>
      </CardHeader>
      <CardContent className="space-y-4 h-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="title">Title</Label>
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
            <Label htmlFor="deadline">Deadline</Label>
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
                    setFormData({ ...formData, deadline: date || new Date() });
                    setCalendarOpen(false);
                  }}
                  initialFocus
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
            />
          </div>
          <div className="flex justify-end items-end">
            <Button onClick={handleSubmit}>Create goal</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
