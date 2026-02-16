"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <GraduationCap className="w-6 h-6 text-indigo-500" />
          SRMS
        </div>

        <div className="flex gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-32">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          Student Result <span className="text-indigo-500">Management</span>{" "}
          System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-2xl text-gray-400 text-lg"
        >
          Manage, track, and analyze student results with a modern, secure,
          and scalable platform designed for schools and universities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10"
        >
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 px-8 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full" />
    </div>
  );
}
