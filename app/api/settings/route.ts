// app/api/settings/route.ts

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // Extract token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify JWT token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const { userId } = decoded;

    // Parse request body
    const { language, password, email } = await request.json();

    console.log(`Received data: Language: ${language}, Password: ${password || "Not provided"}, Email: ${email || "Not provided"}`);
    console.log(`User ID: ${userId}`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prepare data for update
    const dataToUpdate: any = {
      language,
    };

    // Update password if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    // Update email if provided
    if (email && email.trim() !== "") {
      // Check if the new email is already taken by another user
      const emailExists = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (emailExists && emailExists.id !== userId) {
        return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
      }

      dataToUpdate.email = email;
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });

    console.log("Updated user:", updatedUser);

    return NextResponse.json({ message: "Settings have been updated successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating settings:", error);

    // Handle JWT verification errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    return NextResponse.json({ error: "An error occurred while updating settings." }, { status: 500 });
  }
}
