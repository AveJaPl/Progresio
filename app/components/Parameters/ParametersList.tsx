// components/ParametersList.tsx
"use client";
import { Parameter } from "@/app/types/Parameter";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ParametersListProps {
  parameters: Parameter[];
  onDelete: (id: string) => void; // Prop for handling delete
}

export default function ParametersList({
  parameters,
  onDelete,
}: ParametersListProps) {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [search, setSearch] = useState(""); // Initialize search state

  const filteredParameters = parameters.filter((parameter) => {
    return parameter.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = (id: string) => {
    fetch(`/api/parameters/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Parameter deleted successfully",
            variant: "default",
          });
          onDelete(id); // Call the onDelete prop to remove the parameter from the list
        } else {
          throw new Error("Failed to delete parameter");
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete parameter",
          variant: "destructive",
        });
      });
  };

  const handleCardClick = (id: string) => {
    router.push(`/parameters/${id}`); // Navigate to the parameter's page using its ID
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between px-0 py-4">
        <CardTitle className="hidden xl:block">Parameters</CardTitle>
        <Input
          placeholder="Search parameters"
          className="w-full xl:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Handle search input
        />
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredParameters.map((parameter, index) => (
          <Card
            key={index}
            className="grid hover:scale-[1.01] cursor-pointer"
            onClick={() => handleCardClick(parameter.id)} // Handle card click
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{parameter.name}</CardTitle>
              <Badge variant="outline" className={`bg-primary`}>
                {parameter.type}
              </Badge>
            </CardHeader>
            <CardFooter className="flex justify-end p-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the card click event
                  handleDelete(parameter.id);
                }}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
