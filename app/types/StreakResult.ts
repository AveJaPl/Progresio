// types/StreakResult.ts

export interface StreakResult {
    currentStreak: number;
    longestStreak: number;
    totalSuccesses: number;
    totalFailures: number;
    latestEntrySuccess: boolean | null;
}
