"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal";
import { FaPlus, FaTrash } from "react-icons/fa"; // Removed FaEdit
import { Parameter } from "@/types/types";

export default function ParameterList() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParameterId, setSelectedParameterId] = useState<string | null>(
    null
  );
  const [paramChanged, setParamChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParameters, setFilteredParameters] = useState<Parameter[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch parameters from API
    const fetchParameters = async () => {
      
      const res = await fetch("/api/parameters", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to fetch parameters");
        return;
      }
      const data = await res.json();
      setParameters(data.parameters);
      setFilteredParameters(data.parameters);
      setLoading(false);
      
    };

    fetchParameters();
    
  }, [paramChanged]);

  useEffect(() => {
    // Filter parameters based on search query
    const filtered = parameters.filter((param) =>
      param.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredParameters(filtered);
  }, [searchQuery, parameters]);

  const handleParameterClick = (id: string) => {
    router.push(`/myParameters/${id}`);
  };

  const handleDeleteParameter = async (id: string) => {
    await fetch(`/api/parameters/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setParamChanged(!paramChanged);
        } else {
          throw new Error("Failed to delete parameter");
        }
      })
      .catch((error) => {
        console.error("Error deleting parameter:", error);
      });
  };

  const openModal = (id: string) => {
    setSelectedParameterId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParameterId(null);
  };

  const confirmDelete = () => {
    if (selectedParameterId !== null) {
      handleDeleteParameter(selectedParameterId);
    }
    closeModal();
  };

  const handleAddParameter = () => {
    router.push("/addParameter"); // Route to add parameter page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          My Parameters
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
          onClick={handleAddParameter}
        >
          <FaPlus className="mr-2" />
          Add Parameter
        </button>
      </div>

      {/* Search */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search parameters..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredParameters.map((param: Parameter) => (
          <div
            key={param.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            onClick={() => handleParameterClick(param.id)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {param.name}
              </h2>
              <span className="text-sm text-gray-600 capitalize">
                {param.type}
              </span>
            </div>
            {/* Add any additional parameter info here */}
            <div className="mt-4 flex justify-end">
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(param.id);
                }}
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this parameter? This action cannot be undone."
      />
    </>
  );
}
