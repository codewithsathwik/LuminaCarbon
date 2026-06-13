import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina Carbon",
  description: "Carbon Footprint Awareness Platform",
};

import { CarbonProvider } from "@/context/CarbonContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-[var(--background)] text-[var(--foreground)]">
        <CarbonProvider>
          <Sidebar />
          <main className="md:ml-64 flex-1 p-6 md:p-8 min-h-screen pb-24 md:pb-8">
            {children}
          </main>
        </CarbonProvider>
      </body>
    </html>
  );
}
