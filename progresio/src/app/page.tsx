// src/app/page.tsx
"use client";

import ProgressForm from './components/ProgressForm';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-8">Track Today&apos;s Progress</h1>
      <ProgressForm />
    </div>
  );
}
