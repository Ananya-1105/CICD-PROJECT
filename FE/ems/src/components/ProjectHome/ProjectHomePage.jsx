import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaTwitter, FaUsers, FaLock, FaDesktop, FaChartLine } from "react-icons/fa";

const bgImages = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1740&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1740&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1740&q=80",
];

const features = [
  {
    icon: <FaUsers className="text-purple-400 text-3xl" />,
    title: "Employee Management",
    desc: "Track employees, attendance, and performance effortlessly.",
  },
  {
    icon: <FaLock className="text-indigo-500 text-3xl" />,
    title: "Secure & Reliable",
    desc: "Keep your HR data safe with enterprise-grade security.",
  },
  {
    icon: <FaChartLine className="text-pink-400 text-3xl" />,
    title: "Analytics & Insights",
    desc: "Generate actionable reports and insights for decision making.",
  },
  {
    icon: <FaDesktop className="text-blue-400 text-3xl" />,
    title: "Modern UI/UX",
    desc: "Responsive, clean, and professional interface for all devices.",
  },
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bgImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-white bg-gray-950">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${bgImages[currentImage]})`,
          filter: "brightness(0.25) blur(3px)",
        }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 lg:px-12 py-32">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg"
        >
          NextGen Workforce
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg sm:text-xl text-purple-200 mb-10 max-w-3xl"
        >
          Streamline employee management, HR workflows, and analytics with a
          professional platform built for modern enterprises. Secure, fast,
          and reliable.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/register"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md font-medium transition transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md font-medium transition transform hover:scale-105"
          >
            Login
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 mt-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Key Features</h2>
          <p className="text-gray-400 mt-2">
            NextGen Workforce provides a professional and efficient solution for modern HR needs.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="w-full sm:w-[45%] lg:w-[22%] bg-gray-900/80 p-6 rounded-xl shadow-lg border border-gray-800 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 15px 25px rgba(0,0,0,0.4)" }}
              transition={{ duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4 text-purple-200">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="relative z-10 mt-20 px-6 lg:px-12 py-20 bg-gray-950 text-gray-100">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-200">Contact Us</h2>
          <p className="text-gray-400 mt-2">
            Have questions or need assistance? Fill out the form and we'll respond promptly.
          </p>
        </div>
        <div className="max-w-4xl mx-auto bg-gray-900/90 p-10 rounded-xl shadow-lg border border-gray-800">
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-800 text-gray-200"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-800 text-gray-200"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-800 text-gray-200"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/90 py-6 px-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-800 mt-16">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} NextGen Workforce. All rights reserved.
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
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-300 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}
