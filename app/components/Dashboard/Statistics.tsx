"use client";

// components/Statistics.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/app/context/DashboardContext";
export default function Statistics() {
  const { goalProgress, parameterProgress } = useAppContext();

  return (
    <Card className="order-2 xl:order-4">
      <CardHeader>
        <CardTitle>Stats this week</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div>
          <p>Your goal progress:</p>
          <Progress value={goalProgress.total === 0 ? 0 : goalProgress.finished / goalProgress.total * 100} className="w-full mt-2" />
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 mt-1">
              {goalProgress.total === 0 ? 0 : (goalProgress.finished / goalProgress.total * 100).toFixed()}% finished
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {goalProgress.total === 0 ? "" : `${goalProgress.total - goalProgress.finished} goals left`}
            </p>
          </div>
        </div>
        <div>
          <p>Your habits progress:</p>
          <Progress value={parameterProgress} className="w-full mt-2" />
          <p className="text-sm text-gray-500 mt-1">
            {parameterProgress.toFixed()}% finished
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
