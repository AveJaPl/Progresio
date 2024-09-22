import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const upcomingGoals = await prisma.goal.findMany({
      where: {
        userId: decoded.userId,
        status: "Active",
      },
      orderBy: {
        deadline: "asc",
      },
      take: 5,
    });

    return NextResponse.json(upcomingGoals);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania celów" },
      { status: 500 }
    );
  }
}
