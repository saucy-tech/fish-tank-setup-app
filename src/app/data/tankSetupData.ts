// Tank Setup Timeline Data
export const startDate = new Date("2025-03-01T18:30:00");

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
    description: "Tank set up with equipment running",
    startDay: 0,
    endDay: 1,
    expectedReadings: {
      ammonia: "0 ppm",
      nitrite: "0 ppm",
      nitrate: "0 ppm",
    },
    tasks: [
      "Set up tank and equipment",
      "Fill with dechlorinated water",
      "Turn on filter and heater",
      "Check water temperature",
    ],
  },
  {
    name: "Starting the Cycle",
    description: "Begin adding ammonia source (fish food)",
    startDay: 1,
    endDay: 7,
    expectedReadings: {
      ammonia: "0.5-4 ppm",
      nitrite: "0 ppm",
      nitrate: "0 ppm",
    },
    tasks: [
      "Add ammonia source (fish food)",
      "Test water parameters daily",
      "Look for first ammonia readings",
      "Monitor water clarity",
    ],
  },
  {
    name: "Ammonia Processing Phase",
    description: "Watch for ammonia to peak then begin declining",
    startDay: 7,
    endDay: 21,
    expectedReadings: {
      ammonia: "Declining",
      nitrite: "Rising",
      nitrate: "0 ppm",
    },
    tasks: [
      "Continue testing water daily",
      "Watch for ammonia to peak and decline",
      "Look for nitrites to appear",
      "Maintain filter and equipment",
    ],
  },
  {
    name: "Nitrite Processing Phase",
    description: "Nitrites will rise then start declining",
    startDay: 21,
    endDay: 35,
    expectedReadings: {
      ammonia: "Near 0 ppm",
      nitrite: "Declining",
      nitrate: "Rising",
    },
    tasks: [
      "Monitor nitrite levels daily",
      "Watch for nitrites to peak and decline",
      "Check for nitrates appearing",
      "Ensure ammonia stays at 0",
    ],
  },
  {
    name: "Final Phase",
    description: "Looking for consistent 0 ammonia, 0 nitrite readings",
    startDay: 35,
    endDay: 49,
    expectedReadings: {
      ammonia: "0 ppm",
      nitrite: "0 ppm",
      nitrate: "10-40 ppm",
    },
    tasks: [
      "Confirm 0 ammonia readings",
      "Confirm 0 nitrite readings",
      "Check nitrate levels (10-40ppm)",
      "Plan for first fish addition",
    ],
  },
  {
    name: "Ready for Fish",
    description: "After confirming 0 ammonia and 0 nitrite for about a week",
    startDay: 49,
    endDay: 56,
    expectedReadings: {
      ammonia: "0 ppm",
      nitrite: "0 ppm",
      nitrate: "< 40 ppm",
    },
    tasks: [
      "Perform water change",
      "Add first few fish slowly",
      "Continue monitoring parameters",
      "Establish regular maintenance schedule",
    ],
  },
];

export interface WaterReading {
  date: Date;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  ph: number;
  temperature: number;
  notes: string;
}

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
