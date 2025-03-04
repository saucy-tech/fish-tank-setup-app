"use client";

import React, { useState } from "react";
import { useTank } from "../data/TankContext";
import { useTheme } from "../data/ThemeContext";
import { WaterReading } from "../data/tankSetupData";

export default function AddReadingForm() {
  const { addReading } = useTank();
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<WaterReading, "date">>({
    ammonia: 0,
    nitrite: 0,
    nitrate: 0,
    ph: 7.0,
    temperature: 78,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convert numeric values
    if (
      name === "ammonia" ||
      name === "nitrite" ||
      name === "nitrate" ||
      name === "ph" ||
      name === "temperature"
    ) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new reading with current date
    const newReading: WaterReading = {
      ...formData,
      date: new Date(),
    };

    // Add the reading
    addReading(newReading);

    // Reset form and close
    setFormData({
      ammonia: 0,
      nitrite: 0,
      nitrate: 0,
      ph: 7.0,
      temperature: 78,
      notes: "",
    });
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary w-full py-3 px-4">
          Add New Reading
        </button>
      ) : (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-header mb-0">Add New Reading</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="ammonia">
                  Ammonia (ppm)
                </label>
                <input
                  id="ammonia"
                  name="ammonia"
                  type="number"
                  step="0.1"
                  min="0"
                  max="8"
                  value={formData.ammonia}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="nitrite">
                  Nitrite (ppm)
                </label>
                <input
                  id="nitrite"
                  name="nitrite"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.nitrite}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="nitrate">
                  Nitrate (ppm)
                </label>
                <input
                  id="nitrate"
                  name="nitrate"
                  type="number"
                  step="1"
                  min="0"
                  max="160"
                  value={formData.nitrate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="ph">
                  pH
                </label>
                <input
                  id="ph"
                  name="ph"
                  type="number"
                  step="0.1"
                  min="6.0"
                  max="8.0"
                  value={formData.ph}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="temperature">
                  Temperature (°F)
                </label>
                <input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="65"
                  max="85"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                Save Reading
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
