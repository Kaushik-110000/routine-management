import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AllDays() {
  const { classID } = useParams();
  const navigate = useNavigate();
  // Empty click handler stub for each day
  const handleDayClick = (day) => {
    // TODO: implement action when a day is clicked
    navigate(`/classes/${classID}/schedule/${day}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Schedule for the Class</h1>
      <div className="grid grid-cols-2 gap-4">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-400"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
