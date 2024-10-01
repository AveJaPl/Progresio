import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { toZonedTime } from "date-fns-tz";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const timeZone = request.headers.get("Timezone") || "UTC";

    const today = toZonedTime(new Date(), timeZone);
    today.setHours(0, 0, 0, 0);
    console.log("Zoned today: ");
    console.log(today);

    const dayOfWeek = (today.getDay() + 6) % 7;
    console.log("Day of week: ");
    console.log(dayOfWeek);

    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    console.log("Start of week: ");
    console.log(startOfCurrentWeek);

    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    endOfCurrentWeek.setHours(23, 59, 59, 999); // Ustawienie na koniec dnia
    console.log("End of Week (Zoned): ", endOfCurrentWeek);

    // Fetch goals for the user that are due this week
    const goalsThisWeek = await prisma.goal.findMany({
      where: {
        userId: decoded.userId,
        deadline: {
          gte: startOfCurrentWeek,
          lte: endOfCurrentWeek,
        },
      },
    });
    console.log(
      `Fetching goals for the week: ${startOfCurrentWeek} - ${endOfCurrentWeek}`
    );
    console.log(goalsThisWeek);
    if (goalsThisWeek.length === 0) {
      return NextResponse.json({
        total: 0,
        finished: 0,
      });
    }

    const total = goalsThisWeek.length;

    // Count the number of goals that are completed
    const finished = goalsThisWeek.filter(
      (goal) => goal.status === "Completed"
    ).length;

    return NextResponse.json({
      total,
      finished,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching goals" },
      { status: 500 }
    );
  }
}
