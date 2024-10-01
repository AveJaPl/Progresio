import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { fromZonedTime } from "date-fns-tz";
import { parseISO, startOfDay } from "date-fns";

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

  const timeZone = request.headers.get("Timezone") || "UTC";
  console.log("Im in daily-parameters --------------");
  console.log("Timezone: ", timeZone);

  const userDate = parseISO(date);
  const userStartOfDay = startOfDay(userDate);
  const utcStartOfDay = fromZonedTime(userStartOfDay, timeZone);
  console.log("User date: ", userDate);
  console.log("User start of day: ", userStartOfDay);
  console.log("UTC start of day: ", utcStartOfDay);

  const utcEndOfDay = new Date(utcStartOfDay);
  utcEndOfDay.setHours(23, 59, 59, 999);

  console.log("UTC end of day: ", utcEndOfDay);

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
