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
import Loading from "@/app/components/loading";
import { Parameter } from "@/app/types/Parameter";
import { getData } from "@/app/utils/sendRequest";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, differenceInDays, startOfDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { deleteData, putData } from "@/app/utils/sendRequest";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MdTrendingFlat } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { FaFire } from "react-icons/fa";
import { AiOutlineNumber } from "react-icons/ai";
import { RiCloseCircleFill, RiCheckboxCircleFill } from "react-icons/ri";

export default function ParameterPage() {
  const { id } = useParams();
  const [parameter, setParameter] = useState<Parameter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    value: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { toast } = useToast();
  const [stats, setStats] = useState({
    Average: "0%",
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

    const total = data.dataEntries.length;

    const habitType = data.type;
    let fails;
    if (habitType === "number") {
      fails = data.dataEntries.filter((entry: any) => {
        if (data.goalOperator === ">=") {
          return Number(entry.value) < Number(data.goalValue);
        }
        if (data.goalOperator === "<=") {
          return Number(entry.value) > Number(data.goalValue);
        }
        if (data.goalOperator === ">") {
          return Number(entry.value) <= Number(data.goalValue);
        }
        if (data.goalOperator === "<") {
          return Number(entry.value) >= Number(data.goalValue);
        }
        if (data.goalOperator === "=") {
          return Number(entry.value) !== Number(data.goalValue);
        }
      }).length;
    } else if (habitType === "boolean") {
      fails = data.dataEntries.filter(
        (entry: any) =>
          entry.value != (data?.goalValue == "Yes" ? "true" : "false")
      ).length;
    } else if (habitType === "string") {
      fails = data.dataEntries.filter(
        (entry: any) => entry.value !== data.goalValue
      ).length;
    }

    const successes = total - fails;

    let average;

    if (data.type === "number") {
      average = `${(
        data.dataEntries.reduce(
          (acc: number, entry: any) => acc + Number(entry.value),
          0
        ) / total
      ).toFixed()}`;
    } else {
      average = `${((successes / total) * 100).toFixed()}%`;
    }

    // Initialize streak variables
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let previousDate: Date | null = null;

    // Define isSuccessForNumber function
    const isSuccessForNumber = (value: number) => {
      if (data.goalOperator === ">=") {
        return value >= Number(data.goalValue);
      } else if (data.goalOperator === "<=") {
        return value <= Number(data.goalValue);
      } else if (data.goalOperator === ">") {
        return value > Number(data.goalValue);
      } else if (data.goalOperator === "<") {
        return value < Number(data.goalValue);
      } else if (data.goalOperator === "=") {
        return value === Number(data.goalValue);
      } else {
        return false;
      }
    };

    // Sort entries by date ascending
    const sortedEntries = data.dataEntries.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Iterate over sorted entries to compute streaks
    sortedEntries.forEach((entry: any) => {
      let isSuccess: boolean = false;

      if (data.type === "number") {
        isSuccess = isSuccessForNumber(Number(entry.value));
      } else if (data.type === "boolean") {
        isSuccess =
          entry.value === (data.goalValue === "Yes" ? "true" : "false");
      } else if (data.type === "string") {
        isSuccess = entry.value === data.goalValue;
      }
      const entryDate = startOfDay(new Date(entry.date));
      const today = startOfDay(new Date());

      if (entryDate > today) {
        return;
      }
      if (isSuccess) {
        if (previousDate === null) {
          tempStreak = 1;
        } else {
          const daysDifference = differenceInDays(entryDate, previousDate);
          if (daysDifference === 1) {
            tempStreak += 1;
          } else if (daysDifference === 0) {
            // Same day, do nothing
          } else {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
      previousDate = entryDate;
    });

    // Determine current streak
    const today = startOfDay(new Date());
    const daysSinceLastEntry = previousDate
      ? differenceInDays(today, previousDate)
      : null;

    if (daysSinceLastEntry !== null && daysSinceLastEntry === 0) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }

    setStats({
      Average: average,
      "Longest streak": longestStreak,
      "Current streak": currentStreak,
      Total: total,
      Fails: fails,
      Successes: successes,
    });
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
        const valueMatchesSearch =
          parameter.type === "boolean"
            ? (entry.value === "true" ? "Yes" : "No")
                .toLowerCase()
                .includes(search.toLowerCase())
            : entry.value.toLowerCase().includes(search.toLowerCase());
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

  const handleDelete = async (id: string) => {
    const { status } = await deleteData(`/api/daily-parameters/${id}`);
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to delete parameter",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Parameter deleted successfully",
      variant: "default",
    });

    fetchParameter();
  };

  const handleEdit = async () => {
    const { status } = await putData(`/api/daily-parameters/${editData.id}`, {
      value: editData.value,
    });
    if (status !== 200) {
      toast({
        title: "Error",
        description: "Failed to edit parameter",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Parameter edited successfully",
      variant: "default",
    });
    setEditData({
      id: "",
      value: "",
    });
    fetchParameter();
  };

  return (
    <div className="flex flex-col gap-0 sm:gap-4">
      <Card className="w-full border-0 sm:border">
        <CardHeader className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-9 gap-4 space-y-0 p-0 sm:p-6">
          {/* Here display general info about Parameter like name, type goal eg. >= 3000 */}
          <div className="col-span-2 sm:col-span-1">
            {stats["Current streak"] === stats["Longest streak"] && (
              <Alert className="sm:hidden rounded-xl mb-4 pl-6">
                {/* Fa fire icon colored orange */}
                <FaFire className="text-2xl" style={{ color: "orange" }} />
                <AlertTitle>Keep it up!</AlertTitle>
                <AlertDescription>
                  You are on your longest streak!
                </AlertDescription>
              </Alert>
            )}
            <Card className="flex flex-row items-center justify-between px-4 py-3 sm:p-4">
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
            <Card className="flex flex-row items-center justify-center sm:justify-between px-4 py-3 sm:p-4">
              <CardHeader className="hidden sm:flex flex-row items-center p-0">
                <CardTitle>Type:</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-center p-0">
                <p>{parameter.type}</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="flex flex-row items-center justify-between px-4 py-3 sm:p-4">
              <CardHeader className="flex flex-row items-center p-0">
                <CardTitle>
                  Goal{parameter.type === "boolean" ? ":" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2 p-0">
                <div>
                  {parameter.type === "boolean" ? "" : parameter.goalOperator}
                </div>
                <div>{parameter.goalValue}</div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
        <CardContent className="hidden sm:grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <Card className="flex flex-col items-center" key={key}>
              <CardHeader className="flex flex-row space-y-0 items-center">
                {key === "Average" && (
                  <MdTrendingFlat className="mr-2 text-xl text-blue-500" />
                )}
                {key === "Longest streak" && (
                  <GiTrophyCup className="mr-2 text-xl text-yellow-500" />
                )}
                {key === "Current streak" && (
                  <FaFire className="mr-2 text-xl text-orange-500" />
                )}
                {key === "Total" && (
                  <AiOutlineNumber className="mr-2 text-xl text-purple-500" />
                )}
                {key === "Fails" && (
                  <RiCloseCircleFill className="mr-2 text-xl text-red-500" />
                )}
                {key === "Successes" && (
                  <RiCheckboxCircleFill className="mr-2 text-xl text-green-500" />
                )}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredEntries.length === 0 ? (
              <div className="text-muted-foreground text-center col-span-full">
                No habits found
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className="grid grid-cols-3">
                  <div className="col-span-2 grid grid-cols-1">
                    <CardHeader>
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
                    <CardContent>
                      <Card className="flex flex-row items-center justify-between p-4 rounded-md">
                        <CardHeader className="p-0">
                          <CardTitle className="p-0 text-muted-foreground">
                            Value:{" "}
                            {parameter.type === "boolean"
                              ? entry.value === "true"
                                ? "Yes"
                                : "No"
                              : entry.value}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div>
                            {parameter.type === "boolean" ? (
                              <div className="flex flex-row items-center gap-2">
                                <Badge
                                  variant={
                                    entry.value ==
                                    (parameter.goalValue === "Yes"
                                      ? "true"
                                      : "false")
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="w-16 flex items-center justify-center"
                                >
                                  {entry.value ==
                                  (parameter.goalValue === "Yes"
                                    ? "true"
                                    : "false")
                                    ? "Success"
                                    : "Fail"}
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
                  <CardFooter className="flex flex-col items-end justify-end gap-4">
                    <Button
                      variant="secondary"
                      className="flex flex-row items-center w-20"
                      onClick={() => {
                        setEditData({
                          id: entry.id,
                          value: entry.value,
                        });
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-row items-center w-20"
                      onClick={() => {
                        setEditData({
                          id: entry.id,
                          value: entry.value,
                        });
                        setDeleteModalOpen(true);
                      }}
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
      {/* Modal for editing data */}
      <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
        <AlertDialogContent className="space-y-6 p-0">
          <Card className="border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Data</CardTitle>
              <Button disabled variant="outline">
                {editData.id
                  ? format(
                      parameter.dataEntries.find(
                        (entry) => entry.id === editData.id
                      )?.date || new Date(),
                      "PPP"
                    )
                  : "Pick a date"}
              </Button>
            </CardHeader>
            <CardContent>
              {parameter.type === "string" ? (
                <Input
                  type="text"
                  placeholder="Enter new value"
                  value={editData.value}
                  onChange={(e) =>
                    setEditData({
                      id: editData.id,
                      value: e.target.value,
                    })
                  }
                  className="w-full"
                />
              ) : parameter.type === "number" ? (
                <Input
                  type="number"
                  placeholder="Enter new value"
                  value={editData.value}
                  onChange={(e) =>
                    setEditData({
                      id: editData.id,
                      value: e.target.value,
                    })
                  }
                  className="w-full"
                />
              ) : parameter.type === "boolean" ? (
                <Select
                  value={String(editData.value)}
                  onValueChange={(value) =>
                    setEditData({
                      id: editData.id,
                      value: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : null}
            </CardContent>
            <CardFooter className="flex justify-end p-4 space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditData({
                    id: "",
                    value: "",
                  });
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleEdit();
                  setModalOpen(false);
                }}
              >
                Confirm
              </Button>
            </CardFooter>
          </Card>
        </AlertDialogContent>
      </AlertDialog>
      {/* Are you sure modal for deletion */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="p-0 space-y-6">
          <Card className="border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Are you sure?</CardTitle>
              <Button disabled variant="outline">
                {editData.id
                  ? format(
                      parameter.dataEntries.find(
                        (entry) => entry.id === editData.id
                      )?.date || new Date(),
                      "PPP"
                    )
                  : "Pick a date"}
              </Button>
            </CardHeader>
            <CardContent>
              <p>Do you want to delete this data?</p>
            </CardContent>
            <CardFooter className="flex justify-end p-4 space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDelete(editData.id);
                  setDeleteModalOpen(false);
                }}
              >
                Confirm
              </Button>
            </CardFooter>
          </Card>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
