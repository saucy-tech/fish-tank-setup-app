"use client";

import React from "react";
import { useTheme } from "../data/ThemeContext";

export default function FooterBanner() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700"
          : "bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200"
      } py-4 mt-8`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="text-gray-700 dark:text-gray-300">Made with</span>
          <span className="text-red-500">❤️</span>
          <span className="text-gray-700 dark:text-gray-300">in</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            Atlanta
          </span>
          <span className="text-gray-700 dark:text-gray-300">by</span>
          <a
            href="https://github.com/saucy-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            SaucyTech
          </a>
        </div>
      </div>
    </div>
  );
}
