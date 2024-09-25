// components/RecentActivities.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function RecentActivities() {
  const activities = [
    { action: "Zalogowano się", date: "2023-10-01 12:34" },
    { action: "Edytowano profil", date: "2023-09-28 09:21" },
    { action: "Dodano nowy cel", date: "2023-09-25 15:47" },
  ];

  return (
    <Card className="row-span-2 hidden xl:block xl:order-3">
      <CardHeader>
        <CardTitle>Ostatnie Aktywności</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
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
