import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Global Prisma instance
import { authenticate } from "@/app/utils/authenticate";

export async function POST(request: NextRequest) {
  console.log("Request to /api/me");
  const decoded = authenticate(request);
  console.log("Decoded token:", decoded);
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } 
  try {
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}