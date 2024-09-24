import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// post dataEntries - daily parameters
export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, data } = await request.json();

  // Obsłużyć Modal który pyta czy wysłać dane z tego samego dnia
  // if (date) {
  //   return NextResponse.json({ error: "Parameters with this date already exists" }, { status: 400 });
  // }



  const dataEntry = await prisma.parameterData.createMany({
    data: data.map((entry: any) => ({
      date: date,
      value: entry.value,
      parameterId: entry.id,
    })),
  });

  return NextResponse.json(dataEntry);
}
