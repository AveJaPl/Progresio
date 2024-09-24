import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "@/app/utils/encryption";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const parameters = await prisma.parameter.findMany({
      where: { userId: decoded.userId },
      include: {
        _count: {
          select: { dataEntries: true }, // Use 'dataEntries' as per updated schema
        },
      },
    });

    // Decrypt parameters and include dataEntriesCount
    const decryptedParameters = parameters.map((parameter) => ({
      ...parameter,
      name: decrypt(parameter.name),
      goalValue: decrypt(parameter.goalValue),
      dataEntriesCount: parameter._count.dataEntries,
    }));

    return NextResponse.json(decryptedParameters);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching parameters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    let { name, goalValue, goalOperator, type } = await request.json();

    // hash name and goalValue for privacy reasons
    name = encrypt(name);
    goalValue = encrypt(goalValue);

    if (!name) {
      return NextResponse.json(
        { error: "Nazwa jest wymagana" },
        { status: 400 }
      );
    }

    const parameter = await prisma.parameter.create({
      data: {
        name,
        goalValue,
        type,
        goalOperator,
        user: { connect: { id: decoded.userId } },
      },
    });

    return NextResponse.json(parameter, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas dodawania celu" },
      { status: 500 }
    );
  }
}
