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

    const { id } = params;

    await prisma.goal.update({
        where: {
            id: id,
         },
        data: {
            status: "Active",
            finishedAt: null,
        },
        });

    return NextResponse.json({ message: "Status reset" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas resetowania statusu" },
      { status: 500 }
    );
  }
}