// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

import {
  Users,
  Briefcase,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const bgColor = darkMode
    ? "bg-gradient-to-br from-gray-950 to-gray-900"
    : "bg-gray-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const cardBg = darkMode
    ? "bg-white/10 backdrop-blur-sm border border-white/20"
    : "bg-white border border-gray-200";
  const accentColor = "#7C3AED";

  // KPI widgets
  const kpis = [
    {
      label: "Total Employees",
      value: 128,
      trend: "+5%",
      trendIcon: <TrendingUp size={14} className="text-green-400" />,
    },
    {
      label: "HR Staff",
      value: 12,
      trend: "-1%",
      trendIcon: <TrendingDown size={14} className="text-red-400" />,
    },
    {
      label: "Reports",
      value: 34,
      trend: "+8%",
      trendIcon: <TrendingUp size={14} className="text-green-400" />,
    },
  ];

  // Dashboard cards
  const cards = [
    {
      title: "Manage Employees",
      desc: "Add, update, or remove employee records.",
      icon: <Users size={20} className="text-purple-400" />,
      route: "/admin/manageemployees",
    },
    {
      title: "Manage HR",
      desc: "Oversee HR operations and assignments.",
      icon: <Briefcase size={20} className="text-purple-400" />,
      route: "/admin/managehr",
    },
    {
      title: "System Settings",
      desc: "Configure system preferences and security.",
      icon: <Settings size={20} className="text-purple-400" />,
      route: "/admin/settings",
    },
    {
      title: "Reports & Analytics",
      desc: "View performance metrics and generate reports.",
      icon: <BarChart3 size={20} className="text-purple-400" />,
      route: "/admin/reports",
    },
  ];

  // Chart data
  const [barData, setBarData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Employee Growth",
        data: [120, 135, 150, 160, 170, 180],
        backgroundColor: accentColor,
        borderRadius: 6,
      },
    ],
  });

  const [lineData, setLineData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Project Completion %",
        data: [80, 85, 90, 92, 95, 98],
        borderColor: accentColor,
        backgroundColor: "transparent",
        tension: 0.4,
        pointBackgroundColor: accentColor,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  });

  const pieData = {
    labels: ["HR", "Engineering", "Sales", "Support"],
    datasets: [
      {
        data: [12, 50, 30, 18],
        backgroundColor: [accentColor, "#8B5CF6", "#6366F1", "#C4B5FD"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#E5E7EB" : "#374151",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "#A1A1AA" : "#6B7280" },
      },
      y: {
        ticks: { color: darkMode ? "#A1A1AA" : "#6B7280" },
      },
    },
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${bgColor} ${textColor} transition-colors duration-500`}
    >
      {/* Admin Navbar */}
      <AdminNavbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Dashboard Content */}
      <main className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full pt-24">
        {/* KPI Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              className={`p-6 ${cardBg} rounded-xl shadow-lg flex flex-col gap-2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">{kpi.label}</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {kpi.trendIcon}
                  <span>{kpi.trend}</span>
                </div>
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </motion.div>
          ))}
        </section>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {cards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => navigate(card.route)}
              className={`p-6 flex flex-col gap-2 ${cardBg} rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition cursor-pointer text-left`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                {card.icon}
                <span className="font-medium">{card.title}</span>
              </div>
              <p className="text-sm text-gray-400">{card.desc}</p>
            </motion.button>
          ))}
        </section>

        {/* Charts Section */}
        <section
          className={`p-6 ${cardBg} rounded-xl shadow-lg flex flex-col gap-6`}
        >
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="min-h-[250px]">
              <Bar data={barData} options={chartOptions} />
            </div>
            <div className="min-h-[250px]">
              <Line data={lineData} options={chartOptions} />
            </div>
            <div className="min-h-[250px]">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Footer */}
      <footer className="w-full py-4 bg-gray-900 text-gray-400 text-center text-sm border-t border-gray-800">
        © {new Date().getFullYear()} EMS Admin Panel. All rights reserved.
      </footer>
    </div>
  );
}
