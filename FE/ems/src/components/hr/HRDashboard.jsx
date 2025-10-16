import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const HrDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080/api/hrs";
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, leaveRes, attRes] = await Promise.all([
        axios.get(`${BASE_URL}/employees`, axiosConfig),
        axios.get(`${BASE_URL}/leaves`, axiosConfig),
        axios.get(`${BASE_URL}/attendance`, axiosConfig),
      ]);
      setEmployees(empRes.data || []);
      setLeaves(leaveRes.data || []);
      setAttendance(attRes.data || []);
    } catch (error) {
      console.error("Error loading HR dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Leave Management --------------------
  const handleLeaveStatus = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/leaves/${id}/status?status=${status}`, null, axiosConfig);
      setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

  // -------------------- Attendance --------------------
  const handleMarkAttendance = async (empId, present) => {
    try {
      await axios.post(
        `${BASE_URL}/attendance/${empId}?present=${present}`,
        null,
        axiosConfig
      );
      // Refresh attendance table after marking
      const attRes = await axios.get(`${BASE_URL}/attendance`, axiosConfig);
      setAttendance(attRes.data);
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  // -------------------- Helpers --------------------
  const isAttendanceMarked = (empId) => {
    return attendance.some(
      (a) =>
        a.employee?.id === empId &&
        new Date(a.date).toDateString() === new Date().toDateString()
    );
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        HR Dashboard
      </h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-gray-500 dark:text-gray-300">Total Employees</h2>
          <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-gray-500 dark:text-gray-300">Leave Requests</h2>
          <p className="text-2xl font-bold text-yellow-500">{leaves.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-gray-500 dark:text-gray-300">Attendance Records</h2>
          <p className="text-2xl font-bold text-green-500">{attendance.length}</p>
        </div>
      </div>

      {/* Employees Table with Mark Attendance */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Employee List
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th className="p-2">Name</th>
              <th className="p-2">Department</th>
              <th className="p-2">Position</th>
              <th className="p-2">Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-2">{e.firstName} {e.lastName}</td>
                <td className="p-2">{e.departmentName}</td>
                <td className="p-2">{e.position}</td>
                <td className="p-2 flex gap-2">
                  {!isAttendanceMarked(e.id) ? (
                    <>
                      <button
                        onClick={() => handleMarkAttendance(e.id, true)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(e.id, false)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Absent
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 font-semibold">Marked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Management Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Leave Requests
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th className="p-2">Employee</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-2">{l.employee?.firstName} {l.employee?.lastName}</td>
                <td className="p-2">{l.reason}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2 flex gap-2 justify-center">
                  {(!l.status || l.status === "PENDING") ? (
                    <>
                      <button
                        onClick={() => handleLeaveStatus(l.id, "APPROVED")}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleLeaveStatus(l.id, "REJECTED")}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 font-semibold">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Attendance Records
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <th className="p-2">Employee</th>
              <th className="p-2">Date</th>
              <th className="p-2">Present</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-2">{a.employee?.firstName} {a.employee?.lastName}</td>
                <td className="p-2">{new Date(a.date).toLocaleDateString()}</td>
                <td className="p-2">
                  {a.present ? (
                    <span className="text-green-500 font-semibold">Present</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Absent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrDashboard;
