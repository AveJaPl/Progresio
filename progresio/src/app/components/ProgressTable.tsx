import React, { useState } from "react";
import { Parameter } from "@/types/types";

interface ProgressTableProps {
  parameter: Parameter;
  calendarData: Record<string, boolean>;
}

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

const ProgressTable: React.FC<ProgressTableProps> = ({
  parameter,
  calendarData,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "descending",
  });

  const sortedProgress = React.useMemo(() => {
    let sortableItems = [...parameter.progress];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === "date") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === "value") {
          aValue =
            parameter.type === "int" || parameter.type === "float"
              ? parseFloat(aValue)
              : aValue;
          bValue =
            parameter.type === "int" || parameter.type === "float"
              ? parseFloat(bValue)
              : bValue;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [parameter.progress, sortConfig, parameter.type]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Progress Details
      </h3>
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-50 border-b sticky top-0">
            <tr>
              <th
                className="text-left p-3 font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort("date")}
              >
                Date{" "}
                {getClassNamesFor("date") === "ascending"
                  ? "▲"
                  : getClassNamesFor("date") === "descending"
                  ? "▼"
                  : ""}
              </th>
              <th
                className="text-left p-3 font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort("value")}
              >
                Value{" "}
                {getClassNamesFor("value") === "ascending"
                  ? "▲"
                  : getClassNamesFor("value") === "descending"
                  ? "▼"
                  : ""}
              </th>
              <th className="text-left p-3 font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProgress.map((item) => {
              // Adjust date to local time zone
              const dateObj = new Date(item.date);
              dateObj.setHours(0, 0, 0, 0);
              const year = dateObj.getFullYear();
              const month = String(dateObj.getMonth() + 1).padStart(2, "0");
              const day = String(dateObj.getDate()).padStart(2, "0");
              const date = `${year}-${month}-${day}`;

              const isFuture = dateObj > new Date();
              const isSuccess = calendarData[date];
              return (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-gray-50 transition ${
                    isFuture ? "opacity-50" : ""
                  }`}
                >
                  <td className="p-3 text-gray-700">{date}</td>
                  <td className="p-3 text-gray-700">
                    {parameter.type === "boolean"
                      ? item.value === "true"
                        ? "Yes"
                        : "No"
                      : item.value}
                  </td>
                  <td className="p-3 text-gray-700">
                    {isSuccess !== undefined ? (
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          isSuccess
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isSuccess ? "Success" : "Failure"}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTable;
