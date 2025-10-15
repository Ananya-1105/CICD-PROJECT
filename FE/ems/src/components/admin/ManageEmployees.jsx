import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState({ deptCount: {}, positionCount: {}, salaryDept: {} });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode((p) => !p);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    hireDate: "",
    departmentId: "",
  });

  // THEME CLASSES (same as ManageHR)
  const bgColor = darkMode
    ? "bg-gradient-to-br from-gray-950 to-gray-900"
    : "bg-gray-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const cardBg = darkMode
    ? "bg-white/10 backdrop-blur-sm border border-white/20"
    : "bg-white border border-gray-200";

  const inputStyle = darkMode
    ? "bg-white/10 border border-gray-500 text-gray-100 placeholder-gray-300"
    : "bg-white border border-gray-300 text-gray-800";

  // Fetch employees and departments
  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        axios.get("http://localhost:8080/api/employees"),
        axios.get("http://localhost:8080/api/departments"),
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchAnalytics = () => {
    const deptCount = {};
    const positionCount = {};
    const salaryDept = {};
    employees.forEach((e) => {
      const deptName = e.departmentName || "Unassigned";
      deptCount[deptName] = (deptCount[deptName] || 0) + 1;
      positionCount[e.position || "Unknown"] = (positionCount[e.position || "Unknown"] || 0) + 1;
      salaryDept[deptName] = (salaryDept[deptName] || []).concat(e.salary || 0);
    });
    const avgSalaryDept = {};
    for (const dept in salaryDept) {
      const arr = salaryDept[dept];
      avgSalaryDept[dept] = arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    setAnalytics({ deptCount, positionCount, salaryDept: avgSalaryDept });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewEmployee = async () => {
    try {
      await axios.post("http://localhost:8080/api/employees", {
        ...formData,
        salary: parseFloat(formData.salary),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        hireDate: formData.hireDate,
      });
      setShowAddModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        hireDate: "",
        departmentId: "",
      });
      fetchData();
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  const startEdit = (emp) => {
    setEditEmployeeId(emp.id);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      position: emp.position,
      salary: emp.salary,
      hireDate: emp.hireDate,
      departmentId: emp.department ? emp.department.id : "",
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/api/employees/${editEmployeeId}`, {
        ...formData,
        salary: parseFloat(formData.salary),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        hireDate: formData.hireDate,
      });
      setEditEmployeeId(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        hireDate: "",
        departmentId: "",
      });
      fetchData();
    } catch (err) {
      console.error("Error editing employee:", err);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/employees/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  // Charts
  const deptChartData = {
    labels: Object.keys(analytics.deptCount),
    datasets: [{ data: Object.values(analytics.deptCount), backgroundColor: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"] }],
  };
  const positionChartData = {
    labels: Object.keys(analytics.positionCount),
    datasets: [{ data: Object.values(analytics.positionCount), backgroundColor: ["#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8"] }],
  };
  const salaryChartData = {
    labels: Object.keys(analytics.salaryDept),
    datasets: [{ label: "Avg Salary", data: Object.values(analytics.salaryDept), backgroundColor: "#4ADE80" }],
  };

  // Summary stats
  const totalEmployees = employees.length;
  const totalDepartments = new Set(employees.map((e) => e.departmentName)).size;
  const totalPositions = new Set(employees.map((e) => e.position)).size;
  const avgSalary = employees.length
    ? (employees.reduce((sum, e) => sum + (e.salary || 0), 0) / employees.length).toFixed(2)
    : 0;

  return (
    <div className={`min-h-screen transition-all duration-300 ${bgColor} ${textColor} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Employees</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border border-gray-500 hover:bg-gray-700/20"
        >
          {darkMode ? <SunIcon className="w-5 h-5 text-yellow-300" /> : <MoonIcon className="w-5 h-5 text-gray-800" />}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          ["Total Employees", totalEmployees],
          ["Departments", totalDepartments],
          ["Positions", totalPositions],
          ["Avg Salary", `$${avgSalary}`],
        ].map(([title, value]) => (
          <div key={title} className={`${cardBg} shadow rounded-lg p-4 text-center`}>
            <p className="text-sm opacity-75">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Employee Table */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button
          className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Add Employee
        </button>
      </div>

      <div className={`${cardBg} overflow-x-auto shadow rounded-lg mb-6`}>
        <table className="w-full border-collapse text-center text-sm">
          <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
            <tr>
              {["ID","First Name","Last Name","Email","Phone","Position","Salary","Hire Date","Department","Actions"].map((h) => (
                <th key={h} className="px-2 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className={darkMode ? "hover:bg-gray-800/30" : "hover:bg-gray-50"}>
                <td className="px-2 py-1">{emp.id}</td>
                {["firstName","lastName","email","phone","position","salary","hireDate"].map((f) => (
                  <td key={f} className="px-2 py-1">
                    {editEmployeeId === emp.id ? (
                      <input
                        name={f}
                        type={f === "salary" ? "number" : f === "hireDate" ? "date" : "text"}
                        value={formData[f]}
                        onChange={handleInputChange}
                        className={`${inputStyle} rounded px-1 py-0.5 w-full`}
                      />
                    ) : (
                      emp[f]
                    )}
                  </td>
                ))}
                <td className="px-2 py-1">
                  {editEmployeeId === emp.id ? (
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      className={`${inputStyle} rounded px-1 py-0.5 w-full`}
                    >
                      <option value="">Unassigned</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    emp.departmentName || "Unassigned"
                  )}
                </td>
                <td className="px-2 py-1 flex justify-center gap-2">
                  {editEmployeeId === emp.id ? (
                    <>
                      <button onClick={saveEdit} className="text-green-500">Save</button>
                      <button onClick={() => setEditEmployeeId(null)} className="text-gray-400">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(emp)} className="text-blue-500">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteEmployee(emp.id)} className="text-red-500">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${cardBg} p-3 rounded`}>
          <h3 className="font-semibold mb-2 text-center">Employees by Department</h3>
          <Pie data={deptChartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
        <div className={`${cardBg} p-3 rounded`}>
          <h3 className="font-semibold mb-2 text-center">Employees by Position</h3>
          <Pie data={positionChartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
        <div className={`${cardBg} p-3 rounded`}>
          <h3 className="font-semibold mb-2 text-center">Average Salary by Department</h3>
          <Bar data={salaryChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className={`${cardBg} rounded-lg p-6 w-96`}>
            <h3 className="text-lg font-semibold mb-4">Add Employee</h3>
            {["firstName","lastName","email","phone","position","salary","hireDate"].map((field) => (
              <input
                key={field}
                type={field === "salary" ? "number" : field === "hireDate" ? "date" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={`${inputStyle} rounded px-2 py-1 mb-2 w-full`}
              />
            ))}
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className={`${inputStyle} rounded px-2 py-1 mb-2 w-full`}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveNewEmployee}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;
