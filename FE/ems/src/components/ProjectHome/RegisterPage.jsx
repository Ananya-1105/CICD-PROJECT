import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaTwitter, FaUserPlus } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { AiOutlinePhone } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi";
import { BiDollarCircle } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://98.94.241.163:8080/api/auth";

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
    firstName: "",
    lastName: "",
    hireDate: "",
    phone: "",
    position: "",
    salary: "",
    departmentId: "",
  });

  const [message, setMessage] = useState("");
  const [bgIndex, setBgIndex] = useState(0);

  const backgroundImages = [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1920",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920",
  ];

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/register`, formData);
      setMessage("✅ Registration successful!");
      if (onRegister) onRegister(formData);
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage("❌ Registration failed. Please try again.");
    }
  };

  const isEmployee = formData.role === "EMPLOYEE";
  const isAdminOrHr = formData.role === "ADMIN" || formData.role === "HR";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 ${
            index === bgIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            filter: "brightness(0.35) blur(1.5px)",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12"
        >
          {/* Left Info Section */}
          <div className="flex-1 text-center lg:text-left text-white">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-purple-100/20 text-purple-200 text-sm font-medium px-3 py-1 rounded-full w-fit mb-4"
            >
              Designed for smarter workforce management
            </motion.span>

            <h2 className="text-4xl font-bold leading-tight text-white">
              Create Your <span className="text-purple-400">NextGen</span> Account
            </h2>
            <p className="mt-3 text-gray-200 text-lg">
              Manage your workforce smarter, faster, and more securely with our Employee Management System.
            </p>

            <div className="mt-8 space-y-4 text-gray-200">
              <span className="font-semibold text-purple-400 text-lg">Why EMS?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Track employee attendance efficiently</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Generate performance reports in real-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Manage leaves and approvals seamlessly</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-purple-400" />
                  <span>Ensure secure employee data storage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 bg-gray-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <MdEmail className="absolute left-3 top-3 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-3 text-purple-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                />
              </div>

              {/* Role */}
              <div className="relative">
                <BsPerson className="absolute left-3 top-3 text-purple-400" />
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                >
                  <option value="" disabled hidden>
                    Select Role
                  </option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="HR">HR</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* Admin/HR specific */}
              {isAdminOrHr && (
                <div className="relative">
                  <BsPerson className="absolute left-3 top-3 text-purple-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                  />
                </div>
              )}

              {/* Employee specific */}
              {isEmployee && (
                <>
                  <div className="relative">
                    <BsPerson className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="relative">
                    <BsPerson className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="relative">
                    <FaRegCalendarAlt className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="date"
                      name="hireDate"
                      required
                      value={formData.hireDate}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="relative">
                    <AiOutlinePhone className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="relative">
                    <HiOutlineBriefcase className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="text"
                      name="position"
                      placeholder="Position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="relative">
                    <BiDollarCircle className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="number"
                      name="salary"
                      placeholder="Salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="relative">
                    <HiOutlineBriefcase className="absolute left-3 top-3 text-purple-400" />
                    <input
                      type="number"
                      name="departmentId"
                      placeholder="Department ID"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white"
                    />
                  </div>
                </>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md font-semibold text-white"
              >
                <FaUserPlus /> Register
              </motion.button>

              {message && (
                <p className="mt-2 text-center text-sm font-medium text-green-400">
                  {message}
                </p>
              )}

              <p className="mt-4 text-center text-sm text-gray-300">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-purple-500 hover:text-purple-300 font-medium"
                >
                  Log in
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/95 py-4 px-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-800 relative z-10">
        <p className="text-gray-300 text-sm">
          © {new Date().getFullYear()} Employee Management System. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}
