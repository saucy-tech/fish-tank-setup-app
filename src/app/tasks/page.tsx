"use client";

import React from "react";
import TaskList from "../components/TaskList";
import { useTank } from "../data/TankContext";
import { useTheme } from "../data/ThemeContext";
import { phases } from "../data/tankSetupData";

export default function TasksPage() {
  const { getCurrentPhase, tasks } = useTank();
  const { darkMode } = useTheme();
  const currentPhase = getCurrentPhase();

  // Calculate overall progress
  const calculateProgress = () => {
    if (!currentPhase) return 0;

    const totalDays = phases[phases.length - 1].endDay;
    const currentEndDay = currentPhase.endDay;

    return Math.min(100, Math.round((currentEndDay / totalDays) * 100));
  };

  // Calculate task completion stats
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    const currentPhaseTasks = tasks.filter(
      (t) =>
        currentPhase &&
        t.phaseId === phases.findIndex((p) => p.name === currentPhase.name)
    );
    const currentPhaseCompleted = currentPhaseTasks.filter(
      (t) => t.completed
    ).length;
    const currentPhaseTotal = currentPhaseTasks.length;
    const currentPhaseRate =
      currentPhaseTotal > 0
        ? Math.round((currentPhaseCompleted / currentPhaseTotal) * 100)
        : 0;

    return {
      total,
      completed,
      completionRate,
      currentPhaseTotal,
      currentPhaseCompleted,
      currentPhaseRate,
    };
  };

  const stats = getTaskStats();

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-r from-blue-800 to-blue-900"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        } rounded-xl p-6 shadow-md mb-6 text-white`}>
        <h1 className="text-3xl font-bold mb-2">Tank Setup Tasks</h1>
        <p className="text-blue-100 mb-6">
          Track your progress through the tank cycling process
        </p>

        {currentPhase && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{calculateProgress()}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-2.5 mb-6">
              <div
                className="bg-white h-2.5 rounded-full"
                style={{ width: `${calculateProgress()}%` }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-blue-100 text-sm">Total Tasks</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.completed}</div>
                <div className="text-blue-100 text-sm">Completed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {stats.completionRate}%
                </div>
                <div className="text-blue-100 text-sm">Completion Rate</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">{currentPhase.name}</div>
                <div className="text-blue-100 text-sm">Current Phase</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TaskList />
        </div>

        <div>
          <div className="card p-6 mb-6">
            <h2 className="card-header">Phase Timeline</h2>
            <div className="space-y-4">
              {phases.map((phase, index) => {
                const isCurrentPhase =
                  currentPhase && currentPhase.name === phase.name;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isCurrentPhase
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700"
                    }`}>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          isCurrentPhase
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}>
                        {index + 1}
                      </div>
                      <h3
                        className={`font-medium ${
                          isCurrentPhase
                            ? "text-blue-800 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}>
                        {phase.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Days {phase.startDay} - {phase.endDay}
                    </p>
                    {isCurrentPhase && (
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                        {stats.currentPhaseCompleted} of{" "}
                        {stats.currentPhaseTotal} tasks completed (
                        {stats.currentPhaseRate}%)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="card-header">Tips</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-2 text-lg">
                  •
                </span>
                <span>Complete tasks in order for best results</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-2 text-lg">
                  •
                </span>
                <span>Add custom tasks for your specific setup needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-2 text-lg">
                  •
                </span>
                <span>Record water readings regularly to track progress</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 dark:text-blue-400 mr-2 text-lg">
                  •
                </span>
                <span>
                  Be patient - cycling takes time to complete properly
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
