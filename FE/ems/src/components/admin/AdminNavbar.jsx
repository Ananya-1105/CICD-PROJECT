import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";
import { FaCogs } from "react-icons/fa";

export const NAV_HEIGHT = 64; // slightly taller for better spacing

export default function AdminNavbar({ darkMode, toggleTheme }) {
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-all duration-300";

  const links = [
    { to: "/", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
    { to: "/profile", label: "Profile", icon: <UserCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] border-b shadow-md ${
        darkMode
          ? "bg-gray-900/95 text-gray-200 border-gray-700"
          : "bg-white/90 text-gray-800 border-gray-200"
      } backdrop-blur-md`}
      style={{ height: NAV_HEIGHT }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-full">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <FaCogs className="h-6 w-6 text-purple-400" />
          <h1 className="text-lg font-semibold tracking-wide text-purple-300">
            NextGen Workforce
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 h-full">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${linkBase} ${
                darkMode
                  ? "hover:bg-gray-800 hover:text-white"
                  : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`${linkBase} ${
              darkMode ? "hover:bg-purple-700" : "hover:bg-purple-100"
            }`}
            title="Toggle Theme"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`${linkBase} ${
              darkMode
                ? "hover:bg-red-600 hover:text-white"
                : "hover:bg-red-500 hover:text-white"
            }`}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
