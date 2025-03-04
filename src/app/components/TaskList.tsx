"use client";

import React, { useState } from "react";
import { useTank, Task } from "../data/TankContext";
import { useTheme } from "../data/ThemeContext";
import { formatDate } from "../utils/helpers";
import { phases, startDate } from "../data/tankSetupData";

export default function TaskList() {
  const {
    tasks,
    toggleTaskCompletion,
    deleteTask,
    addTask,
    getCurrentPhase,
    updateTask,
  } = useTank();
  const { darkMode } = useTheme();
  const [newTaskText, setNewTaskText] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [filterPhase, setFilterPhase] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [newTaskCategory, setNewTaskCategory] = useState<
    "maintenance" | "testing" | "equipment" | "other"
  >("maintenance");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskDueDate, setEditTaskDueDate] = useState("");
  const [showEstimatedDates, setShowEstimatedDates] = useState(true);

  const currentPhase = getCurrentPhase();
  const currentPhaseId = currentPhase
    ? phases.findIndex((p) => p.name === currentPhase.name)
    : null;

  // Calculate estimated dates for tasks based on phase timeline
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

  // Filter tasks based on completion status, phase, category, and priority
  const filteredTasks = tasks.filter((task) => {
    // Filter by completion status
    if (!showCompleted && task.completed) return false;

    // Filter by phase if a phase filter is selected
    if (filterPhase !== null && task.phaseId !== filterPhase) return false;

    // Filter by category if a category filter is selected
    if (filterCategory !== null && task.category !== filterCategory)
      return false;

    // Filter by priority if a priority filter is selected
    if (filterPriority !== null && task.priority !== filterPriority)
      return false;

    return true;
  });

  // Sort tasks: incomplete first, then by due date, then by priority, then by phase, then by date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then sort by due date if available
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if (a.dueDate) {
      return -1; // a has due date, b doesn't
    } else if (b.dueDate) {
      return 1; // b has due date, a doesn't
    }

    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Then sort by phase
    if (a.phaseId !== b.phaseId) {
      return a.phaseId - b.phaseId;
    }

    // Then sort by date (newest first)
    return b.date.getTime() - a.date.getTime();
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    addTask({
      text: newTaskText,
      completed: false,
      date: new Date(),
      phaseId: currentPhaseId || 0,
      isCustom: true,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
      priority: newTaskPriority,
      category: newTaskCategory,
    });

    setNewTaskText("");
    setNewTaskDueDate("");
    setNewTaskPriority("medium");
    setNewTaskCategory("maintenance");
    setShowAddTaskForm(false);
  };

  const handleToggleTask = (id: string) => {
    toggleTaskCompletion(id);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskDueDate(
      task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
    );
  };

  const handleSaveTaskDate = (task: Task) => {
    if (updateTask) {
      updateTask(task.id, {
        ...task,
        dueDate: editTaskDueDate ? new Date(editTaskDueDate) : undefined,
      });
    }
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const getPriorityBadgeClass = (priority: string) => {
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
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "maintenance":
        return "badge-blue";
      case "testing":
        return "badge-purple";
      case "equipment":
        return "badge-blue";
      case "other":
        return "badge-gray";
      default:
        return "badge-gray";
    }
  };

  const isDueSoon = (dueDate?: Date) => {
    if (!dueDate) return false;
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return dueDate < new Date();
  };

  return (
    <div className="card p-6">
      <h2 className="card-header">Tank Setup Tasks</h2>

      {/* Current phase indicator */}
      {currentPhase && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Current Phase:</span>{" "}
            {currentPhase.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentPhase.description}
          </p>
        </div>
      )}

      {/* Add new task button */}
      <div className="mb-6">
        {!showAddTaskForm ? (
          <button
            onClick={() => setShowAddTaskForm(true)}
            className="btn-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Task
          </button>
        ) : (
          <form
            onSubmit={handleAddTask}
            className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              Add New Task
            </h3>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Description
              </label>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Enter task description..."
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newTaskPriority}
                  onChange={(e) =>
                    setNewTaskPriority(
                      e.target.value as "low" | "medium" | "high"
                    )
                  }
                  className="input-field">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={newTaskCategory}
                onChange={(e) =>
                  setNewTaskCategory(
                    e.target.value as
                      | "maintenance"
                      | "testing"
                      | "equipment"
                      | "other"
                  )
                }
                className="input-field">
                <option value="maintenance">Maintenance</option>
                <option value="testing">Testing</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowAddTaskForm(false)}
                className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Show Completed
          </label>
          <div className="relative inline-block w-full">
            <select
              value={showCompleted ? "yes" : "no"}
              onChange={(e) => setShowCompleted(e.target.value === "yes")}
              className="input-field">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Phase
          </label>
          <div className="relative inline-block w-full">
            <select
              value={filterPhase !== null ? filterPhase : ""}
              onChange={(e) =>
                setFilterPhase(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              className="input-field">
              <option value="">All Phases</option>
              {phases.map((phase, index) => (
                <option key={index} value={index}>
                  {phase.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Category
          </label>
          <div className="relative inline-block w-full">
            <select
              value={filterCategory !== null ? filterCategory : ""}
              onChange={(e) =>
                setFilterCategory(e.target.value === "" ? null : e.target.value)
              }
              className="input-field">
              <option value="">All Categories</option>
              <option value="maintenance">Maintenance</option>
              <option value="testing">Testing</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Priority
          </label>
          <div className="relative inline-block w-full">
            <select
              value={filterPriority !== null ? filterPriority : ""}
              onChange={(e) =>
                setFilterPriority(e.target.value === "" ? null : e.target.value)
              }
              className="input-field">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="showEstimatedDates"
          checked={showEstimatedDates}
          onChange={(e) => setShowEstimatedDates(e.target.checked)}
          className="mr-2"
        />
        <label
          htmlFor="showEstimatedDates"
          className="text-sm text-gray-700 dark:text-gray-300">
          Show estimated dates for tasks without due dates
        </label>
      </div>

      {/* Task list */}
      {sortedTasks.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTasks.map((task) => (
            <li
              key={task.id}
              className={`py-4 ${task.completed ? "opacity-60" : ""}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : task.priority === "high"
                        ? "border-red-500"
                        : task.priority === "medium"
                        ? "border-yellow-500"
                        : "border-green-500"
                    }`}>
                    {task.completed && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="ml-3 flex-grow">
                  <p
                    className={`text-gray-800 dark:text-gray-200 ${
                      task.completed ? "line-through" : ""
                    }`}>
                    {task.text}
                  </p>
                  <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 mt-1 gap-2">
                    <span>Phase: {phases[task.phaseId].name}</span>
                    <span
                      className={`badge ${getCategoryBadgeClass(
                        task.category
                      )}`}>
                      {task.category}
                    </span>
                    <span
                      className={`badge ${getPriorityBadgeClass(
                        task.priority
                      )}`}>
                      {task.priority}
                    </span>
                    {task.dueDate ? (
                      <span
                        className={`badge ${
                          isOverdue(task.dueDate)
                            ? "badge-red"
                            : isDueSoon(task.dueDate)
                            ? "badge-yellow"
                            : "badge-blue"
                        }`}>
                        Due: {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      showEstimatedDates && (
                        <span className="badge badge-gray">
                          Est: {formatDate(getEstimatedDate(task.phaseId))}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-shrink-0 flex items-start space-x-2">
                  {!task.completed && (
                    <>
                      {editingTaskId === task.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={editTaskDueDate}
                            onChange={(e) => setEditTaskDueDate(e.target.value)}
                            className="text-xs p-1 border rounded"
                          />
                          <button
                            onClick={() => handleSaveTaskDate(task)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
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
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No tasks found with the current filters.
        </p>
      )}
    </div>
  );
}
