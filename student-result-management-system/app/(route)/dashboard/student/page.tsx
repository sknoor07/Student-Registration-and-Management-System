"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import { useAuth } from "@/context/AuthContext";

export default function StudentDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-zinc-400 mt-2">
                Welcome to your dashboard.
            </p>
        </div>
    );
}

