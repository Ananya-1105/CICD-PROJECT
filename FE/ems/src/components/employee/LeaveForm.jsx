// src/components/LeaveForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://34.204.199.101:8080/api/leaves";

  // Fetch employee leaves
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token"); // JWT stored in localStorage
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(response.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("Unable to fetch leaves. Please try again.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const leaveData = { startDate, endDate, reason };

      const response = await axios.post(API_URL, leaveData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaves([...leaves, response.data]);
      setMessage("Leave submitted successfully!");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      console.error("Error submitting leave:", err);
      setError("Failed to submit leave. Try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Apply for Leave</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Leave
        </button>
      </form>

      {/* Display past leave requests */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">My Leaves</h3>
        {leaves.length === 0 ? (
          <p>No leave requests yet.</p>
        ) : (
          <ul className="space-y-2">
            {leaves.map((leave) => (
              <li
                key={leave.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <span>
                  {leave.startDate} to {leave.endDate} - {leave.reason}
                </span>
                <span
                  className={`font-semibold ${
                    leave.status === "APPROVED"
                      ? "text-green-600"
                      : leave.status === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {leave.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeaveForm;
