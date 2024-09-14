"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal";
import { Parameter } from "@/types/types"; // Assuming you have a types file
import { FaSpinner } from "react-icons/fa";

export default function ProgressForm() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean | number>>({});
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const res = await fetch("/api/parameters");
        const data = await res.json();
        if (data && Array.isArray(data.parameters)) {
          setParameters(data.parameters || []);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setMessage("Failed to load parameters.");
      }
    };

    fetchParameters();
  }, []);

  const handleInputChange = (parameterId: string, value: boolean | number) => {
    setProgress((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const checkExistingEntry = async () => {
    try {
      const res = await fetch(`/api/progress?date=${date}T00:00:00.000Z`);
      const data = await res.json();
      return data.exists;
    } catch (error) {
      setMessage("Failed to check existing entries.");
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);
    setMessage("");

    const missingParameters = parameters.filter(
      (param) => progress[param.id] === undefined || progress[param.id] === null
    );

    if (missingParameters.length > 0) {
      setErrors(["Please fill out all fields before submitting."]);
      setIsSubmitting(false);
      return;
    }

    try {
      const entryExists = await checkExistingEntry();

      if (entryExists) {
        setIsModalOpen(true);
        setIsSubmitting(false);
        return;
      }

      await saveProgress();
    } catch (error) {
      setMessage("Failed to save progress.");
      setIsSubmitting(false);
    }
  };

  const saveProgress = async () => {
    try {
      for (const parameterId in progress) {
        const value = progress[parameterId];
        await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parameterId: parameterId,
            value: value,
            date: `${date}T00:00:00.000Z`,
          }),
          credentials: "include",
        });
      }

      setMessage("Progress saved successfully!");
      setProgress({});
    } catch (error) {
      setMessage("Failed to save progress.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverwrite = async () => {
    setIsModalOpen(false);
    setIsSubmitting(true);
    try {
      await saveProgress();
    } catch (error) {
      setMessage("Failed to overwrite progress.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage("No changes were made.");
    setIsSubmitting(false);
  };

  return (
    <div
      className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg max-h-[60vh] overflow-y-auto"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Submit Your Progress
      </h1>

      {parameters.length === 0 ? (
        <p className="text-center text-gray-600">
          No parameters available. Please add some parameters first.
        </p>
      ) : (
        <form className="flex flex-col space-y-6">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label
                htmlFor="date"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Date:
              </label>
              <input
                id="date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDate(e.target.value);
                }}
                value={date}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parameters.map((param) => (
              <div key={param.id} className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  {param.name}
                </label>
                <div>
                  {param.type === "boolean" && (
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        className={`w-full py-2 px-4 font-semibold rounded-md border ${
                          progress[param.id] === true
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                        }`}
                        onClick={() => handleInputChange(param.id, true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`w-full py-2 px-4 font-semibold rounded-md border ${
                          progress[param.id] === false
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-red-50"
                        }`}
                        onClick={() => handleInputChange(param.id, false)}
                      >
                        No
                      </button>
                    </div>
                  )}
                  {(param.type === "int" || param.type === "float") && (
                    <input
                      type="number"
                      step={param.type === "float" ? "0.01" : "1"}
                      className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          param.id,
                          param.type === "int"
                            ? parseInt(e.target.value, 10)
                            : parseFloat(e.target.value)
                        )
                      }
                      value={progress[param.id] as number}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="mb-4">
              {errors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </span>
            ) : (
              "Save Progress"
            )}
          </button>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleOverwrite}
        message="An entry for this date already exists. Do you want to overwrite it?"
      />
    </div>
  );
}
