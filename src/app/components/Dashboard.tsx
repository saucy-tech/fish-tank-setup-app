"use client";

import React from "react";
import Link from "next/link";
import { useTank } from "../data/TankContext";
import { useTheme } from "../data/ThemeContext";
import { formatDate } from "../utils/helpers";
import { phases, startDate } from "../data/tankSetupData";
import PhaseCard from "./PhaseCard";

// Helper functions
const getDaysSinceStart = () => {
  if (!startDate) return 0;
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getPhaseProgress = (currentPhase: any) => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const phaseDuration = currentPhase.endDay - currentPhase.startDay;
  const daysInPhase = currentDay - currentPhase.startDay;

  return Math.min(100, Math.round((daysInPhase / phaseDuration) * 100));
};

const getOverallProgress = () => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalDuration = phases[phases.length - 1].endDay;

  return Math.min(100, Math.round((currentDay / totalDuration) * 100));
};

const getPhaseEndDate = (phase: any) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + phase.endDay);
  return endDate;
};

// Calculate estimated date for a task based on phase timeline
const getEstimatedDate = (phaseId: number): Date => {
  const phase = phases[phaseId];
  const phaseStartDate = new Date(startDate);
  phaseStartDate.setDate(phaseStartDate.getDate() + phase.startDay);

  // Add a few days into the phase for the estimated date
  const estimatedDate = new Date(phaseStartDate);
  const phaseDuration = phase.endDay - phase.startDay;
  const daysToAdd = Math.min(Math.floor(phaseDuration / 2), 3); // Middle of phase or 3 days in, whichever is smaller
  estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);

  return estimatedDate;
};

