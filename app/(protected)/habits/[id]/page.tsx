// [id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import Loading from "@/app/components/loading";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParameterWithCount } from "@/app/types/Parameter";
import { calculateStreak } from "@/app/utils/calculateStreak";
import { StreakResult } from "@/app/types/StreakResult";

export default function ParameterPage() {
  const { id } = useParams();
  const [parameter, setParameter] = useState<ParameterWithCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestEntrySuccess, setLatestEntrySuccess] = useState<boolean | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [streakResult, setStreakResult] = useState<StreakResult>({
    currentStreak: 0,
    longestStreak: 0,
    totalSuccesses: 0,
    totalFailures: 0,
    latestEntrySuccess: null,
  });

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        const response = await fetch(`/api/parameters/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch parameter");
        }
        const data: ParameterWithCount = await response.json();
        setParameter(data || null);
        if (data) {
          setStreakResult(calculateStreak(data));
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchParameter();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!parameter) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">Parameter not found</Alert>
      </div>
    );
  }

  // Sort and filter dataEntries based on search
  const sortedEntries = [...parameter.dataEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filteredProgressData = sortedEntries.filter((entry) => {
    // search by value and date
    return (
      entry.value.toLowerCase().includes(search.toLowerCase()) ||
      new Date(entry.date).toLocaleDateString().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row px-12 justify-between items-center">
        <CardTitle className="text-2xl font-semibold">
          {parameter.name}
        </CardTitle>
        <Badge variant="outline" className="bg-primary">
          {parameter.type}
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Statistics Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold">Longest Streak</h3>
            <p className="text-2xl font-semibold">
              {streakResult.longestStreak}
            </p>
            <p className="text-gray-600">Times in a row</p>
          </div>
          <div className="p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold">Total Successes</h3>
            <p className="text-2xl font-semibold">
              {streakResult.totalSuccesses}
            </p>
            <p className="text-gray-600">Days achieved</p>
          </div>
          <div className="p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold">Total Failures</h3>
            <p className="text-2xl font-semibold">
              {streakResult.totalFailures}
            </p>
            <p className="text-gray-600">Days failed</p>
          </div>
        </div>

        {/* Progress Table */}
        <h2 className="text-lg font-semibold mb-4">Progress Entries</h2>
        <div className="overflow-x-auto">
          {sortedEntries.length > 0 ? (
            <Card className="h-full">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Goals</h2>
                <div className="w-full flex items-center justify-end">
                  <Input
                    type="text"
                    placeholder="Search goals"
                    className="w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 space-y-2 border-b-2 border-gray-300 py-2">
                  <div className="col-span-2 font-medium">Date</div>
                  <div className="col-span-1 font-medium">Value</div>
                  <div className="col-span-1 font-medium">Status</div>
                </div>
                <ScrollArea className="h-80 w-full">
                  {filteredProgressData.map((entry) => {
                    // Determine success based on parameter's type and goal
                    let isSuccess = false;
                    const { goalOperator, goalValue, type } = parameter;
                    let parsedGoalValue: number | string | boolean;

                    if (type === "number") {
                      parsedGoalValue = parseFloat(goalValue);
                      const entryValue = parseFloat(entry.value);
                      if (isNaN(parsedGoalValue) || isNaN(entryValue)) {
                        isSuccess = false;
                      } else {
                        switch (goalOperator) {
                          case ">=":
                            isSuccess = entryValue >= parsedGoalValue;
                            break;
                          case "<=":
                            isSuccess = entryValue <= parsedGoalValue;
                            break;
                          case "=":
                            isSuccess = entryValue === parsedGoalValue;
                            break;
                          case ">":
                            isSuccess = entryValue > parsedGoalValue;
                            break;
                          case "<":
                            isSuccess = entryValue < parsedGoalValue;
                            break;
                          default:
                            isSuccess = false;
                        }
                      }
                    } else if (type === "boolean") {
                      parsedGoalValue =
                        goalValue.toLowerCase() === "yes" ? true : false;
                      const entryValue =
                        entry.value.toLowerCase() === "true" ? true : false;
                      isSuccess = entryValue === parsedGoalValue;
                    } else {
                      // string type
                      isSuccess = entry.value === goalValue;
                    }

                    return (
                      <div
                        key={entry.id}
                        className="grid grid-cols-4 gap-4 space-y-2 border-b py-2"
                      >
                        <div className="col-span-2">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div>{entry.value}</div>
                        <div>
                          <Badge
                            variant={isSuccess ? "default" : "outline"}
                            className="w-16 flex justify-center items-center"
                          >
                            {isSuccess ? "Success" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <p>No progress entries available.</p>
          )}
        </div>

        {/* Latest entry status */}
        {latestEntrySuccess !== null &&
          (latestEntrySuccess ? (
            <Alert className="mt-6" variant="default">
              Congratulations! You achieved your goal in the last entry.
            </Alert>
          ) : (
            <Alert className="mt-6" variant="destructive">
              You missed your goal in the last entry. Keep pushing!
            </Alert>
          ))}
      </CardContent>
    </Card>
  );
}
