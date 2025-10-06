import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import EmployeeCharts from "../employee/EmployeeCharts";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [recentHires, setRecentHires] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState({
    deptCount: {},
    positionCount: {},
    deptSalary: {},
    positionSalary: {},
  });
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    position: "",
    salary: "",
    hireDate: "",
    departmentId: "",
  });

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch recent hires (last 5 by hireDate)
  const fetchRecentHires = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/recent"
      );
      setRecentHires(response.data);
    } catch (error) {
      console.error("Error fetching recent hires:", error);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/departments");
      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch analytics from backend
  const fetchAnalytics = async () => {
    try {
      const [deptCountRes, positionCountRes, deptSalaryRes, positionSalaryRes] =
        await Promise.all([
          axios.get("http://localhost:8080/api/employees/department-count"),
          axios.get("http://localhost:8080/api/employees/position-count"),
          axios.get("http://localhost:8080/api/employees/salary-department"),
          axios.get("http://localhost:8080/api/employees/salary-position"),
        ]);

      setAnalytics({
        deptCount: deptCountRes.data,
        positionCount: positionCountRes.data,
        deptSalary: deptSalaryRes.data,
        positionSalary: positionSalaryRes.data,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRecentHires();
    fetchDepartments();
    fetchAnalytics();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEmployee,
        salary: newEmployee.salary ? parseFloat(newEmployee.salary) : null,
        departmentId: newEmployee.departmentId
          ? parseInt(newEmployee.departmentId)
          : null,
      };

      await axios.post("http://localhost:8080/api/employees", payload);

      alert("Employee added successfully!");
      setShowModal(false);

      setNewEmployee({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        position: "",
        salary: "",
        hireDate: "",
        departmentId: "",
      });

      // Refresh all data
      fetchEmployees();
      fetchRecentHires();
      fetchAnalytics();
    } catch (error) {
      console.error("Error saving employee:", error.response || error);
      alert("Failed to add employee. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Manage Employees
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="mb-6 px-5 py-3 bg-indigo-600 text-white font-semibold rounded shadow hover:bg-indigo-500 transition"
        >
          Add Employee
        </button>

        {/* Employees Table */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Employees Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "ID",
                    "First Name",
                    "Last Name",
                    "Email",
                    "Phone",
                    "Position",
                    "Salary",
                    "Hire Date",
                    "Department",
                  ].map((header) => (
                    <th
                      key={header}
                      className="border border-gray-300 px-3 py-2 text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
                    <td className="border border-gray-300 px-2 py-1">{emp.firstName}</td>
                    <td className="border border-gray-300 px-2 py-1">{emp.lastName}</td>
                    <td className="border border-gray-300 px-2 py-1">{emp.email}</td>
                    <td className="border border-gray-300 px-2 py-1">{emp.phone}</td>
                    <td className="border border-gray-300 px-2 py-1">{emp.position}</td>
                    <td
                      className={`border border-gray-300 px-2 py-1 ${
                        emp.salary > 50000 ? "text-green-600 font-bold" : ""
                      }`}
                    >
                      {emp.salary}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{emp.hireDate}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {emp.departmentName || "Unassigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Hires Table */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Hires</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  {["Name", "Position", "Hire Date", "Department"].map((header) => (
                    <th
                      key={header}
                      className="border border-gray-300 px-3 py-2 text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentHires.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{emp.position}</td>
                    <td className="border border-gray-300 px-2 py-1">{emp.hireDate}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {emp.departmentName || "Unassigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Employee Analytics</h2>
          <EmployeeCharts analytics={analytics} />
        </div>

        {/* Add Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Employee</h2>
              <form
                onSubmit={handleAddEmployee}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {[
                  { name: "firstName", placeholder: "First Name", required: true },
                  { name: "lastName", placeholder: "Last Name", required: true },
                  { name: "email", placeholder: "Email", type: "email", required: true },
                  { name: "phone", placeholder: "Phone" },
                  { name: "position", placeholder: "Position" },
                  { name: "salary", placeholder: "Salary", type: "number" },
                  { name: "hireDate", placeholder: "Hire Date", type: "date" },
                ].map((field) => (
                  <input
                    key={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={newEmployee[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={field.required || false}
                    className="border px-3 py-2 rounded w-full"
                  />
                ))}

                {/* Department Dropdown */}
                <select
                  name="departmentId"
                  value={newEmployee.departmentId}
                  onChange={handleInputChange}
                  required
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                <div className="col-span-full flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEmployees;
