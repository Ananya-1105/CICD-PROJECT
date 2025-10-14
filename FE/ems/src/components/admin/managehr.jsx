// src/pages/ManageHR.jsx
import React, { useEffect, useState } from "react";
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
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_BASE = "http://localhost:8080/api/hrs";

const ManageHR = () => {
  const [hrs, setHrs] = useState([]);
  const [analytics, setAnalytics] = useState({ deptCount: {}, roleCount: {}, salaryDept: {} }); // kept shape like employees for visual parity (you can remove unused)
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch all HRs
  const fetchHrs = async () => {
    try {
      const res = await axios.get(API_BASE);
      setHrs(res.data || []);
    } catch (err) {
      console.error("Error fetching HRs:", err);
      // optionally show user-facing error toast
    }
  };

  useEffect(() => {
    fetchHrs();
  }, []);

  // compute lightweight analytics (counts by presence of user / name)
  useEffect(() => {
    const deptCount = {}; // placeholder: backend doesn't expose department for Hr in your model
    hrs.forEach((h) => {
      const key = h.user?.username ? "Has Email" : "No Email";
      deptCount[key] = (deptCount[key] || 0) + 1;
    });
    setAnalytics({ deptCount });
  }, [hrs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Create
  const createHr = async () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password) {
      alert("Name, email and password are required.");
      return;
    }
    try {
      await axios.post(API_BASE, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password, // backend will encode
      });
      setShowAddModal(false);
      setForm({ name: "", email: "", password: "" });
      fetchHrs();
    } catch (err) {
      console.error("Error creating HR:", err);
      alert("Failed to create HR - check console for details.");
    }
  };

  // Start editing (prefill form)
  const startEdit = (hr) => {
    setEditId(hr.id);
    setForm({
      name: hr.name || "",
      email: hr.user?.username || "",
      password: "", // leave blank so password is optional on update
    });
    // scroll to table or focus if desired
  };

  // Save edit (PUT). Only send password if user typed one.
  const saveEdit = async () => {
    if (!form.name?.trim() || !form.email?.trim()) {
      alert("Name and email are required.");
      return;
    }
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
      };
      // include password only if provided
      if (form.password) payload.password = form.password;

      await axios.put(`${API_BASE}/${editId}`, payload);
      setEditId(null);
      setForm({ name: "", email: "", password: "" });
      fetchHrs();
    } catch (err) {
      console.error("Error updating HR:", err);
      alert("Failed to update HR - check console for details.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: "", email: "", password: "" });
  };

  const deleteHr = async (id) => {
    if (!window.confirm("Delete this HR record?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchHrs();
    } catch (err) {
      console.error("Error deleting HR:", err);
      alert("Failed to delete HR - check console for details.");
    }
  };

  // Chart data (simple)
  const deptChartData = {
    labels: Object.keys(analytics.deptCount || {}),
    datasets: [
      {
        data: Object.values(analytics.deptCount || {}),
        backgroundColor: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"],
      },
    ],
  };

  // Summary values
  const totalHr = hrs.length;
  const totalWithEmail = hrs.filter((h) => h.user?.username).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage HR</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Total HRs</p>
          <p className="text-2xl font-semibold">{totalHr}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">With Email</p>
          <p className="text-2xl font-semibold">{totalWithEmail}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">(Placeholder)</p>
          <p className="text-2xl font-semibold">—</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">(Placeholder)</p>
          <p className="text-2xl font-semibold">—</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">HR List</h2>
        <button
          className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Add HR
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg mb-6">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Name", "Email", "Actions"].map((h) => (
                <th key={h} className="border border-gray-300 px-2 py-1 text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hrs.map((hr) => (
              <tr key={hr.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{hr.id}</td>
                <td className="border px-2 py-1">
                  {editId === hr.id ? (
                    <input name="name" value={form.name} onChange={handleChange} className="border px-1 py-0.5 w-full" />
                  ) : (
                    hr.name
                  )}
                </td>
                <td className="border px-2 py-1">
                  {editId === hr.id ? (
                    <input name="email" value={form.email} onChange={handleChange} className="border px-1 py-0.5 w-full" />
                  ) : (
                    hr.user?.username || "—"
                  )}
                </td>
                <td className="border px-2 py-1 flex justify-center gap-2">
                  {editId === hr.id ? (
                    <>
                      <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(hr)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteHr(hr.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {hrs.length === 0 && (
              <tr>
                <td className="border px-2 py-6 text-gray-500" colSpan={4}>
                  No HR records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Charts (simple) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-3 shadow rounded">
          <h3 className="font-semibold mb-2 text-center">HR Email Presence</h3>
          <Pie data={deptChartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>

        <div className="bg-white p-3 shadow rounded">
          <h3 className="font-semibold mb-2 text-center">Placeholder</h3>
          <div className="text-center text-sm text-gray-500 py-8">Add more metrics as needed</div>
        </div>

        <div className="bg-white p-3 shadow rounded">
          <h3 className="font-semibold mb-2 text-center">Placeholder</h3>
          <div className="text-center text-sm text-gray-500 py-8">Add more metrics as needed</div>
        </div>
      </div>

      {/* Add HR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add HR</h3>

            <label className="block mb-2 text-sm">
              <span className="text-gray-600">Name</span>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded px-2 py-1" />
            </label>

            <label className="block mb-2 text-sm">
              <span className="text-gray-600">Email</span>
              <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 block w-full border rounded px-2 py-1" />
            </label>

            <label className="block mb-2 text-sm">
              <span className="text-gray-600">Password</span>
              <input name="password" value={form.password} onChange={handleChange} type="password" className="mt-1 block w-full border rounded px-2 py-1" />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowAddModal(false); setForm({ name: "", email: "", password: "" }); }} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={createHr} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Inline edit password field area: if user is editing, show password input below table */}
      {editId && (
        <div className="fixed bottom-6 right-6 bg-white shadow rounded p-4 w-full max-w-sm">
          <h4 className="font-medium mb-2">Update HR (optional password)</h4>
          <label className="block mb-2 text-sm">
            <span className="text-gray-600">Password (leave blank to keep current)</span>
            <input name="password" value={form.password} onChange={handleChange} type="password" className="mt-1 block w-full border rounded px-2 py-1" />
          </label>
          <div className="flex justify-end gap-2">
            <button onClick={cancelEdit} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
            <button onClick={saveEdit} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHR;
