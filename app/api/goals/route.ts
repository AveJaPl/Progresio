// app/api/goals/route.ts

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

    const { title, description, status, deadline } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Tytuł jest wymagany" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        status,
        deadline,
        description,
        user: { connect: { id: decoded.userId } },
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas dodawania celu" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const goals = await prisma.goal.findMany({
      where: {
        userId: decoded.userId,
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania celów" },
      { status: 500 }
    );
  }
}

