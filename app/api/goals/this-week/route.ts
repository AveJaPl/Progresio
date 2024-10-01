import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { toZonedTime } from "date-fns-tz";


export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const timeZone = request.headers.get('Timezone') || 'UTC';

    const today = toZonedTime(new Date(), timeZone)
    today.setHours(0, 0, 0, 0);
    console.log("Today: ");
    console.log(today);

    const dayOfWeek = (today.getDay() + 6) % 7;
    console.log("Day of week: ");
    console.log(dayOfWeek);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    console.log("Start of week: ");
    console.log(startOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    console.log("End of week: ");
    console.log(endOfWeek);
    
    // Fetch goals for the user that are due this week
    const goalsThisWeek = await prisma.goal.findMany({
      where: {
        userId: decoded.userId,
        deadline: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });
    console.log(`Fetching goals for the week: ${startOfWeek} - ${endOfWeek}`);
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
