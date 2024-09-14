"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth<T>(WrappedComponent: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Or a loading indicator
    }

    return <WrappedComponent {...props as any} />;
  };
}
