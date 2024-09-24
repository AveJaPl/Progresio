// utils/calculateStreak.ts

import { Parameter } from '@/app/types/Parameter';
import { StreakResult } from '@/app/types/StreakResult';

export const calculateStreak = (parameter: Parameter): StreakResult => {
    let currentStreak = 0;
    let longestStreak = 0;
    let totalSuccesses = 0;
    let totalFailures = 0;
    let latestEntrySuccess: boolean | null = null;

    const { goalValue, dataEntries, type, goalOperator } = parameter;

    if (!dataEntries || dataEntries.length === 0) {
        // No data entries to process
        return {
            longestStreak: 0,
            totalSuccesses: 0,
            totalFailures: 0,
            latestEntrySuccess: null,
            currentStreak: 0,
        };
    }

    // Sort dataEntries by date ascending to process chronologically
    const sortedEntries = [...dataEntries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Define goal value in appropriate type
    let parsedGoalValue: number | string | boolean;
    if (type === "number") {
        parsedGoalValue = parseFloat(goalValue);
        if (isNaN(parsedGoalValue)) {
            console.error("Invalid goalValue for type number");
            return {
                longestStreak: 0,
                totalSuccesses: 0,
                totalFailures: 0,
                latestEntrySuccess: null,
                currentStreak: 0,
            };
        }
    } else if (type === "boolean") {
        // Map "Yes"/"No" to true/false
        if (goalValue.toLowerCase() === "yes") {
            parsedGoalValue = true;
        } else if (goalValue.toLowerCase() === "no") {
            parsedGoalValue = false;
        } else {
            console.error("Invalid goalValue for type boolean");
            return {
                longestStreak: 0,
                totalSuccesses: 0,
                totalFailures: 0,
                latestEntrySuccess: null,
                currentStreak: 0,
            };
        }
    } else {
        parsedGoalValue = goalValue;
    }

    for (let entry of sortedEntries) {
        let entryValue: number | string | boolean;
        let isSuccess = false;

        if (type === "number") {
            entryValue = parseFloat(entry.value);
            if (isNaN(entryValue)) {
                // Invalid entry value for number type, treat as failed day
                totalFailures++;
                currentStreak = 0;
                continue;
            }
            switch (goalOperator) {
                case ">=":
                    isSuccess = entryValue >= (parsedGoalValue as number);
                    break;
                case "<=":
                    isSuccess = entryValue <= (parsedGoalValue as number);
                    break;
                case "=":
                    isSuccess = entryValue === (parsedGoalValue as number);
                    break;
                case ">":
                    isSuccess = entryValue > (parsedGoalValue as number);
                    break;
                case "<":
                    isSuccess = entryValue < (parsedGoalValue as number);
                    break;
                default:
                    console.error("Invalid goalOperator for number type");
            }
        } else if (type === "boolean") {
            // Map "true"/"false" to boolean
            if (entry.value.toLowerCase() === "true") {
                entryValue = true;
            } else if (entry.value.toLowerCase() === "false") {
                entryValue = false;
            } else {
                // Invalid boolean value, treat as failed day
                totalFailures++;
                currentStreak = 0;
                continue;
            }
            isSuccess = entryValue === (parsedGoalValue as boolean);
        } else {
            // For string type
            entryValue = entry.value;
            isSuccess = entryValue === (parsedGoalValue as string);
        }

        if (isSuccess) {
            currentStreak++;
            totalSuccesses++;
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
            latestEntrySuccess = true;
        } else {
            totalFailures++;
            currentStreak = 0;
            latestEntrySuccess = false;
        }
    }

    return {
        longestStreak,
        totalSuccesses,
        totalFailures,
        latestEntrySuccess,
        currentStreak,
    };
};
