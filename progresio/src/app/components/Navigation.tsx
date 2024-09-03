// src/app/components/Navigation.tsx
"use client";

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Progresio</h1>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:underline px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition-colors duration-200">
            Home
          </Link>
        </li>
        <li>
          <Link href="/addParameter" className="hover:underline px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition-colors duration-200">
            Add Parameter
          </Link>
        </li>
        <li>
          <Link href="/myParameters" className="hover:underline px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition-colors duration-200">
            My Parameters
          </Link>
        </li>
      </ul>
    </nav>
  );
}
