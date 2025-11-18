import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://98.94.241.163:8080/api/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        username: formData.username,
        password: formData.password,
      });

      // store token in localStorage
      localStorage.setItem("token", res.data.token);

      // get roles from backend
      const userRoles = res.data.roles || [];
      const userRole = userRoles.length > 0 ? userRoles[0] : null;

      // store role in localStorage for ProtectedRoute
      localStorage.setItem("userData", JSON.stringify({ role: userRole }));

      setMessage("✅ Login successful!");

      // redirect based on role
      if (userRole === "HR") {
        navigate("/hr");
      } else if (userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      setMessage("❌ Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920')",
          filter: "brightness(0.25) blur(2px)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12"
        >
          {/* Left Info Section */}
          <div className="flex-1 text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-purple-600/20 text-purple-300 text-sm font-medium px-3 py-1 rounded-full w-fit mb-4"
            >
              Welcome Back
            </motion.span>

            <h2 className="text-4xl font-bold leading-tight text-white">
              Log in to <span className="text-purple-400">NextGen Workforce</span>
            </h2>
            <p className="mt-3 text-gray-300 text-lg">
              Access your dashboard, manage your team, and boost productivity.
            </p>

            {/* Why Section */}
            <div className="mt-8 text-gray-300 space-y-4">
              <span className="font-semibold text-gray-200 text-lg">
                Why join us again?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Real-time workforce insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Seamless team collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Track goals & performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Secure & fast login</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 bg-gray-900/85 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username / Email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md font-semibold"
              >
                Log In
              </motion.button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm font-medium text-gray-300">
                {message}
              </p>
            )}

            {/* Register Redirect */}
            <p className="mt-4 text-center text-sm">
              <span className="text-gray-400">Don’t have an account? </span>
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-purple-400 hover:underline transition"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/90 py-6 px-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-800">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-purple-400">NextGen Workforce</span>. All rights
          reserved.
        </p>

        <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-sky-400 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}
