import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// post dataEntries - daily parameters
export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, data, overwrite } = await request.json();

  const existingData = await prisma.parameterData.findMany({
    where: {
      date: date,
    },
  });

  if (existingData.length && !overwrite) {
    return NextResponse.json(
      { error: "Data already exists for this date" },
      { status: 400 }
    );
  }

  if (existingData && overwrite) {
    await prisma.parameterData.deleteMany({
      where: {
        date: date,
      },
    });
  }

  const dataEntry = await prisma.parameterData.createMany({
    data: data.map((entry: any) => ({
      date: date,
      value: entry.value,
      parameterId: entry.id,
    })),
  });

  return NextResponse.json(dataEntry);
}
