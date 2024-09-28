// app/(protected)/layout.tsx
"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Header from "@/app/components/Header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex-grow px-2 md:px-4 xl:px-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
