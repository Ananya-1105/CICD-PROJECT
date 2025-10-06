import React, { useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import { FaUser, FaUserPlus } from "react-icons/fa";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color="#6366f1"
          distort={0.4}
          speed={2}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* 3D Background */}
      <Canvas className="absolute inset-0 -z-10">
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 2, 5]} />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Overlay */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-black/50">
        {!showLogin && !showRegister ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl"
          >
            <h1 className="text-5xl font-extrabold mb-6 text-indigo-400 drop-shadow-lg">
              Employee Management System
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              A powerful platform to manage employees, HR, and Admin workflows
              seamlessly. Secure login, real-time management, salary tracking,
              and more — built with Spring Boot & React.
            </p>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all text-lg font-semibold"
              >
                <FaUser /> Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition-all text-lg font-semibold"
              >
                <FaUserPlus /> Sign Up
              </button>
            </div>
          </motion.div>
        ) : showLogin ? (
          <LoginPage
            onLogin={(data) => {
              console.log("Login data:", data);
              // integrate API call
            }}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        ) : (
          <RegisterPage
            onRegister={(data) => {
              console.log("Register data:", data);
              // integrate API call
            }}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
