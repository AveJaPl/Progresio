// src/pages/api/parameters.ts

import { NextApiRequest, NextApiResponse } from 'next';

// Tymczasowa baza danych w pamięci
let parameters = [] as { id: number; name: string; type: string }[];
let progress = [] as { parameterId: number; value: any; date: string }[];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ parameters: parameters || [], progress });
  } else if (req.method === 'POST') {
    const { name, type, parameterId, value } = req.body;
    if (name && type) {
      const newParameter = { id: Date.now(), name, type };
      parameters.push(newParameter);
      res.status(201).json(newParameter);
    } else if (parameterId && value !== undefined) {
      const newProgress = { parameterId, value, date: new Date().toISOString().split('T')[0] };
      progress.push(newProgress);
      res.status(201).json(newProgress);
    } else {
      res.status(400).json({ message: 'Invalid data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
