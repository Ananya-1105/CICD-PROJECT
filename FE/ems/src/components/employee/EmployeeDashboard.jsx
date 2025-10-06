import React from "react";

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Employee Dashboard</h1>
      <ul className="space-y-4">
        <li className="bg-gray-800 p-4 rounded-lg">View Salary</li>
        <li className="bg-gray-800 p-4 rounded-lg">Attendance</li>
        <li className="bg-gray-800 p-4 rounded-lg">Assigned Tasks</li>
      </ul>
    </div>
  );
}
