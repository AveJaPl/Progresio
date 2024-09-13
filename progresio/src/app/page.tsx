"use client";

import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import ProgressForm from './components/ProgressForm';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Track Today&apos;s Progress</h1>
      {isAuthenticated ? <ProgressForm /> : <AuthForm />}
    </div>
  );
}
