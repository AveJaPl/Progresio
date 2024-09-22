// app/api/register/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Możesz tutaj ustawić sesję lub token JWT

    return NextResponse.json({ message: 'Registered successfully.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred.' },
      { status: 500 }
    );
  }
}
