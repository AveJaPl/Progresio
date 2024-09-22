"use client"

import {
  Card,
} from "@components/ui/card";
import GoalsList from "./GoalsList";
import DailyParameters from "./DailyParameters";

export default function DailyCompletion() {

  const handleSubmit = (data: Record<string, any>) => {
    console.log(data);
  }

  return (
    <Card className="col-span-3 grid grid-cols-4 grid-rows[1fr,1fr,auto]">
      <GoalsList />
      <DailyParameters onSubmit={handleSubmit} />
    </Card>
  );
}
