import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import classservice from "../backend/class.config.js";

export default function ScheduleClasses() {
  const { classID, day } = useParams();
  const isLoggedIn = useSelector((state) => state.auth.status);

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    userName: "",
  });

  // Fetch schedule for this class/day
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await classservice.getSchedule(classID, day.toLowerCase());
      setSlots(res.data.message.schedule);
      //   console.log(res.);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [classID, day]);

  // Delete a slot by index
  const handleDelete = async (index) => {
    try {
      await classservice.deleteSchedule(classID, day.toLowerCase(), index);
      fetchSchedule();
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal
  const handleAddClick = () => {
    setFormData({ startTime: "", endTime: "", userName: "" });
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new slot
  const handleAddSubmit = async () => {
    const payload = { day: day.toLowerCase(), ...formData };
    try {
      await classservice.addSchedule(classID, payload);
      fetchSchedule();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Schedule for {day}</h1>

      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <div className="space-y-3">
          {slots.length === 0 && (
            <p className="text-gray-600">No slots scheduled.</p>
          )}
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                <p>
                  <strong>{slot.userName}</strong>
                </p>
                <p>
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
              {isLoggedIn && (
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isLoggedIn && (
        <button
          onClick={handleAddClick}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Slot
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Add Schedule Slot</h2>
            <label className="block mb-2">
              <span className="block text-sm font-medium text-gray-700">
                User Name
              </span>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded"
              />
            </label>
            <label className="block mb-2">
              <span className="block text-sm font-medium text-gray-700">
                Start Time
              </span>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded"
              />
            </label>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700">
                End Time
              </span>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
