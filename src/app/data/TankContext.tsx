"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WaterReading, initialReadings, Phase, phases } from "./tankSetupData";

// Define a Task interface
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  phaseId: number;
  isCustom: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  category: "maintenance" | "testing" | "equipment" | "other";
}

interface TankContextType {
  readings: WaterReading[];
  addReading: (reading: WaterReading) => void;
  deleteReading: (index: number) => void;
  updateReading: (index: number, reading: WaterReading) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Task) => void;
  getCurrentPhase: () => Phase | null;
}

// Helper function to get current phase based on days since start
const getCurrentPhaseIndex = (startDate: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  for (let i = 0; i < phases.length; i++) {
    if (diffDays >= phases[i].startDay && diffDays <= phases[i].endDay) {
      return i;
    }
  }

  // If past all phases, return the last phase
  return phases.length - 1;
};

const TankContext = createContext<TankContextType | undefined>(undefined);

export function TankProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with data from localStorage if available, otherwise use initialReadings
  const [readings, setReadings] = useState<WaterReading[]>(() => {
    if (typeof window !== "undefined") {
      const savedReadings = localStorage.getItem("tankReadings");
      if (savedReadings) {
        // Parse the saved readings and convert date strings back to Date objects
        const parsedReadings = JSON.parse(savedReadings);
        return parsedReadings.map(
          (reading: Omit<WaterReading, "date"> & { date: string }) => ({
            ...reading,
            date: new Date(reading.date),
          })
        );
      }
    }
    return initialReadings;
  });

  // Initialize tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tankTasks");
      if (savedTasks) {
        // Parse the saved tasks and convert date strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map(
          (
            task: Omit<Task, "date" | "dueDate"> & {
              date: string;
              dueDate?: string;
            }
          ) => ({
            ...task,
            date: new Date(task.date),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          })
        );
      }
    }

    // Generate initial tasks from the first phase
    return phases[0].tasks.map((text, index) => {
      // Assign different categories based on task content
      let category: "maintenance" | "testing" | "equipment" | "other" = "other";
      if (
        text.toLowerCase().includes("test") ||
        text.toLowerCase().includes("parameter")
      ) {
        category = "testing";
      } else if (
        text.toLowerCase().includes("filter") ||
        text.toLowerCase().includes("heater") ||
        text.toLowerCase().includes("equipment")
      ) {
        category = "equipment";
      } else if (
        text.toLowerCase().includes("water") ||
        text.toLowerCase().includes("clean")
      ) {
        category = "maintenance";
      }

      // Assign priority based on importance
      let priority: "low" | "medium" | "high" = "medium";
      if (
        text.toLowerCase().includes("check") ||
        text.toLowerCase().includes("monitor")
      ) {
        priority = "high";
      } else if (
        text.toLowerCase().includes("add") ||
        text.toLowerCase().includes("ensure")
      ) {
        priority = "medium";
      } else {
        priority = "low";
      }

      return {
        id: `initial-${index}`,
        text,
        completed: false,
        date: new Date(),
        phaseId: 0,
        isCustom: false,
        priority,
        category,
      };
    });
  });

  // Save readings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tankReadings", JSON.stringify(readings));
    }
  }, [readings]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tankTasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add a new reading
  const addReading = (reading: WaterReading) => {
    setReadings([...readings, reading]);
  };

  // Delete a reading
  const deleteReading = (index: number) => {
    const newReadings = [...readings];
    newReadings.splice(index, 1);
    setReadings(newReadings);
  };

  // Update a reading
  const updateReading = (index: number, reading: WaterReading) => {
    const newReadings = [...readings];
    newReadings[index] = reading;
    setReadings(newReadings);
  };

  // Add a new task
  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTasks([...tasks, newTask]);
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Update a task
  const updateTask = (id: string, updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  // Get current phase based on start date
  const getCurrentPhase = (): Phase | null => {
    if (readings.length === 0) return null;

    // Find the earliest reading date as the start date
    const startDate = readings.reduce(
      (earliest, reading) =>
        reading.date < earliest ? reading.date : earliest,
      readings[0].date
    );

    const phaseIndex = getCurrentPhaseIndex(startDate);
    return phases[phaseIndex];
  };

  return (
    <TankContext.Provider
      value={{
        readings,
        addReading,
        deleteReading,
        updateReading,
        tasks,
        addTask,
        toggleTaskCompletion,
        deleteTask,
        updateTask,
        getCurrentPhase,
      }}>
      {children}
    </TankContext.Provider>
  );
}

// Custom hook to use the tank context
export function useTank() {
  const context = useContext(TankContext);
  if (context === undefined) {
    throw new Error("useTank must be used within a TankProvider");
  }
  return context;
}
