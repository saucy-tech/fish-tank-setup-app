"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../data/ThemeContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useTheme();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Tasks", path: "/tasks", icon: "✓" },
    { name: "Readings", path: "/readings", icon: "📈" },
    { name: "Guide", path: "/guide", icon: "📚" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? "bg-gray-800 shadow-md text-white"
            : "bg-white shadow-md text-blue-900"
          : darkMode
          ? "bg-gradient-to-r from-blue-800 to-blue-900 text-white"
          : "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Fish Tank Tracker
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full focus:outline-none mr-2"
            aria-label="Toggle dark mode">
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  pathname === item.path
                    ? scrolled
                      ? darkMode
                        ? "bg-gray-700 text-white font-medium"
                        : "bg-blue-100 text-blue-800 font-medium"
                      : darkMode
                      ? "bg-white/20 text-white font-medium"
                      : "bg-white/20 text-white font-medium"
                    : scrolled
                    ? darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-blue-800 hover:bg-blue-50"
                    : darkMode
                    ? "text-white/90 hover:bg-white/10"
                    : "text-white/90 hover:bg-white/10"
                } transition-colors duration-200`}>
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center ${
                  pathname === item.path
                    ? scrolled
                      ? darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-blue-100 text-blue-800"
                      : darkMode
                      ? "bg-white/20 text-white"
                      : "bg-white/20 text-white"
                    : scrolled
                    ? darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-blue-800 hover:bg-blue-50"
                    : darkMode
                    ? "text-white/90 hover:bg-white/10"
                    : "text-white/90 hover:bg-white/10"
                } block py-2 px-4 rounded-lg transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}>
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
