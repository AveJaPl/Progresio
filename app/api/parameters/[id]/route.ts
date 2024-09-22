import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { IDbParameter } from "@/app/types/Parameter";
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
