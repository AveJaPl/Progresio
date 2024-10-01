import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

// post dataEntries - daily parameters
export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
  };

  const { date, data, overwrite } = await request.json();
  console.log(
    `Received data: Date: ${date}, Data: ${JSON.stringify(
      data,
      null,
      2
    )}, Overwrite: ${overwrite}`
  );

  // 3. Parsowanie daty jako UTC
  // Zakładam, że `date` jest w formacie 'YYYY-MM-DD'
  const utcStartOfDay = new Date(`${date}T00:00:00Z`); // "2024-09-30T00:00:00Z"
  const utcEndOfDay = new Date(`${date}T23:59:59.999Z`); // "2024-09-30T23:59:59.999Z"

  console.log("UTC Start of Day: ", utcStartOfDay);
  console.log("UTC End of Day: ", utcEndOfDay);

  const existingData = await prisma.parameterData.findMany({
    where: {
      AND: [
        {
          date: {
            gte: utcStartOfDay,
            lte: utcEndOfDay,
          },
        },
        {
          parameter: {
            userId: userId,
          },
        },
      ],
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
        AND: [
          {
            date: date,
          },
          {
            parameter: {
              userId: userId,
            },
          },
        ],
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
