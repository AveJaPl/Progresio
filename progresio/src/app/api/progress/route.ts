import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticate } from "@/app/utils/authenticate";

export async function POST(request: NextRequest) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { parameterId, value, date } = await request.json();

  console.log(parameterId, value, date);
  
  if (!parameterId || value === undefined || !date) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    // Convert date to Date object
    const parsedDate = new Date(date);

    // Check if the progress entry already exists
    const existingProgress = await prisma.progress.findFirst({
      where: {
        parameterId,
        date: parsedDate,
      },
    });

    let progress;

    if (existingProgress) {
      // Update the existing progress
      progress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          value: String(value),
        },
      });
    } else {
      // Create a new progress entry
      progress = await prisma.progress.create({
        data: {
          parameterId,
          value: String(value),
          date: parsedDate,
          userId: decoded.userId, // Associate progress with the user
        },
      });
    }

    return NextResponse.json(progress, { status: 201 });
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
