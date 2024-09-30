import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "@/app/utils/encryption";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify the token and extract userId
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log("Today: ");
    console.log(today);

    const dayOfWeek = (today.getDay() + 6) % 7;
    console.log("Day of week: ");
    console.log(dayOfWeek);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    console.log("Start of week: ");
    console.log(startOfWeek);
    const endOfWeek = new Date(today);
    endOfWeek.setHours(23, 59, 59, 999);
    console.log("End of week: ");
    console.log(endOfWeek);

    // 3. Fetch parameters and associated data entries for the current week
    const parameters = await prisma.parameter.findMany({
      where: { userId: decoded.userId },
      include: {
        dataEntries: {
          where: {
            date: {
              gte: startOfWeek,
              lt: endOfWeek,
            },
          },
        },
      },
    });

    if (parameters.length === 0) {
      return NextResponse.json(
        { error: "No parameters found" },
        { status: 404 }
      );
    }

    const decryptedParameters = parameters.map((parameter) => ({
      ...parameter,
      name: decrypt(parameter.name),
      goalValue: decrypt(parameter.goalValue),
    }));

    // 6. Calculate the total number of successful entries
    const totalSum = decryptedParameters.reduce(
      (sum, { goalOperator, goalValue, dataEntries }) => {
        const entriesSucceeded = dataEntries.reduce((count, { value }) => {
          if (goalValue == "Yes" || goalValue == "No") {
            goalValue = goalValue === "Yes" ? "true" : "false";
            goalOperator = "=";
          }
          const numericGoalValue = parseFloat(goalValue);
          const numericValue = parseFloat(value);

          let comparisonResult = false;

          switch (goalOperator) {
            case ">=":
              comparisonResult = numericValue >= numericGoalValue;
              break;
            case ">":
              comparisonResult = numericValue > numericGoalValue;
              break;
            case "<":
              comparisonResult = numericValue < numericGoalValue;
              break;
            case "<=":
              comparisonResult = numericValue <= numericGoalValue;
              break;
            case "=":
              comparisonResult = value === goalValue;
              break;
            default:
              break;
          }
          console.log(
            `Comparing: ${value} ${goalOperator} ${goalValue} result: ${comparisonResult}`
          );

          return count + (comparisonResult ? 1 : 0);
        }, 0);

        return sum + entriesSucceeded;
      },
      0
    );
    console.log("Total sum: ");
    console.log(totalSum);

    console.log("Expected entries number: ");
    console.log((dayOfWeek + 1) * decryptedParameters.length);

    const expectedEntriesNumber = (dayOfWeek + 1) * decryptedParameters.length;

    // 7. Calculate progress percentage
    const progress = (totalSum / expectedEntriesNumber) * 100;
    console.log(`Progress: ${progress}%`);

    return NextResponse.json(progress);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching parameters" },
      { status: 500 }
    );
  }
}
