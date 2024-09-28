"use client"

// components/RecentActivities.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useAppContext } from "@/app/context/DashboardContext";
export default function RecentActivities() {
  const { activities } = useAppContext();

  return (
    <Card className="row-span-2 hidden xl:block xl:order-3">
      <CardHeader>
        <CardTitle>Ostatnie Aktywności</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities?.map((activity, index) => (
            <li key={index} className="flex items-center">
              <Activity className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
