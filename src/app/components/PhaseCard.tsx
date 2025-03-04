"use client";

import React from "react";
import { Phase } from "../data/tankSetupData";
import { useTheme } from "../data/ThemeContext";

interface PhaseCardProps {
  phase: Phase;
}

export default function PhaseCard({ phase }: PhaseCardProps) {
  const { darkMode } = useTheme();

  return (
    <div className="border border-blue-100 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/30">
      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
        {phase.name}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-3">
        {phase.description}
      </p>

      <div className="mb-4">
        <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
          Expected Readings
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ammonia
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              {phase.expectedReadings.ammonia}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nitrite
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              {phase.expectedReadings.nitrite}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nitrate
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              {phase.expectedReadings.nitrate}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
          Tasks
        </h4>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
          {phase.tasks.map((task, index) => (
            <li key={index} className="mb-1">
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
