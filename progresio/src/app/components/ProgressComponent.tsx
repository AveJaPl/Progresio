"use client";

import { useState, useEffect } from "react";
import { Parameter } from "@/types/types";
import ProgressCalendar from "./ProgressCalendar";
import ProgressTable from "./ProgressTable";
import StatsCards from "./StatsCards";

interface ProgressDetailsProps {
  parameter: Parameter;
}

export default function ProgressComponent({ parameter }: ProgressDetailsProps) {
  const [streak, setStreak] = useState<{ current: number; longest: number }>({
    current: 0,
    longest: 0,
  });
  const [summary, setSummary] = useState<{
    totalEntries: number;
    successes: number;
    failures: number;
    successRate: number;
    averageValue: number | null;
  }>({
    totalEntries: 0,
    successes: 0,
    failures: 0,
    successRate: 0,
    averageValue: null,
  });
  const [weeklyStats, setWeeklyStats] = useState<{
    averagePerWeek: number;
    currentWeekComparison: string;
    bestWeek: string;
  }>({
    averagePerWeek: 0,
    currentWeekComparison: "",
    bestWeek: "",
  });
  const [calendarData, setCalendarData] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let currentStreak = 0;
    let longestStreak = 0;
    let successes = 0;
    let failures = 0;
    let totalEntries = 0;
    let streakOngoing = false;
    let totalValue = 0;
    const calendarData: Record<string, boolean> = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time to midnight

    // Sort progress entries by date
    const sortedProgress = [...parameter.progress]
      .filter((item) => new Date(item.date) <= today) // Filter out future dates
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Weekly data groups
    const weeklyData: { [key: string]: number[] } = {};

    sortedProgress.forEach((item) => {
      // Parse the item's date and adjust to local time
      const dateObj = new Date(item.date);
      dateObj.setHours(0, 0, 0, 0);

      // Construct date string in local time zone
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

      let isSuccess = false;
      totalEntries++;

      // Get week number
      const weekNumber = getWeekNumber(dateObj);

      if (!weeklyData[weekNumber]) {
        weeklyData[weekNumber] = [];
      }

      if (parameter.type === "boolean") {
        const itemValue = item.value === "true";
        const goalValue = parameter.goalValue === "true";
        isSuccess = itemValue === goalValue;
        totalValue += itemValue ? 1 : 0;
        weeklyData[weekNumber].push(itemValue ? 1 : 0);
      } else if (parameter.type === "int" || parameter.type === "float") {
        const itemValue = parseFloat(item.value);
        const goalValue = parseFloat(parameter.goalValue);
        totalValue += itemValue;
        weeklyData[weekNumber].push(itemValue);

        switch (parameter.goalOperator) {
          case "=":
            isSuccess = itemValue === goalValue;
            break;
          case ">":
            isSuccess = itemValue > goalValue;
            break;
          case "<":
            isSuccess = itemValue < goalValue;
            break;
          case ">=":
            isSuccess = itemValue >= goalValue;
            break;
          case "<=":
            isSuccess = itemValue <= goalValue;
            break;
          default:
            isSuccess = false;
        }
      }

      calendarData[date] = isSuccess;

      if (isSuccess) {
        successes++;
        if (streakOngoing) {
          currentStreak++;
        } else {
          streakOngoing = true;
          currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        failures++;
        streakOngoing = false;
        currentStreak = 0;
      }
    });

    const successRate =
      totalEntries > 0 ? ((successes / totalEntries) * 100).toFixed(2) : "0";

    let averageValue: number | null = null;
    if (parameter.type === "int" || parameter.type === "float") {
      averageValue = parseFloat((totalValue / totalEntries).toFixed(2));
    } else if (parameter.type === "boolean") {
      averageValue = parseFloat(((totalValue / totalEntries) * 100).toFixed(2));
    }

    // Calculate weekly stats only if goalOperator is not "="
    let averagePerWeek = 0;
    let currentWeekComparison = "";
    let bestWeek = "";

    if (parameter.goalOperator !== "=" && Object.keys(weeklyData).length > 0) {
      const weekNumbers = Object.keys(weeklyData).sort(
        (a, b) => parseInt(a) - parseInt(b)
      );
      const weeklyAverages = weekNumbers.map((week) => {
        const values = weeklyData[week];
        const average =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        return { week, average };
      });

      // Average per week
      averagePerWeek =
        weeklyAverages.reduce((sum, week) => sum + week.average, 0) /
        weeklyAverages.length;

      // Current week comparison
      if (weeklyAverages.length >= 2) {
        const lastWeek = weeklyAverages[weeklyAverages.length - 1];
        const prevWeek = weeklyAverages[weeklyAverages.length - 2];
        const difference = lastWeek.average - prevWeek.average;
        currentWeekComparison =
          difference > 0
            ? `Better by ${difference.toFixed(2)} than last week`
            : difference < 0
            ? `Worse by ${Math.abs(difference).toFixed(2)} than last week`
            : "Same as last week";
      } else {
        currentWeekComparison = "No data";
      }

      // Best week
      const bestWeekData = weeklyAverages.reduce((best, current) =>
        current.average > best.average ? current : best
      );
      bestWeek = `Week ${
        bestWeekData.week
      } with an average of ${bestWeekData.average.toFixed(2)}`;
    } else {
      averagePerWeek = 0;
      currentWeekComparison = "No weekly data";
      bestWeek = "No data";
    }

    setCalendarData(calendarData);
    setStreak({ current: currentStreak, longest: longestStreak });
    setSummary({
      totalEntries,
      successes,
      failures,
      successRate: parseFloat(successRate),
      averageValue: averageValue || null,
    });
    setWeeklyStats({
      averagePerWeek: parseFloat(averagePerWeek.toFixed(2)),
      currentWeekComparison,
      bestWeek,
    });
  }, [parameter]);

  const getMotivationalMessage = (): string => {
    if (streak.current >= 5) {
      return "Great job! Keep up the streak!";
    } else if (summary.successRate < 50) {
      return "Don't give up! Tomorrow will be better!";
    } else {
      return "You're doing well! Keep it up!";
    }
  };

  // Calculate week number
  function getWeekNumber(date: Date): string {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return String(
      Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto mt-8 p-4">
      {/* Goal Information */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{parameter.name}</h1>
        <p className="text-gray-600 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          Goal:{" "}
          <span className="font-medium text-gray-900">
            {parameter.type === "boolean"
              ? parameter.goalValue === "true"
                ? "Yes"
                : "No"
              : `${parameter.goalOperator} ${parameter.goalValue}`}
          </span>
        </p>
      </div>

      {/* Motivational Message */}
      <div className="my-6">
        <p className="text-xl font-semibold text-center text-gray-700">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Stats Cards */}
        <StatsCards
          summary={summary}
          streak={streak}
          weeklyStats={weeklyStats}
          goalOperator={parameter.goalOperator}
        />

        {/* Progress Calendar */}
        {/* <ProgressCalendar parameter={parameter} calendarData={calendarData} /> */}
        <div className="xl:col-span-1">
          {/* Progress Table */}
          <ProgressTable parameter={parameter} calendarData={calendarData} />
        </div>
      </div>
    </div>
  );
}
