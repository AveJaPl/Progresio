// app/page.tsx
import Summary from "@/app/components/Dashboard/Summary";
import LastGoals from "@/app/components/Dashboard/LastGoals";
import RecentActivities from "@/app/components/Dashboard/RecentActivities";
import Statistics from "@/app/components/Dashboard/Statistics";
import GoalsList from "@/app/components/Dashboard/GoalsList";
import DailyParameters from "@/app/components/Dashboard/DailyParameters";

export default function Dashboard() {
  return (
    <div className="grid gap-4 grid-rows-2">
      <div className="grid grid-cols-4 gap-4">
        <Summary />
        <LastGoals />
        <RecentActivities />
        <Statistics />
      </div>
      <div className="grid gap-4">
        <div className="col-span-3 grid grid-cols-4 grid-rows[1fr,1fr,auto] gap-4">
          <GoalsList />
          <DailyParameters />
        </div>
      </div>
    </div>
  );
}
