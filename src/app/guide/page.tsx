"use client";

import React from "react";
import { useTheme } from "../data/ThemeContext";
import { phases } from "../data/tankSetupData";
import PhaseCard from "../components/PhaseCard";

export default function GuidePage() {
  const { darkMode } = useTheme();

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-2">
          Fish Tank Cycling Guide
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Learn about the nitrogen cycle and how to properly set up your fish
          tank
        </p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="card-header mb-4">What is the Nitrogen Cycle?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The nitrogen cycle is a biological process that converts toxic ammonia
          from fish waste and decaying matter into less harmful nitrates. This
          process is essential for a healthy aquarium environment.
        </p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
            The Cycle Process:
          </h3>
          <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <span className="font-semibold">Ammonia Production:</span> Fish
              waste, uneaten food, and decaying plant matter produce ammonia,
              which is highly toxic to fish.
            </li>
            <li>
              <span className="font-semibold">Nitrosomonas Bacteria:</span>{" "}
              These beneficial bacteria convert ammonia into nitrites, which are
              still toxic to fish.
            </li>
            <li>
              <span className="font-semibold">Nitrobacter Bacteria:</span> These
              bacteria convert nitrites into nitrates, which are much less
              harmful to fish in moderate amounts.
            </li>
            <li>
              <span className="font-semibold">Water Changes:</span> Regular
              water changes help remove nitrates from the system.
            </li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
            Why Cycling is Important:
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Cycling your tank before adding fish ensures that beneficial
            bacteria colonies are established to process toxic waste. Without
            this process, fish would be exposed to harmful levels of ammonia and
            nitrites, leading to stress, disease, and death.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
            Signs of a Cycled Tank:
          </h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Ammonia: 0 ppm</li>
            <li>Nitrite: 0 ppm</li>
            <li>Nitrate: Present (typically 5-40 ppm)</li>
            <li>Consistent readings for at least a week</li>
          </ul>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="card-header mb-4">Cycling Timeline</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Below is a breakdown of what to expect during each phase of the
          cycling process. Remember that actual times may vary based on
          temperature, bacterial starters, and other factors.
        </p>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={index} className="mb-4">
              <PhaseCard phase={phase} />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="card-header mb-4">Tips for Success</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              Be Patient
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Cycling takes time. Rushing the process by adding fish too early
              can harm your fish and actually make the cycle take longer.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              Test Regularly
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Test your water parameters every 2-3 days to track the progress of
              your cycle.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              Maintain Temperature
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Keep your tank temperature between 75-82°F (24-28°C) to encourage
              bacterial growth.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              Don't Clean Too Much
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              During cycling, don't clean your filter or gravel too thoroughly
              as this can remove beneficial bacteria.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              Start Slow
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Once cycled, add fish gradually over time rather than all at once
              to avoid overwhelming your biological filter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
