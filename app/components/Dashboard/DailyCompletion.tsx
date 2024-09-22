import {
  Card,
} from "@components/ui/card";
import GoalsList from "./GoalsList";
import DailyParameters from "./DailyParameters";

export default function DailyCompletion() {
  return (
    <Card className="col-span-3 grid grid-cols-4 grid-rows[1fr,1fr,auto]">
      <GoalsList />
      <DailyParameters />
    </Card>
  );
}
