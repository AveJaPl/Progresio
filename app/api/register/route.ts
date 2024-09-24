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

    // Ustawienie defaultowych parametrów
    await prisma.parameter.createMany({
      data: [
        {
          name: 'Sleep [h]',
          type: 'number',
          goalValue: "8",
          goalOperator: '>=',
          userId: user.id,
        },{
          name: 'Steps',
          type: 'number',
          goalValue: "10000",
          goalOperator: '>=',
          userId: user.id,
        },{
          name: 'Water [ml]',
          type: 'number',
          goalValue: "2000",
          goalOperator: '>=',
          userId: user.id,
        },{
          name: 'Workout',
          type: 'boolean',
          goalValue: "true",
          goalOperator: '=',
          userId: user.id,
        }, {
          name: 'Book [pages]',
          type: 'number',
          goalValue: "10",
          goalOperator: '>=',
          userId: user.id,
        }, {
          name: 'Meditation [min]',
          type: 'number',
          goalValue: "10",
          goalOperator: '>=',
          userId: user.id,
        }, {
          name: 'Calories',
          type: 'number',
          goalValue: "2200",
          goalOperator: '<=',
          userId: user.id,
        }
      ]
    });

    return NextResponse.json({ message: 'Registered successfully.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred.' },
      { status: 500 }
    );
  }
}
