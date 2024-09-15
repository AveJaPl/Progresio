"use client";

import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Home from './components/Home';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {loading ? "Loading..." : isAuthenticated ? <Home /> : <AuthForm />}
    </div>
  );
}
