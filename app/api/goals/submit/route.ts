// app/api/goals/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const { data } = await request.json(); // array of goals ids

    const updatedGoals = await prisma.goal.updateMany({
        where: {
            id: {
            in: data,
            },
            userId: userId,
        },
        data: {
            status: "Completed",
            finishedAt: new Date(),
        },
        });


    return NextResponse.json(updatedGoals, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas dodawania celu" },
      { status: 500 }
    );
  }
}