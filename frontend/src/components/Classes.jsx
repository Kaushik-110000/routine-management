import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classservice from "../backend/class.config.js";
import { Link, useNavigate } from "react-router-dom";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLectureHall, setNewLectureHall] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  // Fetch all classes from the backend
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await classservice.getAllClasses();
      setClasses(res.data.message);
      // console.log(res.data.message)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Empty click handler for each class item
  const handleClassClick = (id) => () => {};

  // Show add class modal
  const handleAddClick = () => {
    setNewLectureHall("");
    setShowModal(true);
  };

  // Submit new class to backend
  const handleAddSubmit = async () => {
    try {
      await classservice.addClass({ lectureHall: newLectureHall });
      await fetchClasses();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete class by ID
  const handleDelete = async (id) => {
    try {
      await classservice.deleteClass(id);
      await fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Classes</h1>

      {loading ? (
        <p>Loading classes...</p>
      ) : (
        classes.length > 0 &&
        classes.map((c) => (
          <div
            key={c._id}
            onClick={() => navigate(`/allDays/${c._id}`)}
            className="flex justify-between items-center p-2 border-b"
          >
            <span
              onClick={handleClassClick(c._id)}
              className="cursor-pointer text-blue-600"
            >
              {c.lectureHall}
            </span>

            {isLoggedIn && (
              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}

      {isLoggedIn && (
        <button
          onClick={handleAddClick}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Class
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Add Class</h2>
            <input
              type="text"
              value={newLectureHall}
              onChange={(e) => setNewLectureHall(e.target.value)}
              placeholder="Lecture Hall (e.g. LHC - XXX)"
              className="border p-2 w-full rounded mb-4"
            />
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
