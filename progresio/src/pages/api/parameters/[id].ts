import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = parseInt(req.query.id as string);

  if (req.method === "DELETE") {
    try {
      const deletedParameter = await prisma.parameter.delete({
        where: { id },
      });
      res.status(200).json(deletedParameter);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Error deleting parameter" });
    }
  } else if (req.method === "GET") {
    try {
      const parameter = await prisma.parameter.findUnique({
        where: { id },
        include: { progress: true },
      });
      res.status(200).json({ parameter });
    } catch (error) {
      res.status(500).json({ error: "Error fetching parameter" });
    }
  }
  else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
