// src/pages/api/parameters.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const parameters = await prisma.parameter.findMany({
        include: {
          progress: true,
        },
      });
      res.status(200).json({ parameters });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else if (req.method === 'POST') {
    const { name, type, parameterId, value } = req.body;
    try {
      if (name && type) {
        const newParameter = await prisma.parameter.create({
          data: {
            name,
            type,
          },
        });
        res.status(201).json(newParameter);
      } else if (parameterId && value !== undefined) {
        const newProgress = await prisma.progress.create({
          data: {
            parameterId,
            value: String(value), // Upewnij się, że typ jest zgodny z modelem
          },
        });
        res.status(201).json(newProgress);
      } else {
        res.status(400).json({ message: 'Invalid data' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error saving data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
