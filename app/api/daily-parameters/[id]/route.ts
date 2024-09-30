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

    await prisma.parameterData.delete({
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
    const { value } = await request.json();

    // Fetch the parameter and its data entries count
    const parameterData = await prisma.parameterData.findUnique({
      where: { id },
    });

    if (!parameterData) {
      return NextResponse.json(
        { error: "Parameter does not exist" },
        { status: 404 }
      );
    }

    const updatedParameterData = await prisma.parameterData.update({
      where: { id },
      data: {
        value: value,
      },
    });

    return NextResponse.json(updatedParameterData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating parameter" },
      { status: 500 }
    );
  }
}
