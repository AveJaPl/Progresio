// src/app/myParameters/ParameterElement.tsx (Client Component)
"use client"; // Deklarujemy, że jest to komponent kliencki
import { useRouter } from 'next/navigation'; // Używamy hooka klienckiego do nawigacji

interface Parameter {
  id: number;
  name: string;
  type: string;
}

export default function ParameterElement({ parameters }: { parameters: Parameter[] }) {
  const router = useRouter(); // Hook kliencki do przekierowań

  const handleParameterClick = (id: number) => {
    router.push(`/myParameters/${id}`); // Przekierowanie do odpowiedniej strony parametru
  };

  return (
    <ul className="space-y-4">
      {parameters.map((param: Parameter) => (
        <li
          key={param.id}
          className="bg-gray-100 p-4 rounded shadow cursor-pointer hover:bg-gray-200 transition"
          onClick={() => handleParameterClick(param.id)} // Kliknięcie na element
        >
          <span className="font-bold">{param.name}</span> - {param.type}
        </li>
      ))}
    </ul>
  );
}
