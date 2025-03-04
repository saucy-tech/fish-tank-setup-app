// Tank Setup Timeline Data
export const startDate = new Date("2025-03-01T00:00:00");

export interface WaterReading {
  date: Date;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  ph: number;
  temperature: number;
  notes?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  phaseId: number;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
}

export interface Phase {
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  expectedReadings: {
    ammonia: string;
    nitrite: string;
    nitrate: string;
  };
  tasks: string[];
}

export const phases: Phase[] = [
  {
    name: "Initial Setup",
    description: "Setting up your tank and starting the cycling process",
    startDay: 0,
    endDay: 7,
    expectedReadings: {
      ammonia: "0-0.5 ppm",
      nitrite: "0 ppm",
      nitrate: "0 ppm",
    },
    tasks: [
      "Set up tank and equipment",
      "Add substrate and decorations",
      "Fill tank with water",
      "Add water conditioner",
      "Start filter",
      "Add ammonia source",
    ],
  },
  {
    name: "Ammonia Phase",
    description: "Bacteria begin converting ammonia to nitrite",
    startDay: 7,
    endDay: 14,
    expectedReadings: {
      ammonia: "2-4 ppm",
      nitrite: "0-0.5 ppm",
      nitrate: "0 ppm",
    },
    tasks: [
      "Test water parameters daily",
      "Maintain ammonia levels",
      "Check filter function",
      "Monitor water temperature",
    ],
  },
  {
    name: "Nitrite Phase",
    description: "Bacteria begin converting nitrite to nitrate",
    startDay: 14,
    endDay: 28,
    expectedReadings: {
      ammonia: "0-0.5 ppm",
      nitrite: "2-5 ppm",
      nitrate: "0-20 ppm",
    },
    tasks: [
      "Continue daily testing",
      "Monitor nitrite levels",
      "Check for algae growth",
      "Maintain water temperature",
    ],
  },
  {
    name: "Nitrate Phase",
    description: "Final phase of the cycling process",
    startDay: 28,
    endDay: 42,
    expectedReadings: {
      ammonia: "0 ppm",
      nitrite: "0 ppm",
      nitrate: "5-40 ppm",
    },
    tasks: [
      "Daily parameter testing",
      "Monitor nitrate levels",
      "Prepare for water change",
      "Plan fish additions",
    ],
  },
  {
    name: "Completion",
    description: "Tank is ready for fish",
    startDay: 42,
    endDay: 42,
    expectedReadings: {
      ammonia: "0 ppm",
      nitrite: "0 ppm",
      nitrate: "5-40 ppm",
    },
    tasks: [
      "Perform large water change",
      "Final parameter check",
      "Add first fish",
      "Monitor fish behavior",
    ],
  },
];

// Sample initial reading
export const initialReadings: WaterReading[] = [
  {
    date: new Date("2025-03-01T18:30:00"),
    ammonia: 0,
    nitrite: 0,
    nitrate: 0,
    ph: 7.2,
    temperature: 78,
    notes: "Initial setup complete. Water clear.",
  },
];
