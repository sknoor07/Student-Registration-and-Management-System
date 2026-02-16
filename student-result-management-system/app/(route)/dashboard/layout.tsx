"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Navbar from "./_component/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="p-6">{children}</div>
            </div>
        </ProtectedRoute>
    );
}
