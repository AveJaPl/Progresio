// src/app/components/ParameterForm.tsx
"use client";

import { useState } from 'react';

export default function ParameterForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("boolean");
  const [message, setMessage] = useState<string | null>(null); // Dodanie wiadomości o powodzeniu

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/parameters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, type }),
    });

    if (res.ok) {
      // Po pomyślnym dodaniu nowego parametru ustawiamy stan i zapisujemy informację w localStorage
      setName("");
      setType("boolean");
      setMessage("Parameter added successfully!");
    } else {
      setMessage("Failed to add parameter.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="boolean">True/False</option>
            <option value="int">Integer</option>
            <option value="float">Float</option>
          </select>
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Parameter
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}{" "}
    </form>
  );
}
