"use client";

import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import ProgressForm from './components/ProgressForm';
import Home from './components/Home';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {isAuthenticated ? <Home /> : <AuthForm />}
    </div>
  );
}
