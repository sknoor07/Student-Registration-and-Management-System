"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">
                Admin Dashboard
            </h1>
            <p>Welcome {user?.role}</p>
        </div>
    );
}
