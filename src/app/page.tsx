"use client";

import Dashboard from "./components/Dashboard";
import AddReadingForm from "./components/AddReadingForm";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Dashboard />
      <AddReadingForm />
    </div>
  );
}
