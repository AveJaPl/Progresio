import { NextResponse } from 'next/server';
import { authenticate } from '@/app/utils/authenticate';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  const decoded = authenticate(request as any);
  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Proceed with your logic, you can access decoded.userId
  return NextResponse.json({ success: true, data: 'Protected data.' });
}
