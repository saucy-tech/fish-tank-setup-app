"use client";

import React from "react";

interface ProgressBarProps {
  percentage: number;
  height?: string;
  color?: string;
}

export default function ProgressBar({
  percentage,
  height = "h-4",
  color = "bg-blue-500",
}: ProgressBarProps) {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  // Determine color based on progress
  let progressColor = color;
  if (color === "bg-blue-500") {
    if (safePercentage < 25) {
      progressColor = "bg-red-500";
    } else if (safePercentage < 50) {
      progressColor = "bg-orange-500";
    } else if (safePercentage < 75) {
      progressColor = "bg-yellow-500";
    } else {
      progressColor = "bg-green-500";
    }
  }

  return (
    <div
      className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
      <div
        className={`${progressColor} ${height} rounded-full transition-all duration-500 ease-in-out`}
        style={{ width: `${safePercentage}%` }}
      />
      <div className="text-right mt-1">
        <span className="text-sm text-gray-600">
          {Math.round(safePercentage)}%
        </span>
      </div>
    </div>
  );
}
