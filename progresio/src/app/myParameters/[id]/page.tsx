// src/app/myParameters/[id]/page.tsx (Server Component)
import { PrismaClient } from '@prisma/client';
import ProgressDetailsBoolean from '@/app/components/ProgressDetailsBoolean';
import ProgressDetailsFloat from '@/app/components/ProgressDetailsFloat';
import ProgressDetailsInt from '@/app/components/ProgressDetailsInt';

const prisma = new PrismaClient();

interface Progress {
  id: number;
  date: string; // Oczekujemy, że date będzie stringiem
  value: string;
  parameterId: number;
}

interface ParameterWithProgress {
  id: number;
  name: string;
  type: string;
  progress: Progress[];
}

export default async function ParameterPage({ params }: { params: { id: string } }) {
  // Pobieramy dane dla konkretnego parametru po stronie serwera
  const parameter = await prisma.parameter.findUnique({
    where: { id: Number(params.id) },
    include: { progress: true },
  });

  if (!parameter) {
    return <div>Parameter not found</div>;
  }

  // Konwertujemy daty z typu Date na string (ISO format), jeśli są obiektami Date
  const parameterWithProgress: ParameterWithProgress = {
    ...parameter,
    progress: parameter.progress.map(p => ({
      ...p,
      date: p.date instanceof Date ? p.date.toISOString() : p.date, // Konwertujemy do string, jeśli to Date
    })),
  };

  // Wybieramy odpowiedni komponent na podstawie wartości type
  let ProgressComponent;
  switch (parameterWithProgress.type) {
    case 'float':
      ProgressComponent = ProgressDetailsFloat;
      break;
    case 'int':
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
      <h1>Parameter: {parameterWithProgress.name}</h1>
      <p>Type: {parameterWithProgress.type}</p>
      {/* Renderowanie odpowiedniego komponentu */}
      <ProgressComponent progress={parameterWithProgress.progress} />
    </div>
  );
}