export default function Dashboard() {
  const { readings, tasks, getCurrentPhase } = useTank();
  const { darkMode } = useTheme();
  const currentPhase = getCurrentPhase();
  const daysSinceStart = getDaysSinceStart();

  if (!currentPhase) {
    return <div className="p-4">Loading...</div>;
  }

  const phaseProgress = getPhaseProgress(currentPhase);
  const overallProgress = getOverallProgress();
  const phaseEndDate = getPhaseEndDate(currentPhase);

  // Get the most recent reading
  const latestReading =
    readings.length > 0 ? readings[readings.length - 1] : null;

  // Get incomplete tasks for current phase
  const currentPhaseId = phases.findIndex((p) => p.name === currentPhase.name);
  const incompleteTasks = tasks
    .filter((task) => !task.completed && task.phaseId === currentPhaseId)
    .slice(0, 3); // Show only the first 3 incomplete tasks

  // Get high priority tasks
  const highPriorityTasks = tasks
    .filter((task) => !task.completed && task.priority === "high")
    .slice(0, 2);

  // Get tasks with due dates
  const tasksWithDueDates = tasks
    .filter((task) => !task.completed && task.dueDate)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    })
    .slice(0, 2);

  // Get upcoming tasks from future phases
  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.phaseId > currentPhaseId)
    .sort((a, b) => a.phaseId - b.phaseId)
    .slice(0, 3);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-r from-blue-800 to-blue-900"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        } rounded-xl p-6 shadow-md mb-6 text-white`}>
        <h1 className="text-3xl font-bold mb-2">Fish Tank Cycling Tracker</h1>
        <p className="text-blue-100">
          Started on {formatDate(startDate)} ({daysSinceStart} days ago)
        </p>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
          <div className="bg-white/20 rounded-full h-2.5 mb-4">
            <div
              className="bg-white h-2.5 rounded-full"
              style={{ width: `${overallProgress}%` }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold">{daysSinceStart}</div>
              <div className="text-blue-100 text-sm">Days Since Start</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold">{readings.length}</div>
              <div className="text-blue-100 text-sm">Readings Recorded</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold">{currentPhase.name}</div>
              <div className="text-blue-100 text-sm">Current Phase</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2">
          <div className="card p-6 h-full">
            <h2 className="card-header">Current Phase</h2>
            <PhaseCard phase={currentPhase} />
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300">Phase Progress</p>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${phaseProgress}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Expected completion: {formatDate(phaseEndDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="card p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-header mb-0">Latest Readings</h2>
              <Link
                href="/readings"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                View All →
              </Link>
            </div>
            {latestReading ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDate(latestReading.date)}
                  </span>
                  <span className="badge badge-blue">Latest</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Ammonia
                    </div>
                    <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {latestReading.ammonia} ppm
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Nitrite
                    </div>
                    <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {latestReading.nitrite} ppm
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Nitrate
                    </div>
                    <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {latestReading.nitrate} ppm
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      pH
                    </div>
                    <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {latestReading.ph}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex-grow">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Temperature
                    </div>
                    <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {latestReading.temperature}°F
                    </div>
                  </div>
                </div>

                {latestReading.notes && (
                  <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {latestReading.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No readings recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-header mb-0">Current Tasks</h2>
            <Link
              href="/tasks"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
              View All →
            </Link>
          </div>

          {incompleteTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {incompleteTasks.map((task) => (
                <li key={task.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className="h-5 w-5 border-2 border-blue-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 dark:text-gray-200">
                        {task.text}
                      </p>
                      <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-1 gap-2">
                        <span>Phase: {currentPhase.name}</span>
                        {task.dueDate ? (
                          <span className="badge badge-blue">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        ) : (
                          <span className="badge badge-gray">
                            Est: {formatDate(getEstimatedDate(task.phaseId))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No pending tasks for this phase.
            </p>
          )}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-header mb-0">High Priority</h2>
          </div>

          {highPriorityTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {highPriorityTasks.map((task) => (
                <li key={task.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className="h-5 w-5 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 dark:text-gray-200">
                        {task.text}
                      </p>
                      <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-1 gap-2">
                        <span className="badge badge-red">High Priority</span>
                        {task.dueDate ? (
                          <span className="badge badge-blue">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        ) : (
                          <span className="badge badge-gray">
                            Est: {formatDate(getEstimatedDate(task.phaseId))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No high priority tasks.
            </p>
          )}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-header mb-0">Upcoming Due Dates</h2>
          </div>

          {tasksWithDueDates.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasksWithDueDates.map((task) => (
                <li key={task.id} className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className="h-5 w-5 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 dark:text-gray-200">
                        {task.text}
                      </p>
                      <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-1 gap-2">
                        <span className="badge badge-yellow">
                          Due: {task.dueDate ? formatDate(task.dueDate) : "N/A"}
                        </span>
                        <span>Phase: {phases[task.phaseId].name}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No tasks with due dates.
            </p>
          )}
        </div>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-header mb-0">Upcoming Tasks Timeline</h2>
          <Link
            href="/tasks"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
            View All →
          </Link>
        </div>

        {upcomingTasks.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800"></div>

            <ul className="space-y-4">
              {upcomingTasks.map((task) => {
                const estimatedDate = getEstimatedDate(task.phaseId);
                const phaseName = phases[task.phaseId].name;

                return (
                  <li key={task.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-blue-800 dark:text-blue-300">
                        {task.phaseId + 1}
                      </span>
                    </div>

                    <div className="card p-3">
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {task.text}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge badge-blue">{phaseName}</span>
                        {task.dueDate ? (
                          <span className="badge badge-yellow">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        ) : (
                          <span className="badge badge-gray">
                            Est: {formatDate(estimatedDate)}
                          </span>
                        )}
                        <span
                          className={`badge ${getPriorityBadgeClass(
                            task.priority
                          )}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No upcoming tasks in future phases.
          </p>
        )}
      </div>

      <div className="card p-6 mb-6">
        <h2 className="card-header">Water Parameters History</h2>
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p>Water parameters chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}

// Helper function to get priority badge class
function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case "high":
      return "badge-red";
    case "medium":
      return "badge-yellow";
    case "low":
      return "badge-green";
    default:
      return "badge-gray";
  }
}
