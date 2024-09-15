import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticate } from "@/app/utils/authenticate";

export async function POST(request: NextRequest) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await request.json();
  const { progressEntries, date } = data

  if (!progressEntries || !Array.isArray(progressEntries) || !date) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    const parsedDate = new Date(date);

    // Tworzymy operacje upsert dla każdej pozycji w progressEntries
    const operations = progressEntries.map(({ parameterId, value }) => {
      return prisma.progress.upsert({
        where: {
          parameterId_date_userId_unique: {
            parameterId,
            date: parsedDate,
            userId: decoded.userId,
          },
        },
        update: {
          value: String(value), // Aktualizacja istniejącego wpisu
        },
        create: {
          parameterId,
          value: String(value),
          date: parsedDate,
          userId: decoded.userId, // Tworzenie nowego wpisu
        },
      });
    });

    // Wykonujemy wszystkie operacje w ramach jednej transakcji
    const results = await prisma.$transaction(operations);

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Error saving progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { message: "Date query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const parsedDate = new Date(date);

    const existingProgress = await prisma.progress.findMany({
      where: {
        date: parsedDate,
        userId: decoded.userId,
      },
    });

    if (existingProgress.length > 0) {
      return NextResponse.json(
        { exists: true, progress: existingProgress },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking progress for the date:", error);
    return NextResponse.json(
      { error: "Error checking progress for the date" },
      { status: 500 }
    );
  }
}
