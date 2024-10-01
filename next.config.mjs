import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: "public", // Lokalizacja plików wygenerowanych przez PWA
  disable: process.env.NODE_ENV === "development", // Włączenie PWA tylko w trybie produkcyjnym
  register: true, // Automatyczna rejestracja Service Workera
  skipWaiting: true, // Automatyczna aktywacja nowej wersji Service Workera
  mode: "production",
  buildExcludes: [/middleware-manifest\.json$/], // Netlify Middleware exclusions
});

export default nextConfig;
