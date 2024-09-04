// src/app/myParameters/[id]/page.tsx (Server Component)
import { PrismaClient } from '@prisma/client';
import { ProgressDetailsBoolean } from '@/app/components/ProgressDetailsBoolean';
import { ProgressDetailsFloat } from '@/app/components/ProgressDetailsFloat';
import { ProgressDetailsInt } from '@/app/components/ProgressDetailsInt';

const prisma = new PrismaClient();

interface Parameter {
  id: number;
  name: string;
  type: string;
}

interface ParameterWithProgress extends Parameter {
  progress: {
    value: string;
  }[];
}

export default async function ParameterPage({ params }: { params: { id: string } }) {
  // Pobieramy dane dla konkretnego parametru po stronie serwera
  const parameter: ParameterWithProgress | null = await prisma.parameter.findUnique({
    where: { id: Number(params.id) },
    include: { progress: true },
  });

  if (!parameter) {
    return <div>Parameter not found</div>;
  }

  // Wybieramy odpowiedni komponent na podstawie wartości type
  let ProgressComponent;
  switch (parameter.type) {
    case 'float':
      ProgressComponent = ProgressDetailsFloat;
      break;
    case 'integer':
      ProgressComponent = ProgressDetailsInt;
      break;
    case 'boolean':
      ProgressComponent = ProgressDetailsBoolean;
      break;
    default:
      return <div>Unsupported parameter type</div>; // Obsługa nieobsługiwanych typów
  }

  return (
    <div>
      <h1>Parameter: {parameter.name}</h1>
      <p>Type: {parameter.type}</p>
      {/* Renderowanie odpowiedniego komponentu */}
      <ProgressComponent progress={parameter.progress} />
    </div>
  );
}
