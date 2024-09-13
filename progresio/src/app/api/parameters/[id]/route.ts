import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { authenticate } from '@/app/utils/authenticate';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    const parameter = await prisma.parameter.findUnique({
      where: { id },
      include: { progress: true },
    });
    return NextResponse.json({ parameter }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching parameter' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const decoded = authenticate(request);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    const deletedParameter = await prisma.parameter.delete({
      where: { id },
    });
    return NextResponse.json(deletedParameter, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error deleting parameter' }, { status: 500 });
  }
}
