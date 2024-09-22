import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(
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

    const { title, description, deadline } = await request.json();
    const { id } = params;

    if (!title) {
      return NextResponse.json(
        { error: "Tytuł jest wymagany" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        deadline,
        description,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas aktualizowania celu" },
      { status: 500 }
    );
  }
}

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

    await prisma.goal.delete({
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
