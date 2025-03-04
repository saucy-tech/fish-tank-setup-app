"use client";

import React from "react";
import { WaterReading } from "../data/tankSetupData";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReadingsChartProps {
  readings: WaterReading[];
}

export default function ReadingsChart({ readings }: ReadingsChartProps) {
  // If no readings, show a message
  if (readings.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No readings recorded yet.
      </p>
    );
  }

  // Sort readings by date
  const sortedReadings = [...readings].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Format dates for labels
  const labels = sortedReadings.map((reading) => format(reading.date, "MMM d"));

  // Prepare data for each parameter
  const ammoniaData = sortedReadings.map((reading) => reading.ammonia);
  const nitriteData = sortedReadings.map((reading) => reading.nitrite);
  const nitrateData = sortedReadings.map((reading) => reading.nitrate);
  const phData = sortedReadings.map((reading) => reading.ph);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Ammonia (ppm)",
        data: ammoniaData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.2,
      },
      {
        label: "Nitrite (ppm)",
        data: nitriteData,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.2,
      },
      {
        label: "Nitrate (ppm)",
        data: nitrateData,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        tension: 0.2,
      },
      {
        label: "pH",
        data: phData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.2,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "ppm",
        },
        min: 0,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "pH",
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 6,
        max: 8,
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Line options={options} data={chartData} />
    </div>
  );
}
