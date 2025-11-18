import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../admin/AdminNavbar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://98.94.241.163:8080/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Compute chart data based on employees
  const deptCount = {};
  const deptSalary = {};
  employees.forEach((emp) => {
    const dept = emp.department?.name || "Unassigned";
    deptCount[dept] = (deptCount[dept] || 0) + 1;
    deptSalary[dept] = (deptSalary[dept] || []).concat(emp.salary || 0);
  });
  const avgDeptSalary = {};
  Object.keys(deptSalary).forEach((d) => {
    const arr = deptSalary[d];
    avgDeptSalary[d] = arr.reduce((a, b) => a + b, 0) / arr.length;
  });

  const deptCountData = {
    labels: Object.keys(deptCount),
    datasets: [
      {
        label: "Employees by Department",
        data: Object.values(deptCount),
        backgroundColor: ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
      },
    ],
  };

  const deptSalaryData = {
    labels: Object.keys(avgDeptSalary),
    datasets: [
      {
        label: "Avg Salary by Department",
        data: Object.values(avgDeptSalary),
        backgroundColor: "#10B981",
      },
    ],
  };

  // Handle edit
  const startEdit = (emp) => {
    setEditId(emp.id);
    setEditData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      position: emp.position,
      salary: emp.salary,
      hireDate: emp.hireDate,
      departmentId: emp.department?.id || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://98.94.241.163:8080/api/employees/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
      cancelEdit();
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Failed to save changes.");
    }
  };

  // Handle delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://98.94.241.163:8080/api/employees/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Employees</h1>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2 text-center">Employees by Department</h3>
            <Pie data={deptCountData} />
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2 text-center">Avg Salary by Department</h3>
            <Bar data={deptSalaryData} />
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-left">
              <thead className="bg-gray-100">
                <tr>
                  {["Name", "Email", "Phone", "Position", "Salary", "Department", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-3 py-2 text-gray-700"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <React.Fragment key={emp.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{emp.email}</td>
                      <td className="border border-gray-300 px-3 py-2">{emp.phone}</td>
                      <td className="border border-gray-300 px-3 py-2">{emp.position}</td>
                      <td
                        className={`border border-gray-300 px-3 py-2 ${
                          emp.salary > 50000 ? "text-green-600 font-semibold" : ""
                        }`}
                      >
                        {emp.salary}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {emp.department?.name || "Unassigned"}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 space-x-2">
                        <button
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                          onClick={() => startEdit(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                          onClick={() => setDeleteId(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {/* Inline Edit Row */}
                    {editId === emp.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="p-4 border border-gray-300">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="First Name"
                              value={editData.firstName}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, firstName: e.target.value }))
                              }
                            />
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Last Name"
                              value={editData.lastName}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, lastName: e.target.value }))
                              }
                            />
                            <input
                              type="email"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Email"
                              value={editData.email}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, email: e.target.value }))
                              }
                            />
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Phone"
                              value={editData.phone}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, phone: e.target.value }))
                              }
                            />
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Position"
                              value={editData.position}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, position: e.target.value }))
                              }
                            />
                            <input
                              type="number"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Salary"
                              value={editData.salary}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, salary: e.target.value }))
                              }
                            />
                            <input
                              type="date"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Hire Date"
                              value={editData.hireDate}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, hireDate: e.target.value }))
                              }
                            />
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              placeholder="Department"
                              value={editData.departmentId}
                              onChange={(e) =>
                                setEditData((prev) => ({ ...prev, departmentId: e.target.value }))
                              }
                            />
                            <div className="flex gap-2 md:col-span-4 justify-end mt-2">
                              <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                                onClick={() => saveEdit(emp.id)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEmployees;
