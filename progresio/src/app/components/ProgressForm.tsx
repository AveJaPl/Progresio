// src/app/components/ProgressForm.tsx
"use client";

import { useEffect, useState, ChangeEvent } from 'react';

// Interfejs dla parametru
interface Parameter {
  id: number;
  name: string;
  type: 'boolean' | 'int' | 'float';
}

// Interfejs dla progresu
interface Progress {
  [parameterId: number]: boolean | number;
}

export default function ProgressForm() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchParameters = async () => {
      const res = await fetch('/api/parameters');
      const data = await res.json();
      setParameters(data.parameters || []);
    };

    fetchParameters();
  }, []);

  const handleInputChange = (parameterId: number, value: boolean | number) => {
    setProgress((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      for (const parameterId in progress) {
        const value = progress[parameterId];
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ parameterId: parseInt(parameterId), value }),
        });
      }
      setMessage('Progress saved successfully!');
    } catch (error) {
      setMessage('Failed to save progress.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
      {parameters.length === 0 && <p>No parameters available. Please add some parameters first.</p>}
      {parameters.map((param) => (
        <div key={param.id} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {param.name} ({param.type})
            {param.type === 'boolean' && (
              <input
                type="checkbox"
                className="ml-2"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(param.id, e.target.checked)}
              />
            )}
            {param.type === 'int' && (
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(param.id, parseInt(e.target.value, 10))}
              />
            )}
            {param.type === 'float' && (
              <input
                type="number"
                step="0.01"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(param.id, parseFloat(e.target.value))}
              />
            )}
          </label>
        </div>
      ))}
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSubmit}
      >
        Save Progress
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
