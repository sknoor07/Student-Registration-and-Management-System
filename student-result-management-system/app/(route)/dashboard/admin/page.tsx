"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-400 mt-2">
                Manage students, subjects and results.
            </p>
        </div>
    );
}

