import { differenceInDays, addDays, format } from "date-fns";
import { startDate, phases, Phase } from "../data/tankSetupData";

// Calculate days since tank setup started
export const getDaysSinceStart = (): number => {
  const today = new Date();
  return differenceInDays(today, startDate);
};

// Get the current phase based on days since start
export const getCurrentPhase = (): Phase | null => {
  const daysSinceStart = getDaysSinceStart();

  for (const phase of phases) {
    if (daysSinceStart >= phase.startDay && daysSinceStart <= phase.endDay) {
      return phase;
    }
  }

  // If we're past all phases, return the last one
  if (daysSinceStart > phases[phases.length - 1].endDay) {
    return phases[phases.length - 1];
  }

  return null;
};

// Calculate the expected completion date for a phase
export const getPhaseEndDate = (phase: Phase): Date => {
  return addDays(startDate, phase.endDay);
};

// Format a date for display
export const formatDate = (date: Date): string => {
  return format(date, "MMMM d, yyyy");
};

// Calculate progress percentage within current phase
export const getPhaseProgress = (phase: Phase): number => {
  const daysSinceStart = getDaysSinceStart();
  const phaseDuration = phase.endDay - phase.startDay;
  const daysIntoPhase = daysSinceStart - phase.startDay;

  const progress = (daysIntoPhase / phaseDuration) * 100;
  return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
};

// Calculate overall progress percentage
export const getOverallProgress = (): number => {
  const daysSinceStart = getDaysSinceStart();
  const totalDuration = phases[phases.length - 1].endDay;

  const progress = (daysSinceStart / totalDuration) * 100;
  return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
};
