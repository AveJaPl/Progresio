// src/app/components/ParameterProgress.tsx
"use client";

import { useEffect, useState } from 'react';

interface Progress {
  parameterId: number;
  value: boolean | number;
  date: string;
}

interface Parameter {
  id: number;
  name: string;
  type: 'boolean' | 'int' | 'float';
}

interface ParameterProgressProps {
  parameter: Parameter;
}

export default function ParameterProgress({ parameter }: ParameterProgressProps) {
  const [progressData, setProgressData] = useState<Progress[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(`/api/parameters?parameterId=${parameter.id}`);
      const data = await res.json();
      setProgressData(data);
    };

    fetchProgress();
  }, [parameter.id]);

  const calculateWeeklyAverage = () => {
    const lastWeekProgress = progressData.filter(p => {
      const date = new Date(p.date);
      const now = new Date();
      return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
    });

    return calculateAverage(lastWeekProgress);
  };

  const calculateYearlyAverage = () => {
    const lastYearProgress = progressData.filter(p => {
      const date = new Date(p.date);
      const now = new Date();
      return now.getTime() - date.getTime() <= 365 * 24 * 60 * 60 * 1000;
    });

    return calculateAverage(lastYearProgress);
  };

  const calculateAverage = (data: Progress[]) => {
    if (parameter.type === 'boolean') {
      const trueCount = data.filter(p => p.value === true).length;
      return trueCount / data.length;
    } else {
      const sum = data.reduce((acc, p) => acc + (p.value as number), 0);
      return sum / data.length;
    }
  };

  const calculateMaxStreak = () => {
    if (parameter.type !== 'boolean') return 0;

    let maxStreak = 0;
    let currentStreak = 0;

    progressData.forEach((p, index) => {
      if (p.value === true) {
        currentStreak += 1;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
      }

      if (index === progressData.length - 1) {
        maxStreak = Math.max(maxStreak, currentStreak);
      }
    });

    return maxStreak;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Progress for {parameter.name}</h2>
      <p>Weekly Average: {calculateWeeklyAverage().toFixed(2)}</p>
      <p>Yearly Average: {calculateYearlyAverage().toFixed(2)}</p>
      {parameter.type === 'boolean' && <p>Max Streak: {calculateMaxStreak()}</p>}
    </div>
  );
}
