import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TankProvider } from "./data/TankContext";
import { ThemeProvider } from "./data/ThemeContext";
import Navigation from "./components/Navigation";
import FooterBanner from "./components/FooterBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        className={`${inter.variable} font-sans antialiased bg-gray-100 dark:bg-gray-900 min-h-screen dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider>
          <TankProvider>
            <Navigation />
            <main className="pt-20 pb-6 px-4">{children}</main>
            <FooterBanner />
          </TankProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
