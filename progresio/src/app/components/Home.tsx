"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white">
      <div className="max-w-4xl bg-gray-50 p-10 shadow-lg rounded-lg">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-600 text-center">
          Welcome to Progresio
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Progresio empowers you to set meaningful goals and track your progress effortlessly. Whether it’s fitness, personal growth, or any other area of life, our platform helps you stay on course and reach your milestones with precision.
        </p>
        <p className="text-lg text-gray-700 text-center mb-6">
          With Progresio, you can create custom parameters, assign them specific types, and set clear goals. Update your progress daily and watch as your achievements unfold over time.
        </p>
        <div className="text-lg text-gray-700 text-center space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">Here’s how Progresio works:</h2>
          <ul className="list-disc list-inside">
            <li>Easily create and define your own parameters.</li>
            <li>Assign a type to each parameter (e.g., numbers, percentages, time).</li>
            <li>Set specific goals and track your daily updates.</li>
            <li>Visualize your progress and stay motivated as you move towards success.</li>
          </ul>
        </div>
      </div>
      <div className="w-full flex flex-row justify-around bg-gray-50 p-10 shadow-lg rounded-lg">
        <Link href="/myParameters" className="bg-blue-500 text-white p-2 rounded-md">View Parameters</Link>
        <Link href="/addParameter" className="bg-blue-500 text-white p-2 rounded-md">Create Parameter</Link>
        <Link href="/progress" className="bg-blue-500 text-white p-2 rounded-md">Submit Progress</Link>

      </div>
    </div>
  );
}
