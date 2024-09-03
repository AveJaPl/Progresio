// src/app/components/ParameterList.tsx
"use client"
import { useEffect, useState } from 'react';

export default function ParameterList() {
  const [parameters, setParameters] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchParameters = async () => {
      const res = await fetch('/api/parameters');
      const data = await res.json();
      const {parameters, progress} = data;
      setParameters(parameters || []);
      setProgress(progress || {});
    };

    fetchParameters();
  }, []);

  return (
    <ul className="space-y-4">
      {parameters.map((param: { id: number; name: string; type: string }) => (
        <li key={param.id} className="bg-gray-100 p-4 rounded shadow">
          <span className="font-bold">{param.name}</span> - {param.type}
        </li>
      ))}
    </ul>
  );
}
