"use client";

import React, { useState } from "react";
import { useTank } from "../data/TankContext";
import { useTheme } from "../data/ThemeContext";
import { formatDate } from "../utils/helpers";

export default function ReadingsHistory() {
  const { readings, deleteReading } = useTank();
  const { darkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Sort readings by date (newest first)
  const sortedReadings = [...readings].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this reading?")) {
      // Find the actual index in the original readings array
      const readingToDelete = sortedReadings[index];
      const originalIndex = readings.findIndex(
        (r) => r.date.getTime() === readingToDelete.date.getTime()
      );

      if (originalIndex !== -1) {
        deleteReading(originalIndex);
        setExpandedIndex(null);
      }
    }
  };

  if (sortedReadings.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No readings recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="card-header mb-4">Reading History</h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedReadings.map((reading, index) => (
          <div key={index} className="py-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(index)}>
              <div>
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  {formatDate(reading.date)}
                </h3>
                <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Ammonia: {reading.ammonia} ppm</span>
                  <span>Nitrite: {reading.nitrite} ppm</span>
                  <span>Nitrate: {reading.nitrate} ppm</span>
                </div>
              </div>
              <div className="text-blue-500 dark:text-blue-400">
                {expandedIndex === index ? "▲" : "▼"}
              </div>
            </div>

            {expandedIndex === index && (
              <div className="mt-4 pl-4 border-l-4 border-blue-100 dark:border-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ammonia
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {reading.ammonia} ppm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nitrite
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {reading.nitrite} ppm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nitrate
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {reading.nitrate} ppm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      pH
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {reading.ph}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Temperature
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {reading.temperature}°F
                    </p>
                  </div>
                </div>

                {reading.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notes
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {reading.notes}
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="text-red-500 text-sm hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Delete Reading
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
