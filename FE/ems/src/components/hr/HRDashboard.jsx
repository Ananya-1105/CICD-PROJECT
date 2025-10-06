import React, { useState } from "react";

import {
  UserPlusIcon,
  ClipboardDocumentCheckIcon,
  FolderOpenIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";

export default function HRDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTheme = () => setDarkMode(!darkMode);

  const sections = [
    {
      title: "Recruitment",
      icon: <UserPlusIcon className="h-6 w-6 text-indigo-400" />,
      desc: "Manage job postings, applications, and interviews.",
    },
    {
      title: "Performance Review",
      icon: <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-400" />,
      desc: "Track employee performance and feedback cycles.",
    },
    {
      title: "Employee Records",
      icon: <FolderOpenIcon className="h-6 w-6 text-indigo-400" />,
      desc: "Access and update employee information securely.",
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${darkMode ? "bg-gradient-to-br from-[#0a0f1c] to-[#111827] text-white" : "bg-gray-100 text-gray-800"} min-h-screen font-sans`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-6 gap-4">
        <h1 className="text-4xl font-bold">HR Dashboard</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-2 rounded-lg border outline-none w-full md:w-64 transition ${
              darkMode ? "bg-[#1f2a3c] border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <button
            onClick={toggleTheme}
            className="transition-transform duration-500 ease-in-out hover:scale-110"
          >
            <span
              className={`inline-block transform transition-all duration-500 ease-in-out ${
                darkMode ? "rotate-0 scale-100 opacity-100" : "rotate-180 scale-90 opacity-80"
              }`}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-indigo-600" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 pb-12">
        {filteredSections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSections.map((section, index) => (
              <div
                key={index}
                className={`${darkMode ? "bg-[#1f2a3c]/80 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"} p-6 rounded-xl border shadow-md hover:shadow-indigo-500/30 transition duration-300 hover:scale-[1.03] hover:border-indigo-500 transform ease-in-out`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {section.icon}
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">{section.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-12">No matching sections found.</p>
        )}
      </div>
    </div>
  );
}
