"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal"; // Importujemy nasz modal

interface Parameter {
  id: number;
  name: string;
  type: string;
}

export default function ParameterElement({
  parameters,
}: {
  parameters: Parameter[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState<number | null>(
    null
  );
  const router = useRouter();

  const handleParameterClick = (id: number) => {
    router.push(`/myParameters/${id}`);
  };

  const handleDeleteParameter = async (id: number) => {
    const res = await fetch(`/api/parameters/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
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
            className="flex justify-between items-center w-full bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition"
            key={param.id}
          >
            <li
              className="cursor-pointer flex-1"
              onClick={() => handleParameterClick(param.id)}
            >
              <span className="font-bold">{param.name}</span> - {param.type}
            </li>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
