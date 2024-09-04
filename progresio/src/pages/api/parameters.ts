// pages/api/parameters.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const parameters = await prisma.parameter.findMany();
      res.status(200).json({ parameters });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching parameters' });
    }
  } else if (req.method === 'POST') {
    const { name, type } = req.body;
    try {
      if (name && type) {
        const newParameter = await prisma.parameter.create({
          data: { name, type },
        });
        res.status(201).json(newParameter);
      } else {
        res.status(400).json({ message: 'Invalid data' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error saving parameter' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
