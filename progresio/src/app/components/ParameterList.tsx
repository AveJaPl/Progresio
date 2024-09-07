"use client";

// src/app/myParameters/page.tsx (Server Component)
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal"; // Importujemy nasz modal

interface Parameter {
  id: number;
  name: string;
  type: string;
}

export default function ParameterList() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState<number | null>(
    null
  );
  const router = useRouter();
  useEffect(() => {
    const fetchParameters = async () => {
      const res = await fetch("/api/parameters");
      const data = await res.json();
      setParameters(data.parameters || []);
      console.log(data);
    };

    fetchParameters();
  }, []);

  const handleParameterClick = (id: number) => {
    router.push(`/myParameters/${id}`);
  };

  const handleDeleteParameter = async (id: number) => {
    const res = await fetch(`/api/parameters/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        router.refresh();
      }
    });
  };

  const openModal = (id: number) => {
    setSelectedParameterId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParameterId(null); // Resetowanie wybranego parametru
  };

  const confirmDelete = () => {
    if (selectedParameterId !== null) {
      handleDeleteParameter(selectedParameterId);
    }
    closeModal();
  };

  return (
    <>
      <ul className="space-y-4">
        {parameters.map((param: Parameter) => (
          <div
            className="flex justify-between items-center w-full bg-gray-100rounded shadow "
            key={param.id}
          >
            <li
              className="cursor-pointer flex-1 h-full p-4 hover:bg-gray-200 transition"
              onClick={() => handleParameterClick(param.id)}
            >
              <span className="font-bold">{param.name}</span> - {param.type}
            </li>
            <button
              className="text-red-500 font-bold p-4 focus:outline-none focus:shadow-outline border-l-2 hover:bg-red-500 hover:text-white transition border-red-500 m-l-4"
              onClick={() => openModal(param.id)} // Otwieranie modala po kliknięciu
            >
              Delete
            </button>
          </div>
        ))}
      </ul>

      {/* Modal do potwierdzenia usunięcia */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this parameter? This action cannot be undone."
      />
    </>
  );
}
