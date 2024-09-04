// pages/api/progress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { parameterId, value } = req.body;
    try {
      if (parameterId && value !== undefined) {
        const newProgress = await prisma.progress.create({
          data: { parameterId, value: String(value) },
        });
        res.status(201).json(newProgress);
      } else {
        res.status(400).json({ message: 'Invalid data' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error saving progress' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
