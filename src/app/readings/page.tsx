"use client";

import React from "react";
import ReadingsHistory from "../components/ReadingsHistory";
import AddReadingForm from "../components/AddReadingForm";

export default function ReadingsPage() {
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-2">
          Water Readings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and monitor your water parameters over time
        </p>
      </div>

      <AddReadingForm />
      <ReadingsHistory />
    </div>
  );
}
