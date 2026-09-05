import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Search Case",
  description: "DEPT full-stack hiring case — a TMDB-backed movie search app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
