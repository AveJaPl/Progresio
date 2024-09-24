import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "@/app/utils/encryption";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { id } = params;

    await prisma.parameter.delete({
      where: { id },
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas usuwania celu" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { id } = params;

    const parameter = await prisma.parameter.findUnique({
      where: { id },
      include: {
        dataEntries: true,
      },
    });

    if (!parameter) {
      return NextResponse.json(
        { error: "Parametr nie istnieje" },
        { status: 404 }
      );
    }

    const decryptedParameter = {
      ...parameter,
      goalValue: decrypt(parameter.goalValue),
      name: decrypt(parameter.name),
    };

    return NextResponse.json(decryptedParameter);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania parametru" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { name, goalValue, goalOperator, type } = await request.json();

    // Fetch the parameter and its data entries count
    const parameter = await prisma.parameter.findUnique({
      where: { id },
      include: {
        _count: {
          select: { dataEntries: true }, // Use 'dataEntries' as per updated schema
        },
      },
    });

    if (!parameter) {
      return NextResponse.json(
        { error: "Parameter does not exist" },
        { status: 404 }
      );
    }

    // Check if type change is attempted when data entries exist
    if (parameter.type !== type && parameter._count.dataEntries > 0) {
      return NextResponse.json(
        { error: "Cannot change type when data entries exist" },
        { status: 400 }
      );
    }

    // Ensure 'name' and 'goalValue' are strings
    const nameStr = typeof name === "number" ? name.toString() : name;
    const goalValueStr =
      typeof goalValue === "number" ? goalValue.toString() : goalValue;

    const updatedParameter = await prisma.parameter.update({
      where: { id },
      data: {
        name: encrypt(nameStr),
        goalValue: encrypt(goalValueStr),
        goalOperator,
        type,
      },
    });

    return NextResponse.json(updatedParameter);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating parameter" },
      { status: 500 }
    );
  }
}
