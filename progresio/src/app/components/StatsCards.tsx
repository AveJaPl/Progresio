import React from "react";

interface StatsCardsProps {
  summary: {
    totalEntries: number;
    successes: number;
    failures: number;
    successRate: number;
    averageValue: number | null;
  };
  streak: { current: number; longest: number };
  weeklyStats: {
    averagePerWeek: number;
    currentWeekComparison: string;
    bestWeek: string;
  };
  goalOperator: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  summary,
  streak,
  weeklyStats,
  goalOperator,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <p className="text-gray-600 text-sm">Total Entries</p>
          <p className="text-2xl font-bold text-yellow-500">
            {summary.totalEntries}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <p className="text-gray-600 text-sm">Successes</p>
          <p className="text-2xl font-bold text-green-500">
            {summary.successes}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <p className="text-gray-600 text-sm">Failures</p>
          <p className="text-2xl font-bold text-red-500">
            {summary.failures}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <p className="text-gray-600 text-sm">Success Rate</p>
          <p className="text-2xl font-bold text-purple-500">
            {summary.successRate}%
          </p>
        </div>
        {summary.averageValue !== null && (
          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
            <p className="text-gray-600 text-sm">Average Value</p>
            <p className="text-2xl font-bold text-teal-500">
              {summary.averageValue}
            </p>
          </div>
        )}
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <p className="text-gray-600 text-sm">Longest Streak</p>
          <p className="text-2xl font-bold text-blue-500">
            {streak.longest}d
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <p className="text-gray-600 text-sm">Current Streak</p>
          <p className="text-2xl font-bold text-indigo-500">
            {streak.current}d
          </p>
        </div>
        {/* Weekly stats only if goalOperator is not "=" */}
        {goalOperator !== "=" &&
          weeklyStats.currentWeekComparison !== "No weekly data" && (
            <>
              <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center">
                <p className="text-gray-600 text-sm">Average per Week</p>
                <p className="text-2xl font-bold text-orange-500">
                  {weeklyStats.averagePerWeek}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center col-span-2 lg:col-span-1">
                <p className="text-gray-600 text-sm">
                  Comparison with Previous Week
                </p>
                <p className="text-lg font-bold text-pink-500">
                  {weeklyStats.currentWeekComparison}
                </p>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default StatsCards;
