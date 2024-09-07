// src/app/myParameters/page.tsx (Server Component)
import ParameterElement from './ParameterElement';
import prisma from '@/lib/prisma';

interface Parameter {
  id: number;
  name: string;
  type: string;
}

export default async function ParameterList() {
  const parameters: Parameter[] = await prisma.parameter.findMany(); // Pobieranie danych na serwerze

  return (
    <div>
      <ParameterElement parameters={parameters} />
    </div>
  );
}
