"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { ConfirmModal } from "./ConfirmModal"; // Zakładam, że ConfirmModal znajduje się w tym samym folderze

// Interfejs dla parametru
interface Parameter {
  id: number;
  name: string;
  type: "boolean" | "int" | "float";
}

// Interfejs dla progresu
interface Progress {
  [parameterId: number]: boolean | number | string;
}

export default function ProgressForm() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Dodajemy stan do kontrolowania widoczności modala

  // Efekt odpowiedzialny za automatyczne ukrywanie komunikatu po 3 sekundach
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Usuwanie komunikatu po 3 sekundach
      }, 3000);
      
      return () => clearTimeout(timer); // Czyścimy timer po unmount
    }
  }, [message]);

  useEffect(() => {
    const fetchParameters = async () => {
      const res = await fetch("/api/parameters");
      const data = await res.json();
      setParameters(data.parameters || []);
    };

    fetchParameters();
  }, []);

  const handleInputChange = (parameterId: number, value: boolean | number | string) => {
    setProgress((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  // Funkcja do sprawdzania, czy istnieje już wpis dla danej daty
  const checkExistingEntry = async () => {
    const res = await fetch(`/api/progress?date=${date}T00:00:00.000Z`);
    const data = await res.json();
    return data.exists;
  };

  // Funkcja do obsługi nadpisania danych
  const handleSubmit = async () => {
    try {
      const entryExists = await checkExistingEntry();

      if (entryExists) {
        setIsModalOpen(true); // Otwórz modal, jeśli dane istnieją
        return;
      }

      // Jeśli dane nie istnieją, zapisz je
      saveProgress();
    } catch (error) {
      setMessage("Failed to save progress.");
    }
  };

  // Funkcja zapisująca dane
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
            parameterId: parseInt(parameterId), 
            value: value,
            date: `${date}T00:00:00.000Z`
          }),
        });
      }

      setMessage("Progress saved successfully!");
    } catch (error) {
      setMessage("Failed to save progress.");
    }
  };

  // Funkcja wywoływana, gdy użytkownik potwierdzi nadpisanie
  const handleOverwrite = () => {
    setIsModalOpen(false); // Zamknij modal
    saveProgress(); // Bezpośrednio zapisujemy dane
  };

  // Funkcja wywoływana, gdy użytkownik anuluje nadpisanie
  const handleCloseModal = () => {
    setIsModalOpen(false); // Zamknij modal
    setMessage("No changes were made."); // Opcjonalna wiadomość
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
      {parameters.length === 0 && (
        <p>No parameters available. Please add some parameters first.</p>
      )}
      {parameters.map((param) => (
        <div key={param.id} className="mb-4">
          {/* Calendar with date to select */}
          <input 
            type="date" 
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDate(e.target.value);
            }}
            value={date}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {param.name}
          </label>
          <div>
            {param.type === "boolean" && (
              <div className="flex items-center space-x-2">
                {/* Two buttons for Yes/No */}
                <button
                  className={`py-2 px-4 font-bold rounded ${
                    progress[param.id] === true
                      ? "bg-green-600 text-white border-2 border-green-800"
                      : "bg-gray-50 text-green-700 border-2 border-green-500"
                  }`}
                  onClick={() => handleInputChange(param.id, true)}
                >
                  Yes
                </button>
                <button
                  className={`py-2 px-4 font-bold rounded ${
                    progress[param.id] === false
                      ? "bg-red-600 text-white border-2 border-red-800"
                      : "bg-gray-50 text-red-700 border-2 border-red-500"
                  }`}
                  onClick={() => handleInputChange(param.id, false)}
                >
                  No
                </button>
              </div>
            )}
            {param.type === "int" && (
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(param.id, parseInt(e.target.value, 10))
                }
              />
            )}
            {param.type === "float" && (
              <input
                type="number"
                step="0.01"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(param.id, parseFloat(e.target.value))
                }
              />
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={handleSubmit}
      >
        Save Progress
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}

      {/* Modal confirmation for overwrite */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleOverwrite}
        message="An entry for this date already exists. Do you want to overwrite it?"
      />
    </div>
  );
}
