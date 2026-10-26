import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopBar from "@/components/TopBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ziki",
  description: "A front-end mock-up of Ziki (fake data), for an interaction design proposal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TopBar />
        <main id="main-content" className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
