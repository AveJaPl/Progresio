"use client";

// src/app/newParameter/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import withAuth from "@/app/components/withAuth";

function AddParameterPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"boolean" | "int" | "float">("boolean");
  const [goalOperator, setGoalOperator] = useState("=");
  const [goalValue, setGoalValue] = useState<number | boolean | "">(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!type) errors.type = "Type is required.";
    if (type !== "boolean") {
      if (!goalOperator) errors.goalOperator = "Operator is required.";
      if (goalValue === "") errors.goalValue = "Goal value is required.";
      else if (isNaN(Number(goalValue)))
        errors.goalValue = "Goal value must be a number.";
    } else {
      if (goalValue === "") errors.goalValue = "Goal value is required.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setMessage(null);

    const data = {
      name,
      type,
      goal: {
        operator: goalOperator,
        value: goalValue,
      },
    };

    try {
      const res = await fetch("/api/parameters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials in fetch requests
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setMessage("Parameter added successfully!");
        // Redirect to parameters list or detail page
        router.push("/myParameters");
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to add parameter.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to add parameter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderGoalFields = () => {
    if (type === "boolean") {
      return (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Goal:
            <select
              value={goalValue === true ? "true" : "false"}
              onChange={(e) => setGoalValue(e.target.value === "true")}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          {errors.goalValue && (
            <p className="text-red-500 text-sm mt-1">{errors.goalValue}</p>
          )}
        </div>
      );
    } else {
      return (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Goal:
          </label>
          <div className="flex">
            <select
              value={goalOperator}
              onChange={(e) => setGoalOperator(e.target.value)}
              required
              className="mt-1 block w-1/4 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="=">=</option>
              <option value="<">&lt;</option>
              <option value=">">&gt;</option>
              <option value="<=">&le;</option>
              <option value=">=">&ge;</option>
            </select>
            <input
              type="number"
              value={goalValue !== "" ? Number(goalValue) : ""}
              onChange={(e) =>
                setGoalValue(
                  e.target.value !== "" ? parseFloat(e.target.value) : ""
                )
              }
              required
              className="mt-1 block w-3/4 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {errors.goalOperator && (
            <p className="text-red-500 text-sm mt-1">{errors.goalOperator}</p>
          )}
          {errors.goalValue && (
            <p className="text-red-500 text-sm mt-1">{errors.goalValue}</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Add New Parameter
      </h1>
      <p className="text-gray-600 mb-6">
        Fill out the form below to add a new parameter to the system.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`mt-1 block w-full p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Type:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value as "boolean" | "int" | "float");
              setGoalOperator("="); // Reset goal when type changes
              setGoalValue(e.target.value === "boolean" ? true : "");
            }}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="boolean">True/False</option>
            <option value="int">Integer</option>
            <option value="float">Float</option>
          </select>
        </div>
        {renderGoalFields()}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-2" /> Adding...
              </span>
            ) : (
              "Add Parameter"
            )}
          </button>
          {message && (
            <p
              className={`${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              } text-sm font-medium`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default withAuth(AddParameterPage);