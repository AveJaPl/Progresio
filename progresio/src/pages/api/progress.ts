import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Globalna instancja Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { parameterId, value, date } = req.body;
    
    try {
      if (parameterId && value !== undefined && date) {
        // Konwersja daty na format DateTime
        const parsedDate = new Date(date);

        // Użycie upsert do nadpisania wpisu, jeśli istnieje, lub stworzenia nowego, jeśli nie
        const upsertedProgress = await prisma.progress.upsert({
          where: {
            // Użycie unikalnego klucza złożonego z parameterId i date
            parameterId_date: {
              parameterId,
              date: parsedDate, // Konwersja na obiekt Date
            },
          },
          update: {
            value: String(value), // Nadpisujemy wartość
          },
          create: {
            parameterId,
            value: String(value),
            date: parsedDate, // Tworzymy nowy wpis, jeśli nie istnieje
          },
        });

        res.status(201).json(upsertedProgress);
      } else {
        res.status(400).json({ message: 'Invalid data' });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      res.status(500).json({ error: 'Error saving progress' });
    }
  } else if (req.method === 'GET') {
    const { date } = req.query;

    if (!date) {
      res.status(400).json({ message: 'Date query parameter is required' });
      return;
    }

    try {
      const parsedDate = new Date(date as string); // Konwersja na obiekt Date

      const existingProgress = await prisma.progress.findMany({
        where: {
          date: parsedDate,
        },
      });

      if (existingProgress.length > 0) {
        res.status(200).json({ exists: true, progress: existingProgress });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking progress for the date:', error);
      res.status(500).json({ error: 'Error checking progress for the date' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
