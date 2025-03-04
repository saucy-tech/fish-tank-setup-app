import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TankProvider } from "./data/TankContext";
import { ThemeProvider } from "./data/ThemeContext";
import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fish Tank Cycling Tracker",
  description: "Track your fish tank cycling progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900 min-h-screen dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider>
          <TankProvider>
            <Navigation />
            <main className="pt-20 pb-6 px-4">{children}</main>
          </TankProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
