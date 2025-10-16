import React, { useState } from "react";
import EmployeeAttendance from "../employee/EmployeeAttendance";
import LeaveRequestForm from "../employee/LeaveForm";

const EmployeeDashboard = () => {
  const [activeCard, setActiveCard] = useState(""); // "leave" or "attendance"
  const token = localStorage.getItem("token");

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Employee Dashboard
      </h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setActiveCard("leave")}
        >
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Leave Request
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Submit your leave request and track its status.
          </p>
        </div>

        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setActiveCard("attendance")}
        >
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Check Attendance
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            View your attendance records.
          </p>
        </div>
      </div>

      {/* Render Selected Component */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        {activeCard === "leave" && <LeaveRequestForm authToken={token} />}
        {activeCard === "attendance" && <EmployeeAttendance authToken={token} />}
        {!activeCard && (
          <p className="text-gray-500 dark:text-gray-400">
            Please select an option above to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
