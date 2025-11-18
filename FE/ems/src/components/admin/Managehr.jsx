// src/pages/ManageHR.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = "http://localhost:8080/api/hrs";

export default function ManageHR() {
  const [hrs, setHrs] = useState([]);
  const [analytics, setAnalytics] = useState({ deptCount: {} });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // THEME CLASSES
  const bgColor = darkMode
    ? "bg-gradient-to-br from-gray-950 to-gray-900"
    : "bg-gray-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const cardBg = darkMode
    ? "bg-white/10 backdrop-blur-sm border border-white/20"
    : "bg-white border border-gray-200";

  // Fetch HRs
  const fetchHrs = async () => {
    try {
      const res = await axios.get(API_BASE);
      setHrs(res.data || []);
    } catch (err) {
      console.error("Error fetching HRs:", err);
    }
  };

  useEffect(() => {
    fetchHrs();
  }, []);

  // Compute analytics
  useEffect(() => {
    const deptCount = {};
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

  // ✅ Working Create HR
  const createHr = async () => {
    if (!form.name?.trim() || !form.email?.trim() || !form.password) {
      alert("Name, email and password are required.");
      return;
    }
    try {
      await axios.post(API_BASE, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setShowAddModal(false);
      setForm({ name: "", email: "", password: "" });
      fetchHrs();
    } catch (err) {
      console.error("Error creating HR:", err);
      alert("Failed to create HR - check console for details.");
    }
  };

  const startEdit = (hr) => {
    setEditId(hr.id);
    setForm({
      name: hr.name || "",
      email: hr.user?.username || "",
      password: "",
    });
  };

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

  // Chart
  const deptChartData = {
    labels: Object.keys(analytics.deptCount || {}),
    datasets: [
      {
        data: Object.values(analytics.deptCount || {}),
        backgroundColor: ["#7C3AED", "#A78BFA", "#C4B5FD", "#E9D5FF"],
      },
    ],
  };

  const totalHr = hrs.length;
  const totalWithEmail = hrs.filter((h) => h.user?.username).length;

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-500`}>
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 pt-24 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Manage HR</h1>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full border ${
            darkMode
              ? "border-white/30 hover:bg-white/10"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      <main className="px-6 pb-12 max-w-6xl mx-auto flex flex-col gap-8">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className={`p-4 rounded-xl shadow ${cardBg}`}>
            <p className="text-sm opacity-70">Total HRs</p>
            <p className="text-2xl font-semibold">{totalHr}</p>
          </div>
          <div className={`p-4 rounded-xl shadow ${cardBg}`}>
            <p className="text-sm opacity-70">With Email</p>
            <p className="text-2xl font-semibold">{totalWithEmail}</p>
          </div>
          <div className={`p-4 rounded-xl shadow ${cardBg}`}>
            <p className="text-sm opacity-70">Placeholder</p>
            <p className="text-2xl font-semibold">—</p>
          </div>
          <div className={`p-4 rounded-xl shadow ${cardBg}`}>
            <p className="text-sm opacity-70">Placeholder</p>
            <p className="text-2xl font-semibold">—</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">HR List</h2>
          <button
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Add HR
          </button>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto rounded-xl shadow ${cardBg}`}>
          <table className="w-full text-center border-collapse">
            <thead className={darkMode ? "bg-white/10" : "bg-gray-100"}>
              <tr>
                {["ID", "Name", "Email", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hrs.map((hr) => (
                <tr key={hr.id} className="border-t border-gray-600/20">
                  <td className="py-2">{hr.id}</td>
                  <td className="py-2">
                    {editId === hr.id ? (
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-2 py-1 rounded border"
                      />
                    ) : (
                      hr.name
                    )}
                  </td>
                  <td className="py-2">
                    {editId === hr.id ? (
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-2 py-1 rounded border"
                      />
                    ) : (
                      hr.user?.username || "—"
                    )}
                  </td>
                  <td className="py-2 flex justify-center gap-3">
                    {editId === hr.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="text-green-500 hover:text-green-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-400 hover:text-gray-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(hr)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteHr(hr.id)}
                          className="text-red-400 hover:text-red-300"
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
                  <td colSpan={4} className="py-6 opacity-70">
                    No HR records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <div className={`p-6 rounded-xl shadow ${cardBg}`}>
          <h2 className="text-lg font-semibold mb-4">HR Analytics</h2>
          <div className="max-w-xs mx-auto">
            <Pie data={deptChartData} />
          </div>
        </div>
      </main>

      {/* ✅ Add HR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={`p-6 rounded-xl shadow-lg ${cardBg} w-80`}>
            <h3 className="text-xl font-semibold mb-4 text-center">Add New HR</h3>
            <div className="flex flex-col gap-3">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="px-3 py-2 rounded border bg-transparent"
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="px-3 py-2 rounded border bg-transparent"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="px-3 py-2 rounded border bg-transparent"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                onClick={createHr}
                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
