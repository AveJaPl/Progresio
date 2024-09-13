import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Global Prisma instance
import { authenticate } from "@/app/utils/authenticate";

export async function GET(request: NextRequest) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const parameters = await prisma.parameter.findMany({
      where: { userId: decoded.userId },
    });
    return NextResponse.json({ parameters }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching parameters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, type, goal } = await request.json();

  // Validation
  if (!name || !type || !goal) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    let goalValue = "";

    // Handle boolean, int, float types
    if (type === "boolean") {
      goalValue = goal.value === true ? "true" : "false"; // Convert boolean to string
    } else if (type === "int" || type === "float") {
      goalValue = goal.value.toString(); // Convert number to string
    } else {
      return NextResponse.json(
        { message: "Invalid type provided" },
        { status: 400 }
      );
    }

    // Create new parameter
    const newParameter = await prisma.parameter.create({
      data: {
        name,
        type,
        goalValue, // Store value as string
        goalOperator: type === "boolean" ? null : goal.operator, // Operator only for numbers
        userId: decoded.userId, // Associate parameter with the user
      },
    });

    return NextResponse.json(newParameter, { status: 201 });
  } catch (error) {
    console.error("Error saving parameter:", error);
    return NextResponse.json(
      { error: "Error saving parameter" },
      { status: 500 }
    );
  }
}
