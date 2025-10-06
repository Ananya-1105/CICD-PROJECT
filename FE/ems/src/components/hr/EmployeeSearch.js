import React, { useState } from "react";

export default function EmployeeSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const employees = [
    { name: "Alice Johnson", role: "HR Manager", department: "Human Resources" },
    { name: "Bob Smith", role: "Software Engineer", department: "Engineering" },
    { name: "Carol Lee", role: "Marketing Specialist", department: "Marketing" },
    { name: "David Kim", role: "Finance Analyst", department: "Finance" },
    { name: "Eva Brown", role: "Recruiter", department: "Human Resources" },
    { name: "Frank White", role: "Sales Executive", department: "Sales" },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Employee Directory</h2>
      <input
        type="text"
        placeholder="Search by name, role, or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded w-full mb-6"
      />
      {filteredEmployees.length > 0 ? (
        <ul className="space-y-4">
          {filteredEmployees.map((emp, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>Role:</strong> {emp.role}</p>
              <p><strong>Department:</strong> {emp.department}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No matching employees found.</p>
      )}
    </div>
  );
}
