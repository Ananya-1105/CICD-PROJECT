// src/components/EmployeeAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeAttendance = ({ authToken }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://98.94.241.163:8080/api/attendance/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to load attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Attendance</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((att) => (
            <tr key={att.id}>
              <td className="border px-4 py-2">{new Date(att.date).toLocaleDateString()}</td>
              <td
                className={`border px-4 py-2 font-bold ${
                  att.present ? "text-green-600" : "text-red-600"
                }`}
              >
                {att.present ? "Present" : "Absent"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAttendance;
