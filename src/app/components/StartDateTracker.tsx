"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../data/ThemeContext";
import { format, differenceInDays } from "date-fns";

export default function StartDateTracker() {
  const { darkMode } = useTheme();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState<string>("");

  useEffect(() => {
    // Load start date from localStorage
    const savedDate = localStorage.getItem("tankStartDate");
    if (savedDate) {
      setStartDate(new Date(savedDate));
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempDate) {
      const newDate = new Date(tempDate);
      setStartDate(newDate);
      localStorage.setItem("tankStartDate", newDate.toISOString());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (startDate) {
      setTempDate(format(startDate, "yyyy-MM-dd"));
    }
  };

  if (!startDate) {
    return (
      <div className="card p-6 mb-6">
        <h2 className="card-header mb-4">Welcome to Your Fish Tank Journey!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Let's start by setting up your tank cycling timeline. When did you
          start cycling your tank?
        </p>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="date"
            value={tempDate}
            onChange={handleDateChange}
            className="input-field flex-grow"
            required
          />
          <button type="submit" className="btn-primary">
            Set Start Date
          </button>
        </form>
      </div>
    );
  }

  const daysElapsed = differenceInDays(new Date(), startDate);

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-r from-blue-800 to-blue-900"
          : "bg-gradient-to-r from-blue-600 to-blue-800"
      } rounded-xl p-6 shadow-md mb-6 text-white`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tank Cycling Progress</h2>
          <p className="text-blue-100">
            Started on {format(startDate, "MMMM d, yyyy")}
          </p>
        </div>
        <button
          onClick={handleEdit}
          className="text-blue-100 hover:text-white text-sm">
          Edit Date
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="date"
            value={tempDate}
            onChange={handleDateChange}
            className="input-field flex-grow bg-white/10 border-white/20 text-white"
            required
          />
          <button
            type="submit"
            className="btn-primary bg-white/20 hover:bg-white/30">
            Update
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn-secondary bg-white/10 hover:bg-white/20">
            Cancel
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold">{daysElapsed}</div>
            <div className="text-blue-100 text-sm">Days Since Start</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold">
              {Math.floor(daysElapsed / 7)}w {daysElapsed % 7}d
            </div>
            <div className="text-blue-100 text-sm">Time Elapsed</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold">
              {Math.round((daysElapsed / 30) * 10) / 10}
            </div>
            <div className="text-blue-100 text-sm">Months Elapsed</div>
          </div>
        </div>
      )}
    </div>
  );
}
