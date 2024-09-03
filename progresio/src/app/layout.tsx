// src/app/layout.tsx

import Navigation from './components/Navigation';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white">
        <header>
          <Navigation />
        </header>
        <main className="flex-grow container mx-auto p-6">
          {children}
        </main>
        <footer className="bg-blue-600 text-white p-4 text-center">
          <p>© 2024 Progresio</p>
          <p>
            Developed by <a href="https://github.com/AveJaPl" className="underline hover:text-blue-300">AveJaPl</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
