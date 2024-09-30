// [id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Loading from "@/app/components/loading";
import { Parameter } from "@/app/types/Parameter";
import { StreakResult } from "@/app/types/StreakResult";
import { getData } from "@/app/utils/sendRequest";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

export default function ParameterPage() {
  const { id } = useParams();
  const [parameter, setParameter] = useState<Parameter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { toast } = useToast();
  const [stats, setStats] = useState({
    Average: 0,
    "Longest streak": 0,
    "Current streak": 0,
    Total: 0,
    Fails: 0,
    Successes: 0,
  });

  const fetchParameter = async () => {
    const { status, data } = await getData(`/api/parameters/${id}`);
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to fetch parameter",
        variant: "destructive",
      });
      return;
    }
    console.log(data);
    setParameter(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchParameter();
  }, [id]);

  // search for entries in parameter using date or value sort using date
  const filteredEntries =
    parameter?.dataEntries
      ?.filter((entry) => {
        const dateMatchesSearch = format(entry.date, "P")
          .toLowerCase()
          .includes(search.toLowerCase());
        const valueMatchesSearch = entry.value
          .toLowerCase()
          .includes(search.toLowerCase());
        return dateMatchesSearch || valueMatchesSearch;
      })
      .sort((a, b) => {
        return a.date > b.date ? -1 : 1;
      }) || [];

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

  const isSuccessForNumber = (value: number) => {
    if (parameter.goalOperator === ">=") {
      return value >= Number(parameter.goalValue);
    } else if (parameter.goalOperator === "<=") {
      return value <= Number(parameter.goalValue);
    } else if (parameter.goalOperator === ">") {
      return value > Number(parameter.goalValue);
    } else if (parameter.goalOperator === "<") {
      return value < Number(parameter.goalValue);
    } else if (parameter.goalOperator === "=") {
      return value === Number(parameter.goalValue);
    }
  };

  return (
    <div className="flex flex-col gap-0 sm:gap-4">
      <Card className="w-full border-0 sm:border">
        <CardHeader className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-9 gap-4 space-y-0 p-0 sm:p-6">
          {/* Here display general info about Parameter like name, type goal eg. >= 3000 */}
          <div className="col-span-2 sm:col-span-1">
            <Card className="flex flex-row items-center justify-between px-4 py-3 sm:p-4 border-border sm:border-secondary-foreground">
              <CardHeader className="flex flex-row items-center p-0">
                <CardTitle>Name:</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-center p-0">
                <p>{parameter.name}</p>
              </CardContent>
            </Card>
          </div>
          <div className="hidden lg:block col-span-3 2xl:col-span-6"></div>
          <div>
            <Card className="flex flex-row items-center justify-center sm:justify-between px-4 py-3 sm:p-4 border-border sm:border-secondary-foreground">
              <CardHeader className="hidden sm:flex flex-row items-center p-0">
                <CardTitle>Type:</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-center p-0">
                <p>{parameter.type}</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="flex flex-row items-center justify-between px-4 py-3 sm:p-4 border-border sm:border-secondary-foreground">
              <CardHeader className="flex flex-row items-center p-0">
                <CardTitle>Goal</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2 p-0">
                <div>{parameter.goalOperator}</div>
                <div>{parameter.goalValue}</div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
        <CardContent className="hidden sm:grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">
          {/* Here display averages, longest streak etc (stats) in cards*/}
          {Object.entries(stats).map(([key, value]) => (
            <Card className="flex flex-col items-center" key={key}>
              <CardHeader>
                <CardTitle>{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{value}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      <Card className="w-full border-0 sm:border">
        <CardHeader className="flex flex-row space-y-0 items-center justify-between pr-0 pl-4 sm:p-6">
          <CardTitle>Habits</CardTitle>
          <Input
            type="text"
            placeholder="Search habits"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-2/3 lg:w-56 text-base sm:text-sm"
          />
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredEntries.length === 0 ? (
              <div className="text-muted-foreground text-center col-span-3">
                No habits found
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="grid grid-cols-3 sm:flex sm:flex-row sm:items-center"
                >
                  <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2">
                    <CardHeader className="sm:space-y-0">
                      <Button
                        variant="outline"
                        className="flex flex-row items-center"
                        disabled
                      >
                        <span className="hidden md:flex">
                          {entry.date
                            ? format(entry.date, "PPP")
                            : "Pick a date"}
                        </span>
                        <span className="flex md:hidden">
                          {entry.date ? format(entry.date, "P") : "Pick a date"}
                        </span>
                      </Button>
                    </CardHeader>
                    <CardContent className="sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <Card className="flex flex-row items-center justify-between p-4 sm:p-1 sm:justify-center rounded-md">
                        <CardHeader className="p-0">
                          <CardTitle className="p-0 text-muted-foreground">
                            Value: {entry.value}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div>
                            {parameter.type === "boolean" ? (
                              <div className="flex flex-row items-center gap-2">
                                <Badge
                                  variant={
                                    entry.value == "true"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="w-16 flex items-center justify-center"
                                >
                                  {entry.value == "true" ? "Success" : "Fail"}
                                </Badge>
                              </div>
                            ) : parameter.type === "number" ? (
                              <div className="flex flex-row items-center gap-2">
                                <Badge
                                  variant={
                                    isSuccessForNumber(Number(entry.value))
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="w-16 flex items-center justify-center"
                                >
                                  {isSuccessForNumber(Number(entry.value))
                                    ? "Success"
                                    : "Fail"}
                                </Badge>
                              </div>
                            ) : parameter.type === "string" ? (
                              <div className="flex flex-row items-center gap-2">
                                <Badge
                                  variant={
                                    entry.value === parameter.goalValue
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="w-16 flex items-center justify-center"
                                >
                                  {entry.value === parameter.goalValue
                                    ? "Success"
                                    : "Fail"}
                                </Badge>
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </div>
                  <CardFooter className="flex flex-col items-end justify-end gap-4 sm:flex-row">
                    <Button
                      variant="secondary"
                      className="flex flex-row items-center"
                      onClick={() => console.log("Simulate edit")}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-row items-center"
                      onClick={() => console.log("Simulate delete")}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
