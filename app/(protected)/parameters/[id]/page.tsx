// [id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Loading from "@/app/components/loading";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProgressEntry {
  date: string;
  value: number;
  success: boolean;
}

interface Parameter {
  id: string;
  name: string;
  type: string;
  goalValue: string;
  goalOperator: string;
  progress: ProgressEntry[]; // Array for progress data
}

export default function ParameterPage() {
  const { id } = useParams();
  const [parameter, setParameter] = useState<Parameter | null>(null);
  const [loading, setLoading] = useState(true);
  const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0); // New streak counter
  const [search, setSearch] = useState(""); // Initialize search state

  useEffect(() => {
    fetch(`/api/parameters/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setParameter(data || null); // Ensure data is either an object or null
        setLoading(false);
        if (data && data.progress) {
          calculateStreak(data.progress);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const calculateStreak = (progress: ProgressEntry[]) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let failedDays = 0;
    let successStreak = 0;

    for (let i = 0; i < progress.length; i++) {
      if (progress[i].success) {
        currentStreak += 1;
        successStreak += 1;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
        failedDays += 1;
      }
    }
    setConsecutiveSuccesses(longestStreak);
  };

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

  // Safeguard against empty or undefined progress array
  const progressData = parameter.progress ?? [];

  // Calculate statistics
  const totalSuccesses = progressData.filter((entry) => entry.success).length;
  const totalFailures = progressData.length - totalSuccesses;
  const latestEntrySuccess =
    progressData.length > 0 && progressData[progressData.length - 1].success;

  const filteredProgressData = progressData.filter((entry) => {
    return entry.value.toString().includes(search);
  });

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{parameter.name}</CardTitle>
          <Badge variant="outline" className="bg-primary">
            {parameter.type}
          </Badge>
        </CardHeader>
        <CardContent>
          {/* Statistics Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold">Longest Streak</h3>
              <p className="text-2xl font-semibold">{consecutiveSuccesses}</p>
              <p className="text-muted-foreground">Times in a row</p>
            </div>
            <div className="p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold">Total Successes</h3>
              <p className="text-2xl font-semibold">{totalSuccesses}</p>
              <p className="text-muted-foreground">Days achieved</p>
            </div>
            <div className="p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold">Total Failures</h3>
              <p className="text-2xl font-semibold">{totalFailures}</p>
              <p className="text-muted-foreground">Days failed</p>
            </div>
          </div>

          {/* Progress Table */}
          <h2 className="text-lg font-semibold mb-4">Progress Entries</h2>
          <div className="overflow-x-auto">
            {progressData.length > 0 ? (
              <Card className="h-full">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Goals</h2>
                  <Input
                    type="text"
                    placeholder="Search goals"
                    className="w-1/3"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 space-y-2 border-border border-b-2 py-2">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Value</div>
                    <div className="col-span-1">Status</div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-650px)] w-full">
                    {filteredProgressData.map((entry, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-4 space-y-2 border-border border-b py-2"
                      >
                        <div className="col-span-2">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div>{entry.value}</div>
                        <div>
                          <Badge
                            className={
                              entry.success
                                ? `bg-green-500 text-white`
                                : `bg-red-500 text-white`
                            }
                          >
                            {entry.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <p>No progress entries available.</p>
            )}
          </div>

          {/* Latest entry status */}
          {latestEntrySuccess ? (
            <Alert className="mt-6" variant="default">
              Congratulations! You achieved your goal in the last entry.
            </Alert>
          ) : (
            <Alert className="mt-6" variant="destructive">
              You missed your goal in the last entry. Keep pushing!
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
