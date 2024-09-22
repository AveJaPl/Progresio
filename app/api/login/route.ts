// app/api/login/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Wrong email or password.' },
        { status: 400 }
      );
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const response = NextResponse.json({ message: 'Logged in successfully.' });
    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred.' },
      { status: 500 }
    );
  }
}
