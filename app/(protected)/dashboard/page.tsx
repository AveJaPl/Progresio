// app/page.tsx
import Summary from "@/app/components/Dashboard/Summary";
import UpcomingGoals from "@/app/components/Dashboard/UpcomingGoals";
import RecentActivities from "@/app/components/Dashboard/RecentActivities";
import Statistics from "@/app/components/Dashboard/Statistics";
import ActiveGoals from "@/app/components/Dashboard/ActiveGoals";
import DailyParameters from "@/app/components/Dashboard/DailyParameters";
import { AppProvider } from "@/app/context/DashboardContext";

export default function Dashboard() {
  return (
    <AppProvider>
      <div className="grid gap-4 xl:grid-rows-2">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <Summary />
          <UpcomingGoals />
          <RecentActivities />
          <Statistics />
        </div>
        <div className="w-full grid grid-cols-1 xl:grid-cols-4 xl:grid-rows[1fr,1fr,auto] space-y-4 xl:space-y-0 xl:gap-4">
          <ActiveGoals />
          <DailyParameters />
        </div>
      </div>
    </AppProvider>
  );
}
