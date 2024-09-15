import React, { useState } from "react";
import { Parameter } from "@/types/types";
import { ConfirmModal } from "./ConfirmModal";
import { toast } from "react-toastify";

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
  const [progressData, setProgressData] = useState(parameter.progress); // Local state for progress data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  // New state for search filters
  const [searchValue, setSearchValue] = useState<string>("");

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOnClose = () => {
    setSelectedId("");
    setIsModalOpen(false);
  };

  const handleOnConfirm = () => {
    deleteProgress();
    setIsModalOpen(false);
  };

  const deleteProgress = async () => {
    try {
      const res = await fetch(`/api/progress`, {
        method: "DELETE",
        body: JSON.stringify({ id: selectedId }),
      });
      if (res.ok) {
        // Toast about successful deletion
        toast.success("Progress deleted successfully");

        // Update local progressData state to reflect the deletion
        setProgressData((prevData) =>
          prevData.filter((item) => item.id !== selectedId)
        );
      } else {
        throw new Error("Failed to delete progress");
      }
    } catch (error) {
      console.error("Error deleting progress:", error);
    }
  };

  const filteredProgress = React.useMemo(() => {
    // Filter progress data based on search criteria
    return progressData.filter((item) => {
      const itemDate = new Date(item.date);
      const year = itemDate.getFullYear();
      const month = String(itemDate.getMonth() + 1).padStart(2, "0");
      const day = String(itemDate.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

      const matchesValue = !searchValue || item.value.toString().includes(searchValue); // Match if no search or if value matches

      const matchesDate = !searchValue || date.includes(searchValue); // Match if no search or if date matches

      return matchesValue || matchesDate;
    });
  }, [progressData, searchValue]);

  const sortedProgress = React.useMemo(() => {
    let sortableItems = [...filteredProgress]; // Use filtered data from state
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
  }, [filteredProgress, sortConfig, parameter.type]); // Use filteredProgress in memo

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

      {/* Search inputs */}

      <input
        type="text"
        placeholder="Search"
        className="border p-2 rounded w-full mb-2"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
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
              <th className="text-left p-3 font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProgress.map((item) => {
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
                  <td className="p-3 text-gray-700">
                    <button
                      className="bg-red-500 text-white p-2 text-sm rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => handleOnClose()}
        onConfirm={() => handleOnConfirm()}
        message="Are you sure you want to delete this progress?"
      />
    </div>
  );
};

export default ProgressTable;
