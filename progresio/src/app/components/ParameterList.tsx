// src/app/myParameters/page.tsx (Server Component)
import { PrismaClient } from '@prisma/client';
import ParameterElement from './ParameterElement';
const prisma = new PrismaClient();

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
