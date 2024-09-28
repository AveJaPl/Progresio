"use client";

// components/LastGoals.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAppContext } from "@/app/context/DashboardContext";
import Loading from "@/app/components/loading";

export default function LastGoals() {
  const { upcomingGoals, loadingUpcomingGoals } = useAppContext();

  // Maximum number of rows
  const MAX_ROWS = 3;

  // Calculate the number of empty rows needed to fill the table
  const emptyRows =
    upcomingGoals.length < MAX_ROWS ? MAX_ROWS - upcomingGoals.length : 0;

  const formatDescription = (description?: string) => {
    if (!description) return "No description";
    return description.length > 110
      ? `${description.slice(0, 110)}...`
      : description;
  };

  return (
    <Card className="col-span-2 hidden xl:block xl:order-2">
      <CardHeader>
        <CardTitle>Upcoming Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Goal</TableHead>
              <TableHead className="w-2/4">Description</TableHead>
              <TableHead className="w-1/4">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-36">
            {loadingUpcomingGoals ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : upcomingGoals.length === 0 ? (
              // Render a message indicating no upcoming goals
              <TableRow className="h-12">
                <TableCell colSpan={3}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-2xl font-semibold text-muted-foreground mb-2">
                      No Upcoming Goals
                    </div>
                    <div className="text-gray-500">
                      You have no goals scheduled for the near future. Start
                      setting new goals to stay on track!
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Render existing goals
              upcomingGoals.slice(0, MAX_ROWS).map((goal) => (
                <TableRow key={goal.id} className="h-12">
                  <TableCell className="w-1/4">{goal.title}</TableCell>
                  <TableCell
                    className="w-2/4 text-xs break-all"
                    title={goal.description || "no description"}
                  >
                    {formatDescription(goal.description)}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {new Date(goal.deadline).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Add empty rows if there are fewer than MAX_ROWS */}
            {!loadingUpcomingGoals &&
              upcomingGoals.length > 0 &&
              emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, index) => (
                <TableRow
                  key={`empty-${index}`}
                  className="h-12 border-none hover:bg-transparent"
                >
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
