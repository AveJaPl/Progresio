import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
